import { defineStore } from 'pinia'
import { IDraftedPlayer, IPlayer, PlayerPosition } from '../types/players'
import { fetchADP } from '../services/fantasycalculator'
import { saveDraftPick } from '../services/firebase'
import { sortByPropertyInPlace } from '../utils/utils'
import { useAppStore } from './app'
import { log } from '../utils/logger'

interface IPlayersState {
  players: IPlayer[];
  draftPicks: IDraftedPlayer[];
  availablePlayers: IPlayer[];
  positions: PlayerPosition[];
  showAvailableOnly: boolean;
}

// You can name the return value of `defineStore()` anything you want, but it's best to use the name of the store and surround it with `use` and `Store` (e.g. `useUserStore`, `useCartStore`, `useProductStore`)
// the first argument is a unique id of the store across your application
export const usePlayerStore = defineStore('players', {
  state: ()=> ({
    players: [],
    draftPicks: [], //localStorage ? JSON.parse(localStorage.getItem('__fantasyDraftBoard') ?? '[]'): [],
    availablePlayers: [],
    showAvailableOnly: true,
    positions: ["RB", "WR", "TE", "QB", "DEF", "PK"]
  } as IPlayersState),

  getters: {
    playersByPosition: (state)=> {
      const playersByPos = state.positions.reduce((o, i) => ({ ...o, [i]: [] }), {}) as Record<PlayerPosition, IPlayer[]>
  
      (state.showAvailableOnly 
        ? state.availablePlayers
        : state.players
      ).forEach(p => {
        playersByPos[p.position].push(p)
        p.position_rank = playersByPos[p.position].length;
      })
      
      return playersByPos
    },

    draftedPlayerIds: (state)=> state.draftPicks.map(p => p.player_id)

  },

  actions: {

    async draftPlayer(player: IPlayer){
      if (this.draftedPlayerIds.includes(player.player_id)){
        throw Error(`Player has already been drafted: "${player.name}" (${player.player_id})`)
      }
      const appState = useAppStore()
      const drafted = { ...player } as IDraftedPlayer;
      drafted.pickNumber = this.draftPicks.length + 1
      drafted.owner = appState.sortedMembers.find(m => m.picks?.includes(drafted.pickNumber!))
      saveDraftPick(drafted).then((data)=> {
        log('Saved draft pick: ', data)
        
        // if (localStorage){
        //   localStorage.setItem('__fantasyDraftBoard', JSON.stringify(this.draftPicks))
        // }
      })
    },

    addPickToBoard(pick: IDraftedPlayer){
      const player = this.players.find(p => p.player_id === pick.player_id)
      if (!player || this.draftedPlayerIds.includes(pick.player_id)) return;
      this.draftPicks.push(pick)
      this.availablePlayers.splice(this.availablePlayers.indexOf(player), 1)
    },

    removePickFromBoard(pick: IDraftedPlayer){
      const existing = this.draftPicks.find(p => p.player_id === pick.player_id)
      if (existing){
        const index = this.draftPicks.indexOf(existing)
        existing.pickNumber = undefined
        existing.owner = undefined
        this.draftPicks.splice(index, 1)
        this.availablePlayers.push(existing)
        sortByPropertyInPlace(this.availablePlayers, 'rank')
      }
    },

    async fetchPlayers(){
      const adp = await fetchADP()
      log('fetched ADP response: ', adp)
      const players = adp.players
        .filter(p => !this.draftedPlayerIds.includes(p.player_id))

      players.forEach((p,i) => p.rank = i+1)

      this.players = players
      this.availablePlayers = [...players]
    }
  }
})