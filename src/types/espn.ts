import { ILeagueMember } from "./app";

/** date as ISO string */
export type DateString = string;

export interface ImageInfo {
  name: string;
  width: number;
  alt: string;
  caption: string;
  url: string;
  height: number;
  id?: number;
  credit: string;
  type: string;
}


export interface Links {
  api: any;
  web: any;
  mobile: any;
}

export interface Ad {
  sport: string;
  bundle: string;
}

export interface Tracking {
  sportName: string;
  leagueName: string;
  coverageType: string;
  trackingName: string;
  trackingId: string;
}

export interface TimeRestrictions {
  embargoDateString: DateString;
  expirationDateString: DateString;
}

export interface DeviceRestrictions {
  type: string;
  devices: string[];
}

export interface League {
  id: number;
  description: string;
  links: Links;
}

export interface Athlete {
  id: number;
  description: string;
  links: Links;
}

export interface Category {
  id: number;
  description: string;
  type: string;
  sportId: number;
  topicId: number;
  leagueId?: number;
  league: League;
  uid: string;
  athleteId?: number;
  athlete: Athlete;
}

export interface Default {
  href: string;
  width: number;
  height: number;
}

export interface PosterImages {
  default: Default;
  full: WebLink;
  wide: WebLink;
  square: WebLink;
}

export interface Image2 {
  name: string;
  url: string;
  alt: string;
  caption: string;
  credit: string;
  width: number;
  height: number;
}


export interface Api {
  self?: WebLink;
  artwork?: WebLink;
}


export interface WebLink {
  href: string;
}

export interface HLS extends WebLink {
  HD: WebLink;
}


export interface Source extends WebLink {
  mezzanine?: WebLink;
  flash?: WebLink;
  hds?: WebLink;
  HLS?: HLS;
  HD?: WebLink;
  full?: WebLink;
}

export interface Mobile extends WebLink {
  alert: WebLink
  source: WebLink;
  streaming: WebLink;
  progressiveDownload: WebLink;
}

export interface Links4 {
  api: WebLink;
  web: WebLink;
  source: WebLink;
  mobile: WebLink;
}

export interface VideoInfo {
  source: string;
  id: number;
  headline: string;
  caption: string;
  description: string;
  premium: boolean;
  ad: Ad;
  tracking: Tracking;
  cerebroId: string;
  lastModified: DateString;
  originalPublishDateString: DateString;
  timeRestrictions: TimeRestrictions;
  deviceRestrictions: DeviceRestrictions;
  syndicatable: boolean;
  duration: number;
  categories: Category[];
  posterImages: PosterImages;
  images: Image2[];
  thumbnail: string;
  links: Links4;
  title: string;
}

export interface Related {
  images: ImageInfo[];
  premium: boolean;
  description: string;
  linkText: string;
  links: Links;
  id: number;
  title: string;
  type: string;
  headline: string;
}

export interface INewsFeed {
  contentKey: string;
  images: ImageInfo[];
  description: string;
  section: string;
  published: DateString;
  type: string;
  allowComments: boolean;
  nowId: string;
  premium: boolean;
  root: string;
  links: Links;
  id: number;
  lastModified: DateString;
  headline: string;
  video: VideoInfo[];
  playerId: number;
  story: string;
  originallyPosted?: DateString;
  feedDisplayType: string;
  linkText: string;
  allowAMP?: boolean;
  source: string;
  related: Related[];
  byline: string;
}

export interface IEspnPlayerNews {
  timestamp: DateString;
  resultsOffset: number;
  status: "success" | "error";
  resultsLimit: number;
  resultsCount: number;
  feed: INewsFeed[];
}

export type InjuryStatus = "ACTIVE" | "QUESTIONABLE" | "OUT" | "DAY_TO_DAY" | "DOUBTFUL" | "INJURY_RESERVE" | "SUSPENSION" | "PROBABLE" | "PATERNITY" | "BEREAVEMENT" | "FIFTEEN_DAY_DL" | "SEVEN_DAY_DL" | "SIXTY_DAY_DL" | "TEN_DAY_DL";

export type StatName = 
  | "passingYards"
  | "passingTouchdowns"
  | "passing2PtConversions"
  | "passingInterceptions"
  | "rushingYards"
  | "rushingTouchdowns"
  | "rushing2PtConversions"
  | "receivingYards"
  | "receivingTouchdowns"
  | "receiving2PtConversions"
  | "receivingReceptions"
  | "lostFumbles"
  | "madeFieldGoalsFrom50Plus"
  | "madeFieldGoalsFrom40To49"
  | "madeFieldGoalsFromUnder40"
  | "missedFieldGoals"
  | "madeExtraPoints"
  | "missedExtraPoints"
  | "defensive0PointsAllowed"
  | "defensive1To6PointsAllowed"
  | "defensive7To13PointsAllowed"
  | "defensive14To17PointsAllowed"
  | "defensiveBlockedKickForTouchdowns"
  | "defensiveInterceptions"
  | "defensiveFumbles"
  | "defensiveBlockedKicks"
  | "defensiveSafeties"
  | "defensiveSacks"
  | "kickoffReturnTouchdown"
  | "puntReturnTouchdown"
  | "fumbleReturnTouchdown"
  | "interceptionReturnTouchdown"
  | "defensive28To34PointsAllowed"
  | "defensive35To45PointsAllowed"
  | "defensive100To199YardsAllowed"
  | "defensive200To299YardsAllowed"
  | "defensive350To399YardsAllowed"
  | "defensive400To449YardsAllowed"
  | "defensive450To499YardsAllowed"
  | "defensive500To549YardsAllowed"
  | "defensiveOver550YardsAllowed"

export type StatID = 
  | "3"
  | "4"
  | "19"
  | "20"
  | "24"
  | "25"
  | "26"
  | "42"
  | "43"
  | "44"
  | "53"
  | "72"
  | "74"
  | "77"
  | "80"
  | "85"
  | "86"
  | "88"
  | "89"
  | "90"
  | "91"
  | "92"
  | "93"
  | "95"
  | "96"
  | "97"
  | "98"
  | "99"
  | "101"
  | "102"
  | "103"
  | "104"
  | "123"
  | "124"
  | "129"
  | "130"
  | "132"
  | "133"
  | "134"
  | "135"
  | "136"

export type EspnPosition = 
  | "QB"
  | "TQB"
  | "RB"
  | "RB/WR"
  | "WR"
  | "WR/TE"
  | "TE"
  | "OP"
  | "DT"
  | "DE"
  | "LB"
  | "DL"
  | "CB"
  | "S"
  | "DB"
  | "DP"
  | "D/ST"
  | "K"
  | "P"
  | "HC"
  | "Bench"
  | "IR"
  | "Unknown?"
  | "RB/WR/TE"
  | "ER"
  | "Rookie"

  export type PlayerPosition = 
  | "QB"
  | "RB"
  | "WR"
  | "TE"
  | "K"
  | "D/ST"

export type RosterSpot = PlayerPosition | "FLEX" | "BENCH";

export type FlexPositions =
  | "RB"
  | "WR"
  | "TE"

export type EspnPositionID = 
  | 0
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 13
  | 14
  | 15
  | 16
  | 17
  | 18
  | 19
  | 20
  | 21
  | 22
  | 23
  | 24
  | 25

export interface IEspnPlayerCard {
  active: boolean
  defaultPositionId: number
  draftRanksByRankType?: DraftRanksByRankType
  droppable?: boolean
  eligibleSlots: number[]
  firstName: string
  fullName: string
  id: number
  injured?: boolean
  injuryStatus: InjuryStatus
  invalid: boolean
  lastName: string
  lastNewsDate?: number
  lastVideoDate?: number
  laterality?: string
  ownership: Ownership
  proTeamId: NFLTeamID
  stats?: Stat[]
  universeId?: number;
  stance?: string;
  jersey?: string;
}

export interface IPlayer extends IEspnPlayerCard {
  position: PlayerPosition;
  team: NFLTeams | FreeAgent;
  adp: number;
  rank?: number;
  pickNumber?: number;
  owner?: ILeagueMember;
  position_rank?: number;
  bye?: number;
  isCustom?: boolean;
}

export interface DraftRanksByRankType {
  STANDARD: DraftRankType
  PPR: DraftRankType
}

export interface DraftRankType {
  auctionValue: number
  rank: number
  rankSourceId: number
  rankType: "STANDARD" | "PPR"
  slotId: number
}

export interface Ownership {
  auctionValueAverage: number
  auctionValueAverageChange: number
  averageDraftPosition: number
  averageDraftPositionPercentChange: number
  percentChange: number
  percentOwned: number
  percentStarted: number
}

export interface Stat {
  externalId: string
  id: string
  proTeamId: number
  scoringPeriodId: number
  seasonId: number
  statSourceId: number
  statSplitTypeId: number
  stats?: Stats[]
  variance?: Variance
}

export type Stats = Record<StatID, StatName>; 

export interface Variance {
  "23"?: number
  "24"?: number
  "25"?: number
  "26"?: number
  "35"?: number
  "36"?: number
  "42"?: number
  "43"?: number
  "44"?: number
  "45"?: number
  "46"?: number
  "58"?: number
  "63"?: number
  "68"?: number
  "72"?: number
  "53"?: number
  "101"?: number
  "114"?: number
  "102"?: number
  "115"?: number
}

export type NFLTeams =
  | "ATL"
  | "BUF"
  | "CHI"
  | "CIN"
  | "CLE"
  | "DAL"
  | "DEN"
  | "DET"
  | "GB"
  | "TEN"
  | "IND"
  | "KC"
  | "LV"
  | "LAR"
  | "MIA"
  | "MIN"
  | "NE"
  | "NO"
  | "NYG"
  | "NYJ"
  | "PHI"
  | "ARI"
  | "PIT"
  | "LAC"
  | "SF"
  | "SEA"
  | "TB"
  | "WSH"
  | "CAR"
  | "JAX"
  | "BAL"
  | "HOU"

export type NFLTeamID = 
  | "0"
  | "1"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "10"
  | "11"
  | "12"
  | "13"
  | "14"
  | "15"
  | "16"
  | "17"
  | "18"
  | "19"
  | "20"
  | "21"
  | "22"
  | "23"
  | "24"
  | "25"
  | "26"
  | "27"
  | "28"
  | "29"
  | "30"
  | "33"
  | "34"
  | "-1"
 

export type FreeAgent = "FA"

export type ByeWeek = "Bye"

export interface INFLTeamsResponse {
  display: boolean;
  settings: {
    proTeams: INFLTeamInfo[];
    [k: string]: any;
  }
}

export interface INFLTeamInfo {
  abbrev: NFLTeams;
  id: NFLTeamID;
  location: string;
  name: string;
  byeWeek: number;
  universeId: number;
  proGamesByScoringPeriod: any;
}