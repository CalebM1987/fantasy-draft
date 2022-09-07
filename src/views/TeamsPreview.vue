<script lang="ts" setup>
import { useAppStore } from '../store';
import TeamRoster from '../components/teams/TeamRoster.vue';
const appState = useAppStore()

</script>

<template>
<div class="roster container">
  <div class="row row items-start q-pa-md">
    <team-roster 
      v-for="member of appState.sortedMembers"
      :key="member.name"
      :league-member="member"
    />
  </div>
</div>
</template>

<style lang="scss">
  .roster{
    width: 98%;
    overflow: auto;
    & .row{
      flex-wrap: nowrap;
    }
  }

</style>