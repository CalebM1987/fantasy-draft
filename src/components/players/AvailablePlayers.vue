<script lang="ts" async setup>
import { ref, computed } from 'vue';
import { usePlayerStore } from '../../store';
import { FilterType, PlayerListType } from '../../types/players'
import PlayerInfo from './PlayerInfo.vue';
const players = usePlayerStore()

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

const positionOptions = players.positions.map(p => { return { name: p, label: p.toUpperCase() }})

</script>

<template>
  <div class="available-players-container q-pa-md">
    <div class="player-search-header">
      <q-input 
        v-model="players.search" 
        label="search for players..." 
        debounce="200" 
      />
      <div class="filter-type q-py-md">
        <q-radio v-model="players.listType" val="all" label="All Players" color="accent" />
        <q-radio v-model="players.listType" val="available" label="Available Players" color="accent" />
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

      <q-tab-panels v-model="tab">

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
          
            <q-tab-panel v-for="{ name, label } in positionOptions" :name="name" :label="label" :key="name">
              <p>positions? {{ selectedPos }}</p>
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
          <q-list bordered separator>
            <player-info 
              class="q-mb-sm"
              v-for="pid in players.favorites"
              :key="pid"
              :player="players.playerList.find(p => p.player_id === pid)!"
              :rank-type="'adp'"
            />
          </q-list>
        </q-tab-panel>
      </q-tab-panels>

    </div>
  </div>

</template>