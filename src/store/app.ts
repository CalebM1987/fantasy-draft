import { defineStore } from 'pinia'
import { nextTick } from 'process';
import { IAppConfig, ILeagueInfo } from '../types'
import { Screen } from 'quasar'
import { EventBus } from '../events/event-bus';

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
  /** has loaded league */
  hasLoadedLeague: boolean;
}

export const useAppStore = defineStore('app', {
  state: ()=> ({
    config: undefined,
    compactView: !Screen.lt.md,
    league: undefined,
    hasStartedDraft: false,
    timer: 120 * 1000,
    isLM: false,
    hasLoadedLeague: false
  } as IAppState),
  
  getters: {
    screen: ()=> Screen,
    rosterSize: (state)=> state.league?.roster?.size ?? 15,
    // time limit for each pick
    timeLimit: (state)=> (state.league?.draft?.timeLimit ?? 120) * 1000,
    sortedMembers: (state) => {
      const members = state.league 
        ? state.league.members.every(t => !!t.draftOrder) ? state.league.members.sort((a,b) => (a.draftOrder > b.draftOrder) ? 1: -1): [...state.league.members]
        : []

      members.forEach(m => m.picks = [])

      const roster = state.league?.roster?.size ?? 14
      const draftType = state.league?.draft?.type ?? 'snake'
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
      nextTick(()=> {
        if (this.league){
          EventBus.emit('has-loaded-league', this.league)
        }
        this.timer = (this.league?.draft?.timeLimit ?? 120) * 1000
      })
    }
  }
})

