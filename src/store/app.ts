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
  /** is league manager */
  isLM: boolean;
}

export const useAppStore = defineStore('app', {
  state: ()=> ({
    config: undefined,
    compactView: true,
    league: undefined,
    timer: 0,
    isLM: false
  } as IAppState),
  
  getters: {
    rosterSize: (state)=> state.league?.roster?.size ?? 15,
    sortedMembers: (state) => {
      const members = state.league 
        ? state.league.members.every(t => !!t.draftOrder) ? state.league.members.sort((a,b) => (a.draftOrder > b.draftOrder) ? 1: -1): [...state.league.members]
        : []

      members.forEach(m => m.picks = [])

      const roster = state.league?.roster?.size ?? 14
      const draftType = state.league?.draftType ?? 'snake'
      // (ri*appState.sortedMembers.length) + Math.abs(draftType === 'snake' && (ri > 0  && (ri % 2)) ? appState.sortedMembers.length-ti: ti+1)
      for (let ri = 0; ri < roster; ri++){
        // add pick for each round
        members.forEach((m, ti)=> {
          m.picks!.push((ri*members.length) + Math.abs(draftType === 'snake' && (ri > 0  && (ri % 2)) ? members.length-ti: ti+1))
        })
      }  
      return members
    }

  }
})

