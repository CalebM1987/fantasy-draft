// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  getDatabase, 
  ref as fbRef, 
  DatabaseReference, 
} from 'firebase/database'
import firebaseConfig from './firebaseConfig';

import { useAppStore} from "../../store";

// Initialize Firebase
export const app = initializeApp(firebaseConfig)
export const analytics = getAnalytics(app);
export const db = getDatabase()

export function getLeagueId(): string | number | undefined {
  const { league } = useAppStore()
  return league?.id
}

export function getReference(name?: string, key?: string | number): DatabaseReference {
  const leagueId = getLeagueId()
  if (!leagueId){
    throw new Error("No League ID has been provided")
  }
  const path = `${name ?? 'draft-picks'}/${leagueId}${key ? '/' + key: ''}`
  return fbRef(db, path)
}





