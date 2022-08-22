<script lang="ts" async setup>
import { ref } from 'vue';
import { usePlayerStore } from '../../store';
import PlayerInfo from './PlayerInfo.vue';
const players = usePlayerStore()

await players.fetchPlayers()

// @ts-ignore
hook.players = players

type FilterType = "top-200" | "positions";
interface FilterTypeOptions { 
  name: FilterType;
  label: string ;
}
const filterType = ref<"all" | "available">('available')
const search = ref('')
const selectedPos = ref(players.positions[0])
const tab = ref<FilterType>('top-200')
const typeOptions: FilterTypeOptions[] = [
  { name: 'top-200', label: 'Top 200' },
  { name: 'positions', label: 'By Position' },
]
const positionOptions = players.positions.map(p => { return { name: p, label: p.toUpperCase() }})
</script>

<template>
  <div class="available-players-container q-pa-md">
    <div class="players-header">
      <q-input v-model="search" label="Search for players..." />
      <div class="filter-type q-py-md">
        <q-radio v-model="filterType" val="all" label="All Players" />
        <q-radio v-model="filterType" val="available" label="Available Players" />
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
              v-for="player in players.availablePlayers"
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
      </q-tab-panels>

    </div>
  </div>

</template>