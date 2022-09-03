import { createApp, setDevtoolsHook } from 'vue'
import { Quasar, Dialog, Notify, Screen } from 'quasar'
import { fetchJson } from './utils/fetch'
import { IAppConfig } from './types/config'
import { useAppStore } from './store'
import { createPinia } from 'pinia'
import { log } from './utils/logger'

// Import icon libraries
import '@quasar/extras/roboto-font/roboto-font.css'
import '@quasar/extras/material-icons/material-icons.css'
import '@quasar/extras/material-icons-outlined/material-icons-outlined.css'

// Import Quasar css
import 'quasar/src/css/index.sass'

fetchJson<IAppConfig>('./config.json').then(async (config)=> {
  console.log('config', config)

  // load app
  const { default: App } = await import('./App.vue')
  const { router } = await import('./router/index')
  
  const myApp = createApp(App)
  
  myApp
  .use(Quasar, {
    plugins: {
      Dialog,
      Screen,
      Notify
    }, // import Quasar plugins and add here
  })
  .use(createPinia())
  .use(router)
  
  // Assumes you have a <div id="app"></div> in your index.html
  myApp
    .mount('#app')

  // add config to app state
  const appState = useAppStore()
  appState.setConfig(config)

  // check url for league ID and if is league manager (?lm=true)
  const url = new URL(window.location.href.replace(/#\//g,''))
  log('url is: ', url)
  appState.isLM = ['1', 'true'].includes(url.searchParams.get('lm') ?? '')
  console.log("url check: ", ['1', 'true'].includes(url.searchParams.get('lm') ?? ''))
  log('set league manager status: ', appState.isLM)
  // find league
  const leagueId = url.searchParams.get('leagueId') ?? config.leagues[0].id
  if (leagueId){
    const league = config.leagues.find(l => l.id == leagueId) ?? config.leagues[0]
    if (league){
      appState.league = league
    }
  }

  // @ts-ignore
  hook.appState = appState
})
