import { ILeagueMember } from "./app";

export type ScoringFormat = "standard" | "half-ppr" | "ppr";

export type PlayerPosition = 
  | "QB"
  | "RB"
  | "WR"
  | "TE"
  | "PK"
  | "DEF"

export type FlexPositions =
  | "RB"
  | "WR"
  | "TE"

export type RosterSpot = PlayerPosition | "FLEX" | "BENCH";

export type FilterType = "top-200" | "positions" | "favorites";

export type PlayerListType = "all" | "available";

export interface ADPPlayersResponseMeta {
  type: string;
  teams: number;
  rounds: number;
  total_drafts: number;
  start_date: string;
  end_date: string;
}

export interface IPlayer {
  player_id: number;
  name: string;
  position: PlayerPosition;
  team: string;
  adp: number;
  adp_formatted: string;
  times_drafted: number;
  high: number;
  low: number;
  stdev: number;
  bye: number;
  rank?: number;
  position_rank?: number;
}

export interface IDraftedPlayer extends IPlayer {
  pickNumber?: number;
  owner?: ILeagueMember;
}

export interface ADPPlayersResponse {
  status: string;
  meta: ADPPlayersResponseMeta;
  players: IPlayer[];
}

export interface IPlayerDetails {
  player_id: number;
  first_name: string;
  last_name: string;
  full_name: string;
  team: string;
  position: string;
  bye: number;
  rookie: boolean;
  image_url?: string;
  age?: number;
  height?: string;
  weight?: string;
  college?: string;
  jersey_number?: string;
  news: PlayerNews[];
  adp: Adp;
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
