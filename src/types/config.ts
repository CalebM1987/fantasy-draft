import { PlayerPosition, ScoringFormat, RosterFormat, DraftType } from "./players";
import { ILeagueMember } from "./app";

export interface IRosterSettings {
  /** the roster format  */
  format?: RosterFormat;
  /** size of roster (will corelate to number of rounds) */
  size: number;
  /** positions required for roster */
  positions: PlayerPosition[];
}

export interface IDraftSettings {
  /** the draft type format */
  type?: DraftType;
  /** time limit for each pick (in seconds) */
  timeLimit?: number;
}

export type LeaguePlatform = 'espn' | 'yahoo' | 'sleeper';

export interface ILeagueInfo {
  /** the league ID */
  id: number | string;
  /** the league name */
  name: string;
  /** league platform */
  platform: LeaguePlatform;
  /** the number of teams */
  numberOfTeams: number;
  /** the scoring format */
  format: ScoringFormat;
  /** the draft settings */
  draft: IDraftSettings;
  /** roster settings */
  roster?: IRosterSettings;
  /** the league members */
  members: ILeagueMember[];
}

export interface IAppConfig {
  /** the url to the fantasy football calculator adp api */
  apiUrl: string;
  /** the league information */
  leagues: ILeagueInfo[];
}