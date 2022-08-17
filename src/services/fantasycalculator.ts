import { ADPPlayersResponse, ScoringFormat } from "../types/players";
import { fetchJson } from "../utils/fetch";

// https://fantasyfootballcalculator.com/api/v1/adp/half-ppr?teams=12&year=2022

export interface IFetchPlayerOptions {
  /** the scoring format */
  format?: ScoringFormat;
  /** number of teams */
  teams?: number;
  /** league year */
  year?: number;

}

/**
 * fetch players Average Draft Position (ADP)
 * @param options - options for ADP query
 * @returns the ADP response
 */
export async function fetchADP(options?: IFetchPlayerOptions): Promise<ADPPlayersResponse> {
  const currentYear = new Date().getFullYear()
  const { format='standard', teams=12, year=currentYear } = (options ?? {}) as IFetchPlayerOptions
  const url = `https://fantasyfootballcalculator.com/api/v1/adp/${format}?teams=${teams}&year=${year}` 
  return fetchJson<ADPPlayersResponse>(url)
}