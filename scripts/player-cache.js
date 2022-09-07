import path from 'path'
import fs from 'fs'
import axios from 'axios'

const fltr = JSON.stringify({"players":{"filterStatus":{"value":true}},"limit":300,"sortPercOwned":{"sortAsc":false,"sortPriority":1},"filterSlotIds":{"value":[2,4,0,6,16,17]},"filterRanksForSlotIds":{"value":[0,2,4,6,17,16]}})
const headers = { 'x-fantasy-filter':  fltr}

axios.get('https://fantasy.espn.com/apis/v3/games/ffl/seasons/2022/players?scoringPeriodId=0&view=kona_playercard', {
  headers
}).then(({data: players}) => {
  const rem = ['stats', 'rankings', 'draftRanksByType']

  players.forEach((p) => {
    for (const key of rem){
      // @ts-ignore
      delete p[key]
    }
  })

  const output = path.resolve('./src/data/espn-players-response.json')
  console.log('output: ', output)
  fs.writeFile(output, JSON.stringify(players, null, 2), (err) => {
    if (err){
      console.warn('failed to save json file', err)
    } else {
      console.log('successfully saved players cache')
    }
  })
})

// export {}