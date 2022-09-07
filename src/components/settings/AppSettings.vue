<script lang="ts" setup>
import { useAppStore, usePlayerStore } from '../../store';
import { copyESPNUpdateRostersFunction, getRosters } from '../../utils/espn';
import { updateLeagueClock } from '../../services/firebase';
import { updateHook } from '../../utils';
import { useQuasar } from 'quasar';
updateHook({ getRosters })

const appState = useAppStore()
const { clearDraftBoard } = usePlayerStore()

const $q = useQuasar()

const getRosterFunction = async ()=> {
  await copyESPNUpdateRostersFunction()
  $q.notify({
    type: 'positive',
    message: 'Successfully Copied Update Roster Function to Clipboard'
  })
}

const onClearDraftBoard = ()=> {
  $q.dialog({
    title: 'Warning',
    message: 'Are you sure you want to clear the draft board? This action cannot be undone.',
    persistent: true,
    cancel: true
  }).onOk(()=> {
    clearDraftBoard()
    appState.hasStartedDraft = false
    updateLeagueClock('pause', appState.timeLimit ?? 150)
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

        <q-item clickable @click="updateLeagueClock('reset')">
          <q-item-section avatar>
            <q-icon name="history" />
          </q-item-section>
          <q-item-section>Reset Draft Timer</q-item-section>
        </q-item>

        <q-item clickable @click="onClearDraftBoard" class="text-negative">
          <q-item-section avatar>
            <q-icon name="refresh" />
          </q-item-section>
          <q-item-section>Clear Draft Board</q-item-section>
        </q-item>
      </q-list>
    </div>
  </div>

</template>