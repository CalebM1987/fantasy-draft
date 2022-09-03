import { defineStore } from 'pinia'
import { nextTick } from 'process';
import { IAppConfig, ILeagueInfo } from '../types'
import { Screen } from 'quasar'

interface IAppState {
  config?: IAppConfig;
  /** option to use compact view for draft board */
  compactView: boolean;
  /** current value on timer */
  timer: number;
  /** league info */
  league?: ILeagueInfo;
  /** is league manager */
  isLM: boolean;
  /** boolean for whether or not the draft started */
  hasStartedDraft: boolean;
}

export const useAppStore = defineStore('app', {
  state: ()=> ({
    config: undefined,
    compactView: !Screen.lt.md,
    league: undefined,
    hasStartedDraft: false,
    timer: 120 * 1000,
    isLM: false
  } as IAppState),
  
  getters: {
    screen: ()=> Screen,
    rosterSize: (state)=> state.league?.roster?.size ?? 15,
    // time limit for each pick
    timeLimit: (state)=> (state.league?.timeLimit ?? 120) * 1000,
    sortedMembers: (state) => {
      const members = state.league 
        ? state.league.members.every(t => !!t.draftOrder) ? state.league.members.sort((a,b) => (a.draftOrder > b.draftOrder) ? 1: -1): [...state.league.members]
        : []

      members.forEach(m => m.picks = [])

      const roster = state.league?.roster?.size ?? 14
      const draftType = state.league?.draftType ?? 'snake'
      for (let ri = 0; ri < roster; ri++){
        // add pick for each round
        members.forEach((m, ti)=> {
          m.picks!.push((ri*members.length) + Math.abs(draftType === 'snake' && (ri > 0  && (ri % 2)) ? members.length-ti: ti+1))
        })
      }  
      return members
    }
  },

  actions: {
    setConfig(config: IAppConfig){
      this.config = config
      nextTick(()=> this.timer = (this.league?.timeLimit ?? 120) * 1000)
    }
  }
})

