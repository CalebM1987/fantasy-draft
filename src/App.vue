<template>
  <q-layout view="hHh lpR fFf">

    <q-header elevated class="bg-primary text-white" height-hint="98">
      <q-toolbar>
        <q-toolbar-title>
          <q-avatar icon="sports_football" />
          Draft Party - {{ appState.league?.name ?? 'Fantasy Football' }}
        </q-toolbar-title>

        <draft-clock class="q-mx-auto" />


      </q-toolbar>

      <div style="display: flex;">
        <q-btn class="drawer left" dense flat round icon="menu" @click="toggleLeftDrawer" />
      <q-tabs align="center" style="width: 100%; margin:0 auto;">
        <q-route-tab to="/" label="Draft Room" />
        <q-route-tab to="/teams" label="Teams" />
        <q-route-tab to="/league" label="League Settings" />
      </q-tabs>
      
        <q-btn class="drawer right" dense flat round icon="menu" @click="toggleRightDrawer" />
      </div>
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

const playerState = usePlayerStore()
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
      if (playerState.players.length){
        setRealtimeHandlers()
      }
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

<style lang="scss">
@import './base.scss';

@mixin RB{
  background-color: rgb(255, 38, 0);
}

#app, body{
  overflow: hidden !important; 
}

.pos{
  color: black;
  background: $white;
  &.ros{
    margin: 0 0 0 2px;
      padding: 0px 3px;
      color: white;
      border-radius: 2px;
  }
      &.RB{
        background-color: $RB;
      }
      &.WR{
        background-color: $WR;
      }
      &.TE{
        // background-color: #DAA425;
        background-color: $TE;
      }
      &.QB{
        background-color: $QB;
      }
      &.DEF{
        background-color: $DEF;
      }
      &.K{
        background-color: $K;
      }
    }



.drawer{
  margin: 0 5px 10px 0;
  background: #0A3923;
  border-radius: 5px;
  height: 0;
  width: 0;
  &.right {
    margin-left: auto;
  }
  &.left{
    margin-left: 10px;
  }
}

.bg-primary{
  // background-color: #0A3923 !important;
  background-color: #006938 !important;
}
</style>