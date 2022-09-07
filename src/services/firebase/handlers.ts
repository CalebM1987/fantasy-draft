import { nextTick, ref } from 'vue'
import { getReference } from './core';
import { useAppStore, usePlayerStore } from "../../store";
import {
  onValue,
  onChildAdded, 
  onChildRemoved, 
  Unsubscribe
} from 'firebase/database'

import { useDraftClock } from '../../composables/draft-clock';
import { localeDateTime } from '../../utils';
import { IPlayer, IDraftClockStatus } from '../../types';
import { log } from "../../utils/logger";


export const handlers = ref<Unsubscribe[]>([])

export function setRealtimeHandlers(){
  const leagueRef = getReference()
  const timeRef = getReference('draft-clock')
  if (!leagueRef) return [];
  const players = usePlayerStore()

  const addPickSub = onChildAdded(leagueRef, (snapshot)=> {
    const pick = snapshot.val() as IPlayer
    log('new pick detected', pick)
    players.addPickToBoard(pick, snapshot.key!)
    
  })

  const remPickSub = onChildRemoved(leagueRef, (snapshot)=> {
    const pick = snapshot.val() as IPlayer
    log('pick removed from board', pick)
    players.removePickFromBoard(pick)
  })

  const timeChangedSub = onValue(timeRef, (snapshot)=> {

    const { startTimer, pauseTimer, resetTimer, publicMessage, isTicking, displayClock } = useDraftClock()
    const appState = useAppStore()
    const playerState = usePlayerStore()
    if (!playerState.onTheClock){
      log('skipping draft clock because draft is complete')
      return
    }
    const status = snapshot.val() as IDraftClockStatus
    appState.timer = status.time
    publicMessage.value = status.message ?? undefined

    // auto hide messages
    if (status.operation === 'start'){
      setTimeout(()=> isTicking.value ? publicMessage.value = undefined: null, 5000)
    }

    log('rt-db: draft timer updated: ', status)
    if (status.operation === 'start'){
      // display clock for other users
      if (!appState.hasStartedDraft){
        if (status.timestamp){
          log('the clock is already running, need to sync with time: ', localeDateTime(status.timestamp))
          // need to sync the running clock
          const now = new Date().getTime()
          // round up to nearest second
          const diff = now - status.timestamp
          log('milliseconds difference: ', diff)
          const adjusted = Math.round(diff / 1000) * 1000
          log('adjusted seconds diff: ', adjusted / 1000, displayClock(appState.timer - adjusted))
          // sync the clock from the last known start
          log('target timer value: ', appState.timer - adjusted)
          appState.timer -= adjusted
          log('adjusted timer after sync: ', appState.timer)
          nextTick(()=> startTimer())
          log('finished draft clock sync')
        }
        appState.hasStartedDraft = true
      } else {
        startTimer()
      }
      
    } else if (status.operation === 'pause'){
      pauseTimer()
      // display clock for other users
      if (!appState.hasStartedDraft){
        appState.hasStartedDraft = true
      }
    } else {
      resetTimer({ start: true })
    }

  })

  handlers.value.push(...[ addPickSub, remPickSub, timeChangedSub ])
}

export function removeRealtimeHandlers(){
  handlers.value.forEach(h => h())
}