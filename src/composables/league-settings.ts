import { ref, reactive } from "vue";
import { useAppStore } from "../store";
import { 
  PlayerPosition,
  ILeagueInfo,
  RosterSpot,
  ScoringFormat,
  RosterFormat 
} from '../types'

import { createLeagueTemplate } from "../utils/league";

export const standardRosterPositions: RosterSpot[] = [
  'QB',
  'RB',
  'RB',
  'WR',
  'WR',
  'TE',
  'FLEX',
  'D/ST',
  'K'
]

export const twoQBRosterPositions: RosterSpot[] = [ ...standardRosterPositions, 'QB']

export function useLeagueSettings(league: ILeagueInfo) {
  
  
}