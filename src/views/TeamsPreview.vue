<script lang="ts" setup>
import { useAppStore } from '../store';
const appState = useAppStore()
import TeamRoster from '../components/teams/TeamRoster.vue';

</script>

<template>
<div class="container">
  <div class="row items-start q-pa-md">
    <team-roster 
      v-for="member of appState.sortedMembers"
      :key="member.name"
      :league-member="member"
    />
  </div>
</div>
</template>