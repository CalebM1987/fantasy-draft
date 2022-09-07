import { delay, fetchJson, sortByPropertyInPlace } from "../../utils";
import { 
  EspnPositionID, 
  IPlayer, 
  IEspnPlayerCard, 
  NFLTeamID, 
  INFLTeamInfo, 
  INFLTeamsResponse, 
  IPlayerDetails
} from "../../types/espn";
import { 
  defaultFilters, 
  slotCategoryIdToPositionMap,
  nflTeamIdToNFLTeams 
} from "./constants";
import { isDev } from '../../utils'
import { playersResponse } from "../../data/espn-players";
import { usePlayerStore } from "../../store";
import { log } from "../../utils";

export async function fetchEspnPlayers(): Promise<IPlayer[]>{
  const playerState = usePlayerStore()
  const byes = await getNFLTeamByeWeeks()
  playerState.byeWeeks = byes

  const url = `https://fantasy.espn.com/apis/v3/games/ffl/seasons/${new Date().getFullYear()}/players?scoringPeriodId=0&view=kona_playercard`

  const headers = new Headers()
  headers.append('x-fantasy-filter', JSON.stringify(defaultFilters))

  // pull players from cache
  const resp = playersResponse

  // let resp: IEspnPlayerCard[] = []
  // await delay(750)
  // resp = playersResponse
  // log('grabbed players from local dev cache')
  // if (isDev){
  //   // pull from dev cache (simulate long request)
  //   await delay(750)
  //   resp = playersResponse
  //   log('grabbed players from local dev cache')
  // } else {
  //   try {
  //     resp = await fetchJson<IEspnPlayerCard[]>(url, {
  //       headers
  //     })
  //     log('pulled players from ESPN')
  //   } catch(err){
  //     log('could not fetch player data from ESPN: ', err)
  //     // default to dev cache in case something went wrong
  //     resp = playersResponse
  //   }
  // }

  const skip = ['rankings', 'variance', 'stats', 'draftRanksByRankType']
  const skipPosIds = [1, 3, 5, 25]
  
  const players = resp.map(p => {
    let pid = p.defaultPositionId as unknown as EspnPositionID
    if (skipPosIds.includes(pid) || p.eligibleSlots.some(v => [3, 5].includes(v))){
      pid = p.eligibleSlots.filter(s => !skipPosIds.includes(s))[0] as unknown as EspnPositionID
    }
    const team = nflTeamIdToNFLTeams[p.proTeamId as unknown as NFLTeamID]

    return {
      ...p,
      team,
      position: slotCategoryIdToPositionMap[pid],
      adp: p.ownership.averageDraftPosition,
      bye: byes[p.proTeamId] ?? -1
    } as IPlayer
  })

  sortByPropertyInPlace(players, 'adp')

  players.forEach((p,i) => {
    p.rank = i+1
    for (const k of skip){
      // @ts-ignore
      delete p[k]
    }
  })

  return players
}

export async function getNFLTeams(): Promise<INFLTeamInfo[]> {
  const url = `https://fantasy.espn.com/apis/v3/games/ffl/seasons/${new Date().getFullYear()}?view=proTeamSchedules_wl`
  const resp = await fetchJson<INFLTeamsResponse>(url)
  return resp.settings.proTeams
}

export async function getNFLTeamByeWeeks(): Promise<Record<NFLTeamID, number>> {
  const teams = await getNFLTeams()
  return teams.reduce((o, t) => ({...o, [t.id]: t.byeWeek}), {}) as Record<NFLTeamID, number>

}

export function fetchPlayerDetails(player: IPlayer | number): Promise<IPlayerDetails>{
  const pid = typeof player === 'number' ? player: player.id
  const url = 'https://site.api.espn.com/apis/fantasy/v2/games/ffl/news/players?days=30&playerId=' + pid
  return fetchJson<IPlayerDetails>(url)

}