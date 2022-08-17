import { ILeagueMember } from "./app";

export type ScoringFormat = "standard" | "half-ppr" | "ppr";

export type PlayerPosition = 
  | "QB"
  | "RB"
  | "WR"
  | "TE"
  | "PK"
  | "DST"

export type FlexPositions =
  | "RB"
  | "WR"
  | "TE"

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
  position: string;
  team: string;
  adp: number;
  adp_formatted: string;
  times_drafted: number;
  high: number;
  low: number;
  stdev: number;
  bye: number;
}

export interface IDraftedPlayer {
  pickNumber?: number;
  owner?: ILeagueMember;
}

export interface ADPPlayersResponse {
  status: string;
  meta: ADPPlayersResponseMeta;
  players: IPlayer[];
}