<script lang="ts" setup>
import { useAppStore, usePlayerStore } from '../../store';
import { copyESPNUpdateRostersFunction } from '../../utils/espn';
import { useQuasar } from 'quasar';
const { clearDraftBoard } = usePlayerStore()
const appState = useAppStore()

const $q = useQuasar()

const getRosterFunction = async ()=> {
  await copyESPNUpdateRostersFunction()
  $q.notify({
    type: 'positive',
    message: 'Successfully Copied Update Roster Function to Clipboard'
  })
}

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

    <div class="lm-tools q-my-xl" v-if="appState.isLM">
      <div class="text-h5">LM Tools</div>
      <q-separator />
      <q-list>
        <q-item clickable @click="getRosterFunction">
          <q-item-section avatar>
            <q-icon name="sync" />
          </q-item-section>
          <q-item-section>Copy Roster Helper Function</q-item-section>
        </q-item>

        <q-item clickable @click="clearDraftBoard">
          <q-item-section avatar>
            <q-icon name="refresh" />
          </q-item-section>
          <q-item-section>Clear Draft Board</q-item-section>
        </q-item>
      </q-list>
    </div>
  </div>

</template>