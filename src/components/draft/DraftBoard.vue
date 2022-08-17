<script lang="ts" setup>
import { computed } from 'vue'
import { useAppStore } from '../../store'
import DraftSquare from './DraftSquare.vue';

const appState = useAppStore()
const colSize = computed(()=> Math.min(Math.max(Math.ceil(12 / appState.sortedMembers.length), 1), 12))
const rounds = computed(()=> appState.config.league.roster.size)
const gridClass = computed(()=> `grid-cell${appState.compactView ? ' col-md-' + colSize.value: '--fixed-width'}`)
const draftType = appState.config.league.draftType
console.log('teams: ', appState.sortedMembers)

</script>

<template>
  <div class="col-md-9 q-pa-md q-mr-md" style="overflow: auto;">
   
    <div :class="`row${appState.compactView ? '': 'x'} franchise-header`">
      <div v-for="team in appState.sortedMembers" :key="team.name" :class="gridClass">
        <div :class="`team-header ${gridClass}`">
          <div class="q-pa-sm">
            <div class="player-name">{{ team.name }}</div>
            <div class="team-name">{{ team.teamName }}</div>
          </div>
        </div>
      </div>
    </div>

    <div v-for="(round, ri) in rounds" :key="round" :class="`row${appState.compactView ? '': 'x'} picks-container`">

      <div v-for="(team, ti) in appState.sortedMembers" :key="team.name" :class="gridClass">
        <draft-square 
          :pickNumber="(ri*appState.sortedMembers.length) + Math.abs(draftType === 'snake' && (ri > 0  && (ri % 2)) ? appState.sortedMembers.length-ti: ti+1)">
        </draft-square>
      </div>
    </div>

  </div>
</template>

<style lang="scss">

  .rowx {
    display: flex;
  }
  .picks-container {
    /* overflow: auto; */
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
    &--fixed-width {
      width: 200px;
    }
    /* width: 170px;
    height: 100px; */
    /* padding-right: 1px !important; */
  }

</style>