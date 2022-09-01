import { defineStore } from 'pinia'
import { PlayerListType, FreeAgent, NFLTeams, IDraftedPlayer, IPlayer, IPlayerDetails, PlayerPosition } from '../types/players'
import { fetchADP } from '../services/fantasycalculator'
import { saveDraftPick, clearDraftBoard, updateLeagueClock } from '../services/firebase'
import { sortByPropertyInPlace } from '../utils/utils'
import { useAppStore } from './app'
import { loadFromStorage, saveToStorage } from '../utils/storage'
import { useDraftClock } from '../composables/draft-clock';
import { log } from '../utils/logger'

interface IPlayersState {
  players: IPlayer[];
  draftPicks: IDraftedPlayer[];
  availablePlayers: IPlayer[];
  positions: PlayerPosition[];
  showAvailableOnly: boolean;
  playerDetailsCache: Record<number, IPlayerDetails>;
  pickLookup: Record<number, string>;
  favorites: number[];
  listType: PlayerListType;
  /** the current global search string filter */
  search: string;
  nflTeams: (NFLTeams | FreeAgent)[];
}

const nflTeams = ['ARI', 'ATL', 'BAL', 'BUF', 'CAR', 'CHI', 'CIN', 'CLE', 'DAL', 'DEN', 'DET', 'FA', 'GB', 'HOU', 'IND', 'JAX', 'KC', 'LAC', 'LAR', 'LV', 'MIA', 'MIN', 'NE', 'NO', 'NYG', 'NYJ', 'PHI', 'PIT', 'SEA', 'SF', 'TB', 'TEN', 'WAS']

// You can name the return value of `defineStore()` anything you want, but it's best to use the name of the store and surround it with `use` and `Store` (e.g. `useUserStore`, `useCartStore`, `useProductStore`)
// the first argument is a unique id of the store across your application
export const usePlayerStore = defineStore('players', {
  state: ()=> ({
    players: [],
    draftPicks: [], //localStorage ? JSON.parse(localStorage.getItem('__fantasyDraftBoard') ?? '[]'): [],
    availablePlayers: [],
    showAvailableOnly: true,
    positions: ["RB", "WR", "TE", "QB", "DEF", "PK"],
    playerDetailsCache: {},
    pickLookup: {},
    favorites: loadFromStorage<number[]>('_draft_favorites', []),
    listType: 'available',
    search: '',
    nflTeams
  } as IPlayersState),

  getters: {
    playersByPosition: (state)=> {
      const playersByPos = state.positions.reduce((o, i) => ({ ...o, [i]: [] }), {}) as Record<PlayerPosition, IPlayer[]>
      (state.listType === 'available' 
        ? state.availablePlayers
        : state.players
      ).forEach(p => {
        playersByPos[p.position].push(p)
        p.position_rank = playersByPos[p.position].length;
      })
      
      return playersByPos
    },

    draftedPlayerIds: (state)=> state.draftPicks.map(p => p.player_id),

    totalPickCount: (_)=> {
      const appState = useAppStore()
      if (appState.league){
        return appState.league.members.length * appState.rosterSize
      }
      return 0
    },

    playerList: (state)=> {
      const viewList = state.listType === 'all' 
        ? state.players
        : state.availablePlayers
      
      const regEx = RegExp(state.search, 'i')
      return state.search.length >= 2
        ? viewList.filter(p => regEx.test(p.name)) 
        : viewList
    },

    onTheClock: (state)=> {
      const appState = useAppStore()
      const thisPick = state.draftPicks.length + 1
      return appState.sortedMembers.find(p => p.picks?.includes(thisPick))
    }

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
      const { pauseTimer } = useDraftClock()
      pauseTimer()
      saveDraftPick(drafted).then((data)=> {
        log('Saved draft pick: ', data)
        updateLeagueClock('reset', appState.timeLimit)
        // if (localStorage){
        //   localStorage.setItem('__fantasyDraftBoard', JSON.stringify(this.draftPicks))
        // }
      })
    },

    addToFavorites(player: IPlayer){
      if (!this.favorites.includes(player.player_id)){
        this.favorites.push(player.player_id)
        saveToStorage('_draft_favorites', this.favorites)
        log(`added player to favorites "${player.name}"`)
      }
    },

    removeFromFavorites(player: IPlayer | IDraftedPlayer){
      this.favorites = this.favorites.filter(pid => pid != player.player_id)
      saveToStorage('_draft_favorites', this.favorites)
      log(`removed player from favorites "${player.name}"`)
    },

    addPickToBoard(pick: IDraftedPlayer, key: string){
      const player = this.players.find(p => p.player_id === pick.player_id)
      if (!player || this.draftedPlayerIds.includes(pick.player_id)) return;
      this.draftPicks.push(pick)
      this.pickLookup[pick.player_id] = key
      this.availablePlayers.splice(this.availablePlayers.indexOf(player), 1)
      this.removeFromFavorites(pick)
    },

    removePickFromBoard(pick: IDraftedPlayer){
      const existing = this.draftPicks.find(p => p.player_id === pick.player_id)
      if (existing){
        const index = this.draftPicks.indexOf(existing)
        existing.pickNumber = undefined
        existing.owner = undefined
        this.draftPicks.splice(index, 1)
        delete this.pickLookup[existing.player_id]
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
    },

    clearDraftBoard
  }
})