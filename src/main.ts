import { createApp, setDevtoolsHook } from 'vue'
import { Quasar } from 'quasar'
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
    plugins: {}, // import Quasar plugins and add here
  })
  .use(createPinia())
  .use(router)
  
  // Assumes you have a <div id="app"></div> in your index.html
  myApp
    .mount('#app')

  // add config to app state
  const appState = useAppStore()
  appState.config = config

  // @ts-ignore
  hook.appState = appState
})
