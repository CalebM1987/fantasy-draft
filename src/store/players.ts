import { defineStore } from 'pinia'
import { PlayerListType, FreeAgent, NFLTeams, IPlayer, IPlayerDetails, PlayerPosition, NFLTeamID } from '../types'
import { fetchEspnPlayers } from '../services/espn'
import { saveDraftPick, clearDraftBoard, updateLeagueClock } from '../services/firebase'
import { loadFromStorage, saveToStorage, clonePlayer, sortByPropertyInPlace } from '../utils'
import { useDraftClock } from '../composables/draft-clock';
import { setRealtimeHandlers } from '../services/firebase'
import { useAppStore } from './app'
import { log } from '../utils/logger'

interface IPlayersState {
  players: IPlayer[];
  draftPicks: IPlayer[];
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
  byeWeeks: Partial<Record<NFLTeamID, number>>;
}

const nflTeams: NFLTeams[] = ['ATL', 'BUF', 'CHI', 'CIN', 'CLE', 'DAL', 'DEN', 'DET', 'GB', 'TEN', 'IND', 'KC', 'LV', 'LAR', 'MIA', 'MIN', 'NE', 'NO', 'NYG', 'NYJ', 'PHI', 'ARI', 'PIT', 'LAC', 'SF', 'SEA', 'TB', 'WSH', 'CAR', 'JAX', 'BAL', 'HOU']

// You can name the return value of `defineStore()` anything you want, but it's best to use the name of the store and surround it with `use` and `Store` (e.g. `useUserStore`, `useCartStore`, `useProductStore`)
// the first argument is a unique id of the store across your application
export const usePlayerStore = defineStore('players', {
  state: ()=> ({
    players: [],
    draftPicks: [], //localStorage ? JSON.parse(localStorage.getItem('__fantasyDraftBoard') ?? '[]'): [],
    availablePlayers: [],
    showAvailableOnly: true,
    positions: ["RB", "WR", "TE", "QB", "D/ST", "K"],
    playerDetailsCache: {},
    pickLookup: {},
    favorites: loadFromStorage<number[]>('_draft_favorites', []),
    listType: 'available',
    search: '',
    nflTeams,
    byeWeeks: {}
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

    draftedPlayerIds: (state)=> state.draftPicks.map(p => p.id),

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
        ? viewList.filter(p => regEx.test(p.fullName)) 
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
      if (this.draftedPlayerIds.includes(player.id)){
        throw Error(`Player has already been drafted: "${player.fullName}" (${player.id})`)
      }

      const appState = useAppStore()
      const drafted = clonePlayer(player)
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
      if (!this.favorites.includes(player.id)){
        this.favorites.push(player.id)
        saveToStorage('_draft_favorites', this.favorites)
        log(`added player to favorites "${player.fullName}"`)
      }
    },

    removeFromFavorites(player: IPlayer | IPlayer){
      this.favorites = this.favorites.filter(pid => pid != player.id)
      saveToStorage('_draft_favorites', this.favorites)
      log(`removed player from favorites "${player.fullName}"`)
    },

    addPickToBoard(pick: IPlayer, key: string){
      const player = this.players.find(p => p.id === pick.id)
      if (!player || this.draftedPlayerIds.includes(pick.id)) return;
      this.draftPicks.push(pick)
      this.pickLookup[pick.id] = key
      this.availablePlayers.splice(this.availablePlayers.indexOf(player), 1)
      this.removeFromFavorites(pick)
    },

    removePickFromBoard(pick: IPlayer){
      const existing = this.draftPicks.find(p => p.id === pick.id)
      if (existing){
        const index = this.draftPicks.indexOf(existing)
        existing.pickNumber = undefined
        existing.owner = undefined
        this.draftPicks.splice(index, 1)
        delete this.pickLookup[existing.id]
        this.availablePlayers.push(existing)
        sortByPropertyInPlace(this.availablePlayers, 'rank')
      }
    },

    async fetchPlayers(){
      const adp = await fetchEspnPlayers()
      log('fetched ADP response: ', adp)
      const players = adp
        .filter(p => !this.draftedPlayerIds.includes(p.id))

      players.forEach((p,i) => p.rank = i+1)

      this.players = players
      this.availablePlayers = [...players]
      setRealtimeHandlers()
    },

    clearDraftBoard
  }
})