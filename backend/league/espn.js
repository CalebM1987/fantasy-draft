
import axios from 'axios'
import fs from 'fs'
import path from 'path'
// const espnApi = require('espn-fantasy-football-api/node')
// import { Client }  from '../../node÷_modules/espn-fantasy-football-api';
// import { Client } from 'espn-fantasy-football-api/node'
// import pkg  from 'espn-fantasy-football-api';

// // const { Client } = espnApi
// log('client: ', Client)

const fantasyBase = 'https://fantasy.espn.com/apis/v3/games/ffl/seasons'
const writeBase = 'https://lm-api-writes.fantasy.espn.com/apis/v3/games/ffl/seasons'

const nflTeamIdToNFLTeam = {
  [-1]: 'Bye',
  0: 'FA',
  1 : 'Atlanta Falcons',
  2 : 'Buffalo Bills',
  3 : 'Chicago Bears',
  4 : 'Cincinnati Bengals',
  5 : 'Cleveland Browns',
  6 : 'Dallas Cowboys',
  7 : 'Denver Broncos',
  8 : 'Detroit Lions',
  9 : 'Green Bay Packers',
  10: 'Tennessee Titans',
  11: 'Indianapolis Colts',
  12: 'Kansas City Chiefs',
  13: 'Las Vegas Raiders',
  14: 'Los Angeles Rams',
  15: 'Miami Dolphins',
  16: 'Minnesota Vikings',
  17: 'New England Patriots',
  18: 'New Orleans Saints',
  19: 'New York Giants',
  20: 'New York Jets',
  21: 'Philadelphia Eagles',
  22: 'Arizona Cardinals',
  23: 'Pittsburgh Steelers',
  24: 'Los Angeles Chargers',
  25: 'San Francisco 49ers',
  26: 'Seattle Seahawks',
  27: 'Tampa Bay Buccaneers',
  28: 'Washington Redskins',
  29: 'Carolina Panthers',
  30: 'Jacksonville Jaguars',
  33: 'Baltimore Ravens',
  34: 'Houston Texans'
};

/**
 * Maps `proTeam` numerical enum to readable team name abbreviations.
 * @type {object}
 */
const nflTeamIdToNFLTeams = {
  [-1]: 'Bye',
  0: 'FA',
  1 : 'ATL',
  2 : 'BUF',
  3 : 'CHI',
  4 : 'CIN',
  5 : 'CLE',
  6 : 'DAL',
  7 : 'DEN',
  8 : 'DET',
  9 : 'GB',
  10: 'TEN',
  11: 'IND',
  12: 'KC',
  13: 'LV',
  14: 'LAR',
  15: 'MIA',
  16: 'MIN',
  17: 'NE',
  18: 'NO',
  19: 'NYG',
  20: 'NYJ',
  21: 'PHI',
  22: 'ARI',
  23: 'PIT',
  24: 'LAC',
  25: 'SF',
  26: 'SEA',
  27: 'TB',
  28: 'WSH',
  29: 'CAR',
  30: 'JAX',
  33: 'BAL',
  34: 'HOU'
};

function sortByPropertyInPlace(arr, prop, order = 'asc') {
  let first = 1
  let second = -1
  if (order == 'desc'){
    first = first * -1
    second = second * -1
  }
  arr.sort((a, b) => (a[prop] > b[prop] ? first : second));
}

class Client {
  leagueId = undefined
  espnS2 = undefined
  SWID = undefined
  headers = {
    withCredentials: true
  }

