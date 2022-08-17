import { defineStore } from 'pinia'
import { IAppConfig } from '../types/config'

interface IAppState {
  config?: IAppConfig;
  /** option to use compact view for draft board */
  compactView: boolean;
}

export const useAppStore = defineStore('players', {
  state: ()=> ({
    config: undefined,
    compactView: true
  } as IAppState),
  
  getters: {
    sortedMembers: (state) => state.config 
      ? state.config.league.members.every(t => !!t.draftOrder) ? state.config.league.members.sort((a,b) => (a.draftOrder > b.draftOrder) ? 1: -1): [...state.config.league.members]
      : []
  }
})

