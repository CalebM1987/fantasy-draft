import { ADPPlayersResponse, ScoringFormat, IPlayerDetails, IPlayer } from "../types/players";
import { useAppStore } from "../store";
import { proxiedFetch } from "../utils/fetch";
import { playersResponse } from '../data/players'

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
  const { league } = useAppStore()
  const currentYear = new Date().getFullYear()
  const { format=league?.format ?? 'standard', teams=12, year=currentYear } = (options ?? {}) as IFetchPlayerOptions
  // const url = `https://fantasyfootballcalculator.com/api/v1/adp/${format}?teams=${teams}&year=${year}` 
  // return proxiedFetch<ADPPlayersResponse>(url)
  return playersResponse
}

//https://fantasyfootballcalculator.com/api/v1/players/119

export async function fetchPlayerDetails(player: IPlayer): Promise<IPlayerDetails | undefined> {
  const url = `https://fantasyfootballcalculator.com/api/v1/players/${player.player_id}`
  const resp = await proxiedFetch<IPlayerDetails[]>(url)
  return Array.isArray(resp) ? resp[0]: undefined
}