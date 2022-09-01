// Import the functions you need from the SDKs you need
import { nextTick, ref } from 'vue'
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  set, 
  push,
  query,
  onValue,
  remove,
  getDatabase, 
  onChildAdded, 
  onChildRemoved, 
  onChildChanged,
  ref as fbRef, 
  DatabaseReference, 
  Unsubscribe
} from 'firebase/database'

import { useAppStore, usePlayerStore } from "../store";
import { DraftClockOperation, IDraftClockStatus, IDraftedPlayer } from '../types';
import { useDraftClock } from '../composables/draft-clock';
import { localeDateTime } from '../utils/utils';
import { log } from "../utils/logger";


const handlers = ref<Unsubscribe[]>([])

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  // apiKey: import.meta.env.VITE_API_KEY,
  // authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  // projectId: import.meta.env.VITE_PROJECT_ID,
  // storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  // messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  // appId: import.meta.env.VITE_APP_ID,
  // measurementId: import.meta.env.VITE_MEASUREMENT_ID,
  apiKey: "AIzaSyAu7eqVMUTBCR5tQaHbi-nR41CkdiHi7M8",
  authDomain: "fantasy-football-draft-d858f.firebaseapp.com",
  projectId: "fantasy-football-draft-d858f",
  storageBucket: "fantasy-football-draft-d858f.appspot.com",
  messagingSenderId: "948347030107",
  appId: "1:948347030107:web:3b45426b32a32244518d7e",
  measurementId: "G-2HMTFW2L45"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const analytics = getAnalytics(app);
const db = getDatabase()

const picksKey = 'draft-picks'

export function getLeagueId(): string | number | undefined {
  const { league } = useAppStore()
  return league?.id
}

export function clearDraftBoard(){
  const leagueRef = getReference()
  if (!leagueRef) return;
  return remove(leagueRef)
}

export function getReference(name?: string, key?: string | number): DatabaseReference {
  const leagueId = getLeagueId()
  if (!leagueId){
    throw new Error("No League ID has been provided")
  }
  const path = `${name ?? picksKey}/${leagueId}${key ? '/' + key: ''}`
  return fbRef(db, path)
}

export async function updateLeagueClock(operation: DraftClockOperation, time?: number){
  const appState = useAppStore()
  const timeRef = getReference('draft-clock')
  const message = operation === 'pause' 
    ? 'the League Manager has paused the clock'
    : operation === 'start'
      ? 'the League Manager has started the clock'
      : ''

  await set(timeRef, {
    time: time ?? appState.timer,
    timestamp: new Date().getTime(),
    operation,
    message
  })
}

export function removeDraftPick(key: string){
  const leagueId = getLeagueId()
  if (!leagueId){
    throw new Error("No League ID has been provided")
  }
  const pickRef = fbRef(db, `${picksKey}/${leagueId}/${key}`)
  log('pickRef is: ', pickRef)
  remove(pickRef)
}

export function saveDraftPick(pick: IDraftedPlayer){
  const leagueRef = getReference()
  const newPickRef = push(leagueRef);
  set(newPickRef, pick);
  return newPickRef
}

export function setRealtimeHandlers(){
  const leagueRef = getReference()
  const timeRef = getReference('draft-clock')
  if (!leagueRef) return [];
  const players = usePlayerStore()

  const addPickSub = onChildAdded(leagueRef, (snapshot)=> {
    const pick = snapshot.val() as IDraftedPlayer
    log('new pick detected', pick)
    players.addPickToBoard(pick, snapshot.key!)
    
  })

  const remPickSub = onChildRemoved(leagueRef, (snapshot)=> {
    const pick = snapshot.val() as IDraftedPlayer
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

// export async function loadDraftPicks(): Promise<IDraftedPlayer[]> {
  
// }