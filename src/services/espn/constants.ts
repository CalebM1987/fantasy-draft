import { 
  StatID,
  StatName,
  NFLTeamID,
  NFLTeamAbbreviation,
  FreeAgent,
  ByeWeek
} from '../../types/espn'

export const statsMap: Record<StatName, StatID> = {
  passingYards: '3',
  passingTouchdowns: '4',
  passing2PtConversions: '19',
  passingInterceptions: '20',

  rushingYards: '24',
  rushingTouchdowns: '25',
  rushing2PtConversions: '26',

  receivingYards: '42',
  receivingTouchdowns: '43',
  receiving2PtConversions: '44',
  receivingReceptions: '53',

  lostFumbles: '72',

  madeFieldGoalsFrom50Plus: '74',
  madeFieldGoalsFrom40To49: '77',
  madeFieldGoalsFromUnder40: '80',
  missedFieldGoals: '85',
  madeExtraPoints: '86',
  missedExtraPoints: '88',

  defensive0PointsAllowed: '89',
  defensive1To6PointsAllowed: '90',
  defensive7To13PointsAllowed: '91',
  defensive14To17PointsAllowed: '92',

  defensiveBlockedKickForTouchdowns: '93',
  defensiveInterceptions: '95',
  defensiveFumbles: '96',
  defensiveBlockedKicks: '97',
  defensiveSafeties: '98',
  defensiveSacks: '99',

  kickoffReturnTouchdown: '101',
  puntReturnTouchdown: '102',
  fumbleReturnTouchdown: '103',
  interceptionReturnTouchdown: '104',

  defensive28To34PointsAllowed: '123',
  defensive35To45PointsAllowed: '124',

  defensive100To199YardsAllowed: '129',
  defensive200To299YardsAllowed: '130',
  defensive350To399YardsAllowed: '132',
  defensive400To449YardsAllowed: '133',
  defensive450To499YardsAllowed: '134',
  defensive500To549YardsAllowed: '135',
  defensiveOver550YardsAllowed: '136'
}

export const statsLookup = Object.entries(statsMap)
  .reduce((o,[k, v]) => ({...o, [v]: k}), {}) as Record<StatID, StatName>

export const slotCategoryIdToPositionMap = {
  0: 'QB',
  1: 'TQB',
  2: 'RB',
  3: 'RB/WR', // this is usually a WR
  4: 'WR',
  5: 'WR/TE',  // this is usually a TE
  6: 'TE',
  7: 'OP',
  8: 'DT',
  9: 'DE',
  10: 'LB',
  11: 'DL',
  12: 'CB',
  13: 'S',
  14: 'DB',
  15: 'DP',
  16: 'D/ST',
  17: 'K',
  18: 'P',
  19: 'HC',
  20: 'Bench',
  21: 'IR',
  22: 'Unknown?', // TODO: Figure out what this is
  23: 'RB/WR/TE',
  24: 'ER', // TODO: Figure out what this is
  25: 'Rookie'
};

export const positionToSlotIDMap = Object.entries(slotCategoryIdToPositionMap)
.reduce((o,[k, v]) => ({...o, [v]: k}), {}) 

export const nflTeamIdToNFLTeam = {
  [-1]: 'Bye',
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
  28: 'Washington Commanders',
  29: 'Carolina Panthers',
  30: 'Jacksonville Jaguars',
  33: 'Baltimore Ravens',
  34: 'Houston Texans'
}

export const nflTeamIdToNFLTeamAbbreviation: Record<NFLTeamID, NFLTeamAbbreviation | FreeAgent | ByeWeek> = {
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
}

export const nflTeamAbbreviationToId = Object.entries(nflTeamIdToNFLTeamAbbreviation)
  .reduce((o,[k, v]) => ({...o, [v]: k}), {}) as Record<NFLTeamAbbreviation | FreeAgent | ByeWeek, NFLTeamID>

export const defaultFilters = {
  "players": {
    "filterStatus": {
      "value": true
    }
  },
  "limit": 250,
  "sortPercOwned": {
    "sortAsc": false,
    "sortPriority": 1
  },
  "filterSlotIds": {
    "value": [
      2,
      4,
      0,
      6,
      16,
      17
    ]
  },
  "filterRanksForSlotIds":{"value":[0,2,4,6,17,16]}
}