<script lang="ts" setup>
import { defineAsyncComponent } from 'vue';
import { IRosterSettings, RosterFormat  } from '../../../types';
import { useAppStore, usePlayerStore } from '../../../store'
import { useQuasar } from 'quasar';
const AddPosition = defineAsyncComponent(()=> import('./AddPosition.vue'))

const appState = useAppStore()
const { positions } = usePlayerStore()
const $q = useQuasar()

const rosterFormats: { text: string; value: RosterFormat }[] = [
  {
    text: 'Standard',
    value: 'standard'
  }, {
    text: '2 QB',
    value: 'two-qb'
  }, {
    text: 'Custom',
    value: 'custom'
  }
]

const removePosition = (idx: number)=>  {
  appState.league?.roster?.positions.splice(idx, 1)
}


const addPosition = ()=> {
  $q.dialog({
    component: AddPosition
  }).onOk(position => {
    appState.league?.roster?.positions.push(position)
  }).onCancel(() => {
    // console.log('>>>> Cancel')
  }).onDismiss(() => {
    // console.log('I am triggered on both OK and Cancel')
  })
}


</script>

<template>
  <q-form ref="rosterForm" class="q-pa-md" v-if="appState.league?.roster?.size" >
    <q-input 
      class="q-py-md"
      label="Roster Size"
      v-model="appState.league.roster.size"
      type="number"
      lazy-rules
      :readonly="!appState.isLM"
    />

    <q-select 
      class="q-py-md"
      label="Roster Format"
      v-model="appState.league.roster.format"
      :options="rosterFormats"
      :readonly="!appState.isLM"
    />

    <div class="roster-spots">
      <div class="row">
        <div class="text-h6">Set Roster Spots</div>
        <q-btn 
          flat
          rounded
          icon="add_circle_outline"
          title="add position"
          @click="addPosition"
        />
      </div>
      <div class="text-caption text-italic grey-1">all remaining roster are bench</div>
      <q-separator class="q-mb-lg" />
      <q-list bordered separator class="q-pa-md roster-spots-list">
        <q-item 
          v-ripple 
          clickable 
          :key="i"
          v-for="(pos, i) in appState.league?.roster?.positions" 
        >
          <q-item-section avatar @click="removePosition(i)" v-if="appState.isLM">
            <q-icon 
              color="negative" 
              name="close" 
              title="remove roster spot"
              style="font-size: 0.9rem;" 
            />
          </q-item-section>
          <q-item-section style="flex-direction: row;">
            <span>{{ i + 1 }}.</span>
            <strong class="q-ml-lg">{{ pos }}</strong>
          </q-item-section>
          <q-item-section></q-item-section>
        </q-item> 
      </q-list>
    </div>

  </q-form>
</template>

<style>
.roster-spots {
  max-width: 350px;
}
</style>