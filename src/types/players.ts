import { ILeagueMember } from "./app";

export type ScoringFormat = "standard" | "half-ppr" | "ppr";

export type DraftType = "snake" | "auction";

export type FilterType = "top-200" | "positions" | "favorites";

export type PlayerListType = "all" | "available";

export type RosterFormat = "standard" | "two-qb" | "custom";

export interface ADPPlayersResponseMeta {
  type: string;
  teams: number;
  rounds: number;
  total_drafts: number;
  start_date: string;
  end_date: string;
}

export interface PlayerNews {
  id: number
  title: string
  content: string
  updated_at: string
  first_name: string
  last_name: string
  position: string
  team: string
  player_image: string
  priority: number
  analysis: string
}

export interface Adp {
  standard: string
  ppr: string
  "half-ppr": string
  "2qb": string
  dynasty: string
  rookie: any
}