  constructor({ leagueId, espnS2, SWID }){
    this.leagueId = leagueId
    this.espnS2 = espnS2
    this.SWID = SWID

    this.headers['Cookie'] = { 
      Cookie: `espn_s2=${this.espnS2}; 
      SWID=${this.SWID};`, 
      'ESPN-ONSITE.WEB-PROD-ac': 'XUS',
      'ESPN-ONSITE.WEB-PROD.idn': '00197b0481',
      'ESPN-ONSITE.WEB-PROD.api': 'ArnetUPnjJymPpNkYW2OXUy3FDYp3KWkkgxARdj/+K1v8Mn4iDcd0QksWCJq0Hfi2UaY+uJj0z13/IInBUfiICmT502W',
      'ESPN-ONSITE.WEB-PROD.token': '5=eyJhY2Nlc3NfdG9rZW4iOiIyNjI4ZTViZWQ5NjI0YmY3OGJhZjY1OTY5YTU5OGQwZSIsInJlZnJlc2hfdG9rZW4iOiJmZDlkYjQ0OGJlMTc0NjkzYTRlY2MzNTk3ZWE4MjU2NCIsInN3aWQiOiJ7NzVEQzE1ODgtMzcwNi00NzU5LTlDMTUtODgzNzA2Nzc1OURDfSIsInR0bCI6ODY0MDAsInJlZnJlc2hfdHRsIjoxNTU1MjAwMCwiaGlnaF90cnVzdF9leHBpcmVzX2luIjoxNzk5LCJpbml0aWFsX2dyYW50X2luX2NoYWluX3RpbWUiOjE2NjI0MDE1NDQ0MTUsImlhdCI6MTY2MjQwMTU0NDAwMCwiZXhwIjoxNjYyNDg3OTQ0MDAwLCJyZWZyZXNoX2V4cCI6MTY3Nzk1MzU0NDAwMCwiaGlnaF90cnVzdF9leHAiOjE2NjI0MDMzNDMwMDAsInNzbyI6bnVsbCwiYXV0aGVudGljYXRvciI6ImRpc25leWlkIiwibG9naW5WYWx1ZSI6bnVsbCwiY2xpY2tiYWNrVHlwZSI6bnVsbCwic2Vzc2lvblRyYW5zZmVyS2V5IjoiZ2ZBbTRra2lEUG05VkxGaGt2ZE1aR2lTZko4T0xOTWxtcGpFS1BPSzlwNEdTWVVXeFM0OWUyS1gzd2VqVVc3UTRUR0tRaVg4VzZ0cy9xUy92MjJUS09icnVHaDFZT1RqZ09wUUVIdlVKa0E4dFdJUnBrZz0iLCJjcmVhdGVkIjoiMjAyMi0wOS0wNVQxODoxMjoyNC41OThaIiwibGFzdENoZWNrZWQiOiIyMDIyLTA5LTA1VDE4OjEyOjI0LjU5OFoiLCJleHBpcmVzIjoiMjAyMi0wOS0wNlQxODoxMjoyNC41OThaIiwicmVmcmVzaF9leHBpcmVzIjoiMjAyMy0wMy0wNFQxOToxMjoyNC41OThaIiwiYmx1ZV9jb29raWUiOm51bGx9|eyJraWQiOiJxUEhmditOL0tONE1zYnVwSE1PWWxBc0pLcWVaS1U2Mi9DZjNpSm1uOEJ6dzlwSW5xbTVzUnc9PSIsImFsZyI6IlJTMjU2In0.eyJpc3MiOiJodHRwczovL2F1dGhvcml6YXRpb24uZ28uY29tIiwic3ViIjoiezc1REMxNTg4LTM3MDYtNDc1OS05QzE1LTg4MzcwNjc3NTlEQ30iLCJhdWQiOiJFU1BOLU9ORVNJVEUuV0VCLVBST0QiLCJleHAiOjE2NjI0ODc5NDQsImlhdCI6MTY2MjQwMTU0NCwianRpIjoid2U0WDNmR182MW9qT0RaYjZDRW1RUSIsIm5iZiI6MTY2MjQwMTQ4NCwiYV90eXAiOiJPTkVJRF9UUlVTVEVEIiwiYV9jYXQiOiJHVUVTVCIsImF0ciI6ImRpc25leWlkIiwic2NvcGVzIjpbImR0c3MtZW50aXRsZW1lbnQtdXNlci1hZG1pbiIsIkFVVEhaX0dVRVNUX1NFQ1VSRURfU0VTU0lPTiJdLCJjX3RpZCI6IjEzMjQiLCJpZ2ljIjoxNjYyNDAxNTQ0NDE1LCJodGF2IjoyLCJodGQiOjE4MDAsInJ0dGwiOjE1NTUyMDAwLCJlbWFpbCI6ImNhbGViLm1hY2tleUBnbWFpbC5jb20ifQ.EI3ChB1UibQwPEe7-rYH5rTEe9oTBeU3wxP9MjoWqqWCfc1-1Kob0FEtY1a-b5WxdYnV0rwJAU1EfY26YT9CBHoUYd3jHz6tDWTQxNkc5UYK8d81cUER7tmaM3BWaSABLZrLAasvJyQ4L13D7Q2LifEG-5ez3AbnfxnNrlceeqaOf6Gthd_x3_Frv-1m9UkcKBj41Q7SzoqyD1grOy74jrYtOQWeeMZtUoWHiTqQyMocdXlLFc-hlaoXDLdVz66SudmCB7L2dUO-1_-W6b42b3uz1zCCjeCSiW_1unB0P0Zv_re39WyuemWnl0iGiFepTn-Mig0XzFPV3RGk3GTt5A'
    };
    
  }

