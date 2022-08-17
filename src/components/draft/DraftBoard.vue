<script lang="ts" setup>
import { computed } from 'vue'
import { useAppStore } from '../../store'
import DraftSquare from './DraftSquare.vue';

const appState = useAppStore()
const teams = computed(()=> appState.config.league.members)
const colSize = computed(()=> Math.min(Math.max(Math.ceil(12 / teams.value.length), 1), 12))
const rounds = computed(()=> appState.config.league.roster.size)
const draftType = appState.config.league.draftType
console.log('teams: ', teams)

</script>

<template>
  <div class="col-md-9 q-pa-sm" style="overflow: auto;">
   
    <div class="row franchise-header">
      <div v-for="team in appState.config.league.members" :key="team.name" :class="`grid-cell xcol-md-${colSize}`">
        <div class="team-header grid-cell">
          <div class="q-pa-sm">
            <div class="player-name">{{ team.name }}</div>
            <div class="team-name">{{ team.teamName }}</div>
          </div>
        </div>
      </div>
    </div>

    <div v-for="(round, ri) in rounds" :key="round" class="row picks-container">

      <div v-for="(team, ti) in teams" :key="team.name" :class="`grid-cell xcol-md-${colSize}`">
        <draft-square 
          :pickNumber="(ri*teams.length) + Math.abs(draftType === 'snake' && (ri > 0  && (ri % 2)) ? teams.length-ti: ti+1)">
        </draft-square>
      </div>
    </div>

  </div>
</template>

<style>

  .picks-container {
    overflow: auto;
  }

  .franchise-header {
    position: sticky;
    top: 0;
  }

  .board-container {
    overflow: auto;
  }

  .team-header {
    border: solid 1px;
    height: 100%;
  }

  .player-name {
    font-size: 1rem;
    font-weight: bold;
  }

  .team-name {
    font-size: 0.85rem;
  }

  .grid-cell {
    padding: 1px !important;
    height: 100%;
    width: 200px;
    /* width: 170px;
    height: 100px; */
    /* padding-right: 1px !important; */
  }

</style>