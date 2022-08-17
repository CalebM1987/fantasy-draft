import { PlayerPosition, ScoringFormat } from "./players";

export interface IRosterSettings {
  /** size of roster (will corellate to number of rounds) */
  size: number;
  /** positions required for roster */
  positions: PlayerPosition[];
}

export interface ILeagueMember {
  /** the member's name */
  name: string;
  /** team name */
  teamName: string;
  /** draft order */
  draftOrder: number;
  /** email address */
  email: string;
}

export interface ILeagueInfo {
  /** the league name */
  name: string;
  /** the scoring format */
  format: ScoringFormat;
  /** draft type */
  draftType: "snake" | "auction";
  /** roster settings */
  roster?: IRosterSettings;
  /** time limit for each pick (in seconds) */
  timeLimit?: number;
  /** the league members */
  members: ILeagueMember[];
}

export interface IAppConfig {
  /** the url to the fantasy football calculator adp api */
  apiUrl: string;
  /** the league information */
  league: ILeagueInfo;
}