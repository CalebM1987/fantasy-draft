import { ILeagueInfo } from "../types";
import { reactive } from "vue";
import { isObject } from "./utils";

export function createLeagueTemplate(id: string | number, props?: Partial<ILeagueInfo>): ILeagueInfo {
  const league = {
    id,
    name: '',
    numberOfTeams: 8,
    format: 'standard',
    draft: {
      type: 'snake',
      timeLimit: 180
    },
    members: [],
    roster: {
      size: 16,
      format: 'standard',
      positions: []
    }
  } as Partial<ILeagueInfo>

  if (isObject(props)){
    Object.assign(league, props)
  }

  return reactive(league) as any
}