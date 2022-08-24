import { createApp, setDevtoolsHook } from 'vue'
import { Quasar, Dialog, Notify } from 'quasar'
import { fetchJson } from './utils/fetch'
import { IAppConfig } from './types/config'
import { useAppStore } from './store'
import { createPinia } from 'pinia'

// Import icon libraries
import '@quasar/extras/roboto-font/roboto-font.css'
import '@quasar/extras/material-icons/material-icons.css'
import '@quasar/extras/material-icons-outlined/material-icons-outlined.css'

// Import Quasar css
import 'quasar/src/css/index.sass'

fetchJson<IAppConfig>('./config.json').then(async (config)=> {
  console.log('config', config)

  // Assumes your root component is App.vue
  // and placed in same folder as main.js
  const { default: App } = await import('./App.vue')
  const { router } = await import('./router/index')
  
  const myApp = createApp(App)
  
  myApp
  .use(Quasar, {
    plugins: {
      Dialog
    }, // import Quasar plugins and add here
  })
  .use(createPinia())
  .use(router)
  
  // Assumes you have a <div id="app"></div> in your index.html
  myApp
    .mount('#app')

  // add config to app state
  const appState = useAppStore()
  appState.config = config

  // find league
  const url = new URL(window.location.href)
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
