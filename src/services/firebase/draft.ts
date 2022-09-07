import { getReference, getLeagueId, db } from "./core";
import {
  set, 
  push,
  remove,
  ref as fbRef
} from 'firebase/database'

import { useAppStore } from "../../store";
import { IPlayer } from "../../types";
import { updateLeagueClock } from "./clock";
import { log } from "../../utils";

const picksKey = 'draft-picks'

export function clearDraftBoard(){
  const leagueRef = getReference()
  if (!leagueRef) return;
  return remove(leagueRef)
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

export function saveDraftPick(pick: IPlayer){
  const leagueRef = getReference()
  const newPickRef = push(leagueRef);
  set(newPickRef, pick);
  return newPickRef
}