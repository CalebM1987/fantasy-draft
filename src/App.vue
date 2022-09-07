<template>
  <q-layout view="hHh lpR fFf">

    <q-header elevated class="bg-primary text-white" height-hint="98">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>
          <q-avatar icon="sports_football" />
          Draft Party - {{ appState.league?.name ?? 'Fantasy Football' }}
        </q-toolbar-title>

        <draft-clock class="q-mx-auto" />

        <q-btn dense flat round icon="menu" @click="toggleRightDrawer" />
      </q-toolbar>

      <q-tabs align="center">
        <q-route-tab to="/" label="Draft Room" />
        <q-route-tab to="/teams" label="Teams" />
        <q-route-tab to="/league" label="League Settings" />
      </q-tabs>
    </q-header>

    <q-drawer show-if-above v-model="leftDrawerOpen" side="left" bordered>
      <!-- drawer content -->
      <app-settings />
    </q-drawer>

    <q-drawer show-if-above v-model="rightDrawerOpen" side="right" bordered :width="400" style='overflow: hidden !important'>
      <!-- drawer content -->
      <Suspense>
        <available-players />
        <template #fallback>
          <div class="q-pa-xl mx-auto">
            <q-spinner-facebook
              color="primary"
              size="2em"
            />
            <p>loading...</p>
          </div>
        </template>
      </Suspense>
    </q-drawer>

    <q-page-container>
      
    <router-view v-slot="{ Component }">
      <transition 
        appear
        enter-active-class="animated fade-in"
        leave-active-class="animated fade-out"
      >
        <keep-alive>
          <component :is="Component" />
        </keep-alive>
      </transition>
    </router-view>
      
    </q-page-container>

  </q-layout>
</template>

<script lang="ts" setup>
import { ref, onMounted, defineAsyncComponent, watchEffect } from 'vue'
import { useQuasar } from 'quasar'
import { useAppStore, usePlayerStore } from './store'
import { setRealtimeHandlers, clearDraftBoard, removeRealtimeHandlers } from './services/firebase';
import { EventBus } from './events/event-bus';
import { log } from './utils/logger';
const DraftClock = defineAsyncComponent(()=> import('./components/draft/DraftClock.vue'))
const AvailablePlayers = defineAsyncComponent(()=> import('./components/players/AvailablePlayers.vue'))
const AppSettings = defineAsyncComponent(()=> import('./components/settings/AppSettings.vue'))

const appState = useAppStore()
const config = appState.config

const $q = useQuasar()

$q.dark.set(true)

const leftDrawerOpen = ref(false)
const rightDrawerOpen = ref(false)

    
const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value
}


const toggleRightDrawer = () => {
  rightDrawerOpen.value = !rightDrawerOpen.value
}

onMounted(()=> {
  
  EventBus.on('has-loaded-league', (league)=> {
    if (league){
      log('league is ready: ', league)
      // clearDraftBoard()?.then(()=> log('cleared draft board'))
      setRealtimeHandlers()
    } else {
      removeRealtimeHandlers()
    }
  })
  
  setTimeout(()=> {
    toggleLeftDrawer()
    // toggleRightDrawer()
  }, 20)
})
    
</script>

<style>

#app, body{
  overflow: hidden !important; 
}

.pos-RB {
  background-color: rgb(255, 38, 0);
}

.pos-WR {
  background-color: rgb(49, 193, 9);
}

.pos-DEF {
  background-color: rgba(252, 118, 15, 0.995);
}

.pos-QB {
  background-color: rgb(70, 133, 243);
}

.pos-K {
  background-color: rgba(201, 59, 185, 0.872);
}

.pos-TE {
  background-color:gold;
}
</style>