<script lang="ts" setup>
import { useAppStore } from '../../store';
const appState = useAppStore()

</script>

<template>
  <div class="app-settings q-pa-md">
    <div class="text-h5">App Settings</div>
    <q-separator class="q-my-md" />

    <div class="settings">
      <q-toggle
        v-model="appState.compactView"
        label="Compact View"
      />
    </div>
  </div>

</template>