  getFreeAgents({ seasonId=new Date().getFullYear(), scoringPeriodId=0}){
    const headers = {
      // ...this.headers,
      'x-fantasy-filter': JSON.stringify({
        players: {
          // filterStatus: {
          //   value: ['FREEAGENT', 'WAIVERS']
          // },
          limit: 1000,
          sortPercOwned: {
            sortAsc: false,
            sortPriority: 3
          }
        }
      })
    }

    // const url = `${fantasyBase}/${seasonId}/segments/0/leagues/${this.leagueId}/players`
    // const url = 'https://fantasy.espn.com/apis/v3/games/ffl/seasons/2022/players?scoringPeriodId=0&view=players_wl'
    const url = 'https://fantasy.espn.com/apis/v3/games/ffl/seasons/2022/players?scoringPeriodId=0&view=kona_playercard'
    console.log('url is: ', url)
    return axios.get(url, {
      // params: {
      //   scoringPeriodId,
      //   view: 'kona_player_info'
      // },
      headers
    })
  }
}

const client = new Client({ 
  leagueId: 890793,
  espnS2: 'AECakYkaX4OLlyqmtD%2BzoKCGqY1eMygJdJnrVki4AVzfDVMP2HXIIIdXd47ZVW61xKk2j6%2FcEZhDn4en195FkppuOJC73QK9iJlFBdw8QK%2FPdEnETGUjQjiMZUofteNh0IQrhUlGwp1oqHgM2%2FTqga8CQhfu8qQihSECZCQ%2Bnf16CLUt44xieeZNk9oL1ikxvOmhaUN6Hz3wJnk%2FCBa0ygvm2O0vZDmMBGjulOFGoYBAijXjB6IJe5IRHUQLkN9DVgogrBeOR9kKlVS4kuKpY%2FaR6W52fI3eMmwrxHL9ZNpijJkx7RuDU%2BWsqT7PFIt8bbE%3D',
  SWID: '{75DC1588-3706-4759-9C15-8837067759DC}' 
})
console.log('client is: ', Client)

const positionIDs = {
  1: 'QB',
  2: 'RB',  
  3: 'WR',
  4: 'TE',
  5: 'K',
  16: 'D/ST'
}

// https://fantasy.espn.com/apis/v3/games/ffl/seasons/2022/players?scoringPeriodId=0&view=players_wl

async function loadPlayers(client) {
  const skip = ['ownership', 'id', 'universeId', 'dropable', 'eligibleSlots', 'defaultPositionId' ]


  const freeAgents = await client.getFreeAgents({ seasonId: new Date().getFullYear(), scoringPeriodId: 0 })

  const playersData = freeAgents.data
  const playersJson = playersData
    .filter(p => p.defaultPositionId in positionIDs && p.ownership)
    .map(p => {
      const position = positionIDs[p.defaultPositionId]
      const id = p.id
      const percentOwned = p.ownership ? p.ownership.ownership.percentOwned : 0
      return {
        position,
        percentOwned,
        id,
        team: nflTeamIdToNFLTeams[p.proTeamId],
        ...Object.keys(p)
          .filter(k => !skip.includes(k))
          .reduce((acc, k)=> ({...acc, [k]: p[k] }), {})
      }
  })

  sortByPropertyInPlace(playersJson, 'percentOwned', 'desc')

  playersJson.forEach((p, i) => {
    p.espnOwnershipRank = i+1
  })


  // console.log(freeAgents.data)
  const file = path.resolve('./backend/league/data/espn-players2.json')
  fs.writeFile(file, JSON.stringify(playersJson, null, 2), err=> {
    if (err){
      console.warn('failed to save free agents')
    } else {
      console.log('saved espn players')
    }
  })
  return playersJson
}

loadPlayers(client)

function updateRosters(type='DRAFT'){
  if (!window.espnDraftPicks){
    throw Error('no draft picks found')
  }

  window.espnDraftPicks.type = type
  window.espnDraftPicks.items.forEach(i => i.type = type)


  // const payload = {
  //   "isLeagueManager": false,
  //   "teamId": 1,
  //   "type": "DRAFT",
  //   "scoringPeriodId": 1,
  //   "executionType": "EXECUTE",
  //   "items": [
  //     {
  //       "overallPickNumber": 2,
  //       "type": "DRAFT",
  //       "playerId": 4242335
  //     },
  //     {
  //       "overallPickNumber": 23,
  //       "type": "DRAFT",
  //       "playerId": 3126486
  //     }
  //   ]
  // }

  const headers = new Headers()
  headers.append('Accept', 'application/json')
  headers.append('Content-Type', 'application/json')

  const url = 'https://lm-api-writes.fantasy.espn.com/apis/v3/games/ffl/seasons/2022/segments/0/leagues/890793/transactions/'
  const resp = fetch(url, {
    headers,
    method: 'POST',
    credentials: 'include',
    body: JSON.stringify(window.espnDraftPicks),
  })

  resp.then((r)=> {
    console.log('response is: ', r)
  })

}