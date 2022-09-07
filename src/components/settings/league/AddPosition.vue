<script lang="ts" setup>
  import { ref } from 'vue'
  import { usePlayerStore, useAppStore } from '../../../store';
  import { PlayerPosition } from '../../../types';
  import { useDialogPluginComponent } from 'quasar';
  
  const { positions } = usePlayerStore()
  const appState = useAppStore()
  
  const emit = defineEmits({
    ...useDialogPluginComponent.emitsObject
  })

  const position = ref<PlayerPosition>('RB')
  
  const { 
    dialogRef, 
    onDialogHide, 
    onDialogOK, 
    onDialogCancel 
  } = useDialogPluginComponent()

  const onOk = ()=> onDialogOK(position.value)
  
  </script>
  
  <template>
    <q-dialog ref="dialogRef" @hide="onDialogHide">
      <q-card style="width: 600px; max-width: 70vw;">
        <q-card-section class="bg-primary text-white">
          <div class="text-h5">Add Roster Spot</div>
        </q-card-section>
    
        <q-separator />
    
        <q-card-section class="q-pa-lg">
          <q-select 
            label="new position"
            v-model="position"
            :options="positions"
            :readonly="!appState.isLM"
          />
        </q-card-section>
    
        <q-card-actions>
          <q-btn flat @click="onOk">OK</q-btn>
          <q-btn flat @click="onDialogCancel">Cancel</q-btn>
        </q-card-actions>
    
      </q-card>
    </q-dialog>
  </template>
  
  