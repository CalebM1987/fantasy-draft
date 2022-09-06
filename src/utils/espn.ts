import { copyToClipboard } from "quasar"
import { useAppStore, usePlayerStore } from "../store"
import { EspnPositionID, IEspnPlayer } from '../types/espn'

export type DraftAction = 'DRAFT' | 'UNDRAFT';

export interface IRosterItem {
  overallPickNumber: number;
  type: DraftAction;
  playerId: number;
  name?: string;
}

export interface IESPNRoster {
  isLeagueManager: boolean;
  teamId: number;
  type: DraftAction;
  scoringPeriodId: number;
  executionType: "EXECUTE";
  items: IRosterItem[];
}

export function getRosters(): IESPNRoster[] {
  const appState = useAppStore()

  if (appState.league?.platform === 'espn'){
    const playerState = usePlayerStore()

    const members = appState.sortedMembers.reduce((o, m)=> ({...o, [m.name]: []}), {}) as Record<string, IRosterItem[]>;
    console.log('members yo: ', members)
    const rosters: IESPNRoster[] = []
    playerState.draftPicks.forEach(p => {
      if (p.owner){
        members[p.owner.name].push({
          type: 'DRAFT',
          overallPickNumber: p.pickNumber!,
          playerId: p.espnPlayerId!,
          name: p.name
        })
      }
    })
    
    Object.keys(members).forEach(k => {
      rosters.push({
        isLeagueManager: false,
        teamId: appState.sortedMembers.find(m => m.name === k)!.espnTeamId,
        scoringPeriodId: 1,
        executionType: 'EXECUTE',
        items: members[k]
      } as IESPNRoster)
    })

    return rosters
  }
  throw Error('Cannot copy picks to clipboard: This is not an ESPN league')
}

const templateFunction = (rosters: IESPNRoster[])=> `async function updateRosters(type='DRAFT'){
  
  const rosters = ${JSON.stringify(rosters, null, 2)}
  const headers = new Headers()
  headers.append('Accept', 'application/json')
  headers.append('Content-Type', 'application/json')

  const url = 'https://lm-api-writes.fantasy.espn.com/apis/v3/games/ffl/seasons/2022/segments/0/leagues/890793/transactions/'
  const promises = []
  const delay = (ms=1000) => new Promise(res => setTimeout(res, ms));

  for (const roster of rosters){
    roster.type = type
    roster.items.forEach(i => {
      i.type = type
      delete i['name'] // for debugging only
    })

    const resp = await fetch(url, {
      headers,
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify(roster),
    })
    promises.push(resp)
    
    console.log('roster response: ', resp)
    await delay(1000)
  }

  return promises
}`

export function copyESPNUpdateRostersFunction() {
  const rosters = getRosters()
  return copyToClipboard(templateFunction(rosters))
}

export function getHeadshot(playerOrId: IEspnPlayer | number): string {
  const pid = typeof playerOrId === 'number' ? playerOrId: playerOrId.id
  return `https://a.espncdn.com/combiner/i?img=/i/headshots/nfl/players/full/${pid}.png&w=96&h=70&cb=1`
}