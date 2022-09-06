import { IEspnPlayerCard } from "../types/espn"
import response from "./espn-players-response.json"
// 20220906
// https://fantasy.espn.com/apis/v3/games/ffl/seasons/2022/players?scoringPeriodId=0&view=kona_playercard

export const playersResponse = response as IEspnPlayerCard[]