<script lang="ts" setup>
import { ref, defineAsyncComponent } from 'vue';
import { usePlayerStore, useAppStore } from '../../store';
import { FilterType } from '../../types/players'
import { useQuasar } from 'quasar';
import PlayerInfo from './PlayerInfo.vue';
import { log } from '../../utils/logger';
const CustomPlayer = defineAsyncComponent(()=> import('./CustomPlayer.vue'))

const players = usePlayerStore()
const appState = useAppStore()

await players.fetchPlayers()

// @ts-ignore
hook.players = players

interface FilterTypeOptions { 
  name: FilterType;
  label: string ;
}

const selectedPos = ref(players.positions[0])
const tab = ref<FilterType>('top-200')

const typeOptions: FilterTypeOptions[] = [
  { name: 'top-200', label: 'Top 200' },
  { name: 'positions', label: 'By Position' },
  { name: 'favorites', label: 'Favorites' },
]

const $q = useQuasar()
const showCustomPlayerModal = ()=> {
  log('should show custom player modal')
  $q.dialog({
    component: CustomPlayer
  }).onOk((player)=> {
    log('attempting to create a new player: ', player)
    players.draftPlayer(player)
  })
}

const positionOptions = players.positions.map(p => { return { name: p, label: p.toUpperCase() }})

</script>

<template>
  <div class="available-players-container q-pa-md">
    <div class="player-search-header">
      <div class="search-bar" >
        <q-input 
          v-model="players.search" 
          label="search for players..." 
          debounce="200" 
        />
      </div>

      <div class="filter-type q-py-md">
        <q-radio 
          v-model="players.listType" 
          val="all" 
          label="All Players" 
          color="accent" 
        />
        <q-radio 
          v-model="players.listType" 
          val="available" 
          label="Available Players" 
          color="accent" 
        />
        <span>
          <q-btn
            flat
            rounded
            v-if="appState.isLM"
            class="float-right"
            icon="person_add_disabled"
            title="Draft Custom Player"
            @click="showCustomPlayerModal"
          />
        </span>
      </div>
    </div>

    <q-separator />

    <div class="player-list">
      <q-tabs 
        dense
        v-model="tab"
        align="justify"
        narrow-indicator
      >
        <q-tab v-for="{ name, label } in typeOptions" :name="name" :label="label"></q-tab>
      </q-tabs>

      <q-tab-panels v-model="tab" :keep-alive="true">

        <q-tab-panel name="top-200">
          <q-list bordered separator>
            <player-info 
              class="q-mb-sm"
              v-for="player in players.playerList"
              :key="player.player_id"
              :player="player"
              :rank-type="'adp'"
            />
          </q-list>
          
        </q-tab-panel>

        <q-tab-panel name="positions">
          <q-tabs
              dense
              v-model="selectedPos"
              align="justify"
              narrow-indicator
            >
              <q-tab  
                v-for="{ name, label } in positionOptions" 
                :name="name" 
                :label="label" 
                :key="name"
              /> 
              </q-tabs>
          
            <q-tab-panel 
              
              :name="selectedPos" 
              :label="selectedPos" 
            >
              <q-list bordered separator>
                <player-info 
                  class="q-mb-sm"
                  v-for="player in players.playersByPosition[selectedPos]"
                  :key="player.player_id"
                  :player="player"
                  :rank-type="'position_rank'"
                />
              </q-list>
            </q-tab-panel>

        </q-tab-panel>

        <q-tab-panel name="favorites">
          <q-list bordered separator v-if="players.favorites.length">
            <player-info 
              class="q-mb-sm"
              v-for="pid in players.favorites"
              :key="pid"
              :player="players.playerList.find(p => p.player_id === pid)!"
              :rank-type="'adp'"
            />
          </q-list>
          <div class="empty-favorites q-pa-xl" v-else>
            <p class="text-h6" style="color: gray;"><i>No Favorites Saved</i></p>
          </div>
        </q-tab-panel>
      </q-tab-panels>

    </div>

  </div>

</template>

<style>
.empty-favorites {
  min-height: 200px;
}
</style>