<script lang="ts" setup>
import { defineAsyncComponent } from 'vue'
import { useAppStore } from '../store';
const RosterSummary = defineAsyncComponent(()=> import('../components/settings/league/LeagueSummary.vue'))
const appState = useAppStore()

</script>

<template>
  <div class="league-settings">
    <roster-summary v-if="appState.league" />
  </div>
  
</template>