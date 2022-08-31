// Import the functions you need from the SDKs you need
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
  ref as fbRef, 
  DatabaseReference 
} from 'firebase/database'
import { IDraftedPlayer } from "../types/players";
import { useAppStore, usePlayerStore } from "../store";
import { log } from "../utils/logger";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
  measurementId: import.meta.env.VITE_MEASUREMENT_ID,

};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
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

export function getReference(name?: string): DatabaseReference {
  const leagueId = getLeagueId()
  if (!leagueId){
    throw new Error("No League ID has been provided")
  }
  const path = `${name ?? picksKey}/${leagueId}`
  return fbRef(db, path)
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
  if (!leagueRef) return [];
  const players = usePlayerStore()

  const addSub = onChildAdded(leagueRef, (snapshot)=> {
    const pick = snapshot.val() as IDraftedPlayer
    log('new pick detected', pick)
    players.addPickToBoard(pick, snapshot.key!)
    
  })

  const remSub = onChildRemoved(leagueRef, (snapshot)=> {
    const pick = snapshot.val() as IDraftedPlayer
    log('pick removed from board', pick)
    players.removePickFromBoard(pick)
  })

  return [ addSub, remSub ]
}

// export async function loadDraftPicks(): Promise<IDraftedPlayer[]> {
  
// }