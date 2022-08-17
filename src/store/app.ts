import { defineStore } from 'pinia'
import { IAppConfig, ILeagueInfo } from '../types/config'

interface IAppState {
  config?: IAppConfig;
  /** option to use compact view for draft board */
  compactView: boolean;
  /** the time limit for each draft pick */
  timeLimit: number;
  /** current value on timer */
  timer: number;
  /** league info */
  league?: ILeagueInfo;
}

export const useAppStore = defineStore('players', {
  state: ()=> ({
    config: undefined,
    compactView: true,
    league: undefined,
    timer: 0,
  } as IAppState),
  
  getters: {
    sortedMembers: (state) => state.league 
      ? state.league.members.every(t => !!t.draftOrder) ? state.league.members.sort((a,b) => (a.draftOrder > b.draftOrder) ? 1: -1): [...state.league.members]
      : []
  }
})

