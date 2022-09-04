<script lang="ts" setup>
import { IRosterSettings, RosterFormat } from '@/types';
import { useAppStore } from '@/store'

const appState = useAppStore()

interface Props {
  roster: IRosterSettings;
}
const props = defineProps<Props>()

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

</script>

<template>
  <q-form ref="rosterForm" class="q-pa-md">
    <q-input 
      label="Roster Size"
      v-model="roster.size"
      type="number"
      lazy-rules
    />

    <q-select 
      label="Roster Format"
      v-model="roster.format"
      :options="rosterFormats"
    />

  </q-form>
</template>