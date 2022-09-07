import fs, { readFile } from 'fs'
import path from 'path'
import espnPlayers from './data/espn-players.json' assert { type: 'json' }
import playersJson from '../../src/data/playersResponse.json' assert { type: 'json' }
const players = playersJson.players
// const espnPlayers = JSON.parse(await readFile(new URL('./data/espn-players.json'), import.meta.url))
// const players = JSON.parse(await readFile(new URL('../../src/data/playersResponse.json'), import.meta.url))

const fantasyCalcData = path.resolve('./src/data/playersResponse.json')
const fantasyCalcData2 = path.resolve('./src/data/playersResponse2.json')
// const espnPlayers = path.resolve('./backend/league/data/espn-players.json')


players.forEach(p => {
  let espnPlayer = undefined
  if (p.team === 'WAS'){
    // replace this with WSH
    p.team = 'WSH'
  }
  if (p.position === 'D/ST'){
    espnPlayer = espnPlayers.find(_p => _p.position === 'D/ST' && _p.team === p.team)
  } else {
    // try to match by name
    espnPlayer = espnPlayers.find(_p => _p.fullName === p.fullName && _p.team === p.team && _p.position === p.position)
  }
  if (espnPlayer){
    p.id = espnPlayer.id
    p.ownership.percentOwned = espnPlayer.ownership.percentOwned
    p.espnOwnershipRank = espnPlayer.espnOwnershipRank
  }
})
playersJson.players = players

fs.writeFile(fantasyCalcData, JSON.stringify(playersJson, null, 2), err=> {
  if (err){
    console.warn('failed to update fantasy calculator players data with espn players', err)
  } else {
    console.log('successfully combined fantasy calculator players data with espn players')
  }
})

