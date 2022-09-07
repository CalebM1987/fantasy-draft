<script lang="ts" setup>
import { useAppStore, usePlayerStore } from '../../store';
import { useAutoDraft } from '../../composables/auto-draft'
import { useDialogPluginComponent } from 'quasar';
import { IPlayer } from '../../types';
import { log } from '../../utils/logger';

const { bestAvailable } = useAutoDraft()

const appState = useAppStore()
const players = usePlayerStore()

const emit = defineEmits({
  'did-auto-draft-player': (player: IPlayer) => true,
  ...useDialogPluginComponent.emitsObject
})

const { 
  dialogRef, 
  onDialogHide, 
  onDialogOK, 
  onDialogCancel 
} = useDialogPluginComponent()

const onCancel = ()=> {
  onDialogCancel()
  log('cancelled auto draft prompt')
}

</script>

<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card style="width: 600px; max-width: 70vw;">
      <q-card-section class="bg-primary text-white">
        <div class="text-h5">Auto Draft Player</div>
      </q-card-section>
  
      <q-separator />
  
      <q-card-section>
        <p v-if="appState.timer === 0">Time is up for this pick!</p>
        <p>The next best available player is <strong>{{ bestAvailable.fullName }}</strong> ({{ bestAvailable.team }} {{ bestAvailable.position }}). Do you want to auto draft this player for <strong>{{ players.onTheClock?.teamName }}</strong> ({{ players.onTheClock?.name }})?</p>
      </q-card-section>
  
      <q-card-actions>
        <q-btn flat @click="onDialogOK">Draft Player</q-btn>
        <q-btn flat @click="onCancel">No</q-btn>
      </q-card-actions>
  
    </q-card>
  </q-dialog>
</template>

