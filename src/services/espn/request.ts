import { fetchJson, sortByPropertyInPlace } from "../../utils";
import { EspnPositionID, IEspnPlayer, IEspnPlayerCard, NFLTeamID, StatID } from "../../types/espn";
import { 
  statsLookup,
  defaultFilters, 
  positionToSlotIDMap,
  slotCategoryIdToPositionMap,
  nflTeamIdToNFLTeamAbbreviation 
} from "./constants";

export async function fetchPlayers(): Promise<IEspnPlayer[]>{
  const url = `https://fantasy.espn.com/apis/v3/games/ffl/seasons/${new Date().getFullYear()}/players?scoringPeriodId=0&view=kona_playercard`

  const headers = new Headers()
  headers.append('x-fantasy-filter', JSON.stringify(defaultFilters))

  const resp = await fetchJson<IEspnPlayerCard[]>(url, {
    headers
  })

  const skip = ['rankings', 'variance', 'stats']
  
  const players = resp.map(p => {
    let pid = p.defaultPositionId as unknown as EspnPositionID
    if (pid == '3' || pid == '5' || pid == '25'){
      pid = p.eligibleSlots.filter(s => s != 3 && s != 5 && s != 25)[0] as unknown as EspnPositionID
    }

    return {
      ...p,
      position: slotCategoryIdToPositionMap[pid],
      team: nflTeamIdToNFLTeamAbbreviation[p.proTeamId as unknown as NFLTeamID],
      adp: p.ownership.averageDraftPosition,
    } as IEspnPlayer
  })
  sortByPropertyInPlace(players, 'adp')

  players.forEach((p,i) => {
    for (const k of skip){
      // @ts-ignore
      delete p[k]
    }

    // update stats
    // @ts-ignor
  //   p.stats.stats = p.stats.stats.map(st => {
  //     // @ts-ignore
  //     return Object.keys(st).reduce((o, id) => ({...o, [statsLookup[id as unknown as StatID]]: st[id]}), {})
  //   })
  //   console.log(`${i+1}. ${p.fullName}: ${p.team} ${p.position}`)
  })

  return players
}


export function getPlayerNews(): Promise<any>{
  return {} as any
  //https://site.api.espn.com/apis/fantasy/v2/games/ffl/news/players?days=30&playerId=14881
}