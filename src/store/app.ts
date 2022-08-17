import { defineStore } from 'pinia'
import { IAppConfig } from '../types/config'

interface IAppState {
  config?: IAppConfig;
}

export const useAppStore = defineStore('players', {
  state: ()=> ({
    config: undefined,
  } as IAppState)
})