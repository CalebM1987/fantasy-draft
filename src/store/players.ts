import { defineStore } from 'pinia'
import { IPlayer, PlayerPosition } from '../types/players'
import { fetchADP } from '../services/fantasycalculator'
import { log } from '../utils/logger'

interface IPlayersState {
  players: IPlayer[];
  availablePlayers: IPlayer[];
  positions: PlayerPosition[];
  showAvailableOnly: boolean;
}

// You can name the return value of `defineStore()` anything you want, but it's best to use the name of the store and surround it with `use` and `Store` (e.g. `useUserStore`, `useCartStore`, `useProductStore`)
// the first argument is a unique id of the store across your application
export const usePlayerStore = defineStore('players', {
  state: ()=> ({
    players: [],
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
    }
  },

  actions: {
    async fetchPlayers(){
      const adp = await fetchADP()
      log('fetched ADP response: ', adp)
      adp.players.forEach((p,i) => p.rank = i+1)
      this.players = adp.players
      this.availablePlayers = [...adp.players]
    }
  }
})