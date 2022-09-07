<script lang="ts" setup>
import { ref, defineAsyncComponent } from 'vue'
import { useAppStore } from '../../../store'
const RosterSettings = defineAsyncComponent(()=> import('./RosterSettings.vue'))

const appState = useAppStore()

interface ICategory {
  label: string;
  component: any,
  icon?: string;
  caption?: string;
  props?: any;
}
const categories: ICategory[] = [
  {
    icon: 'settings',
    label: 'League Info',
    component: undefined
  },
  {
    icon: 'manage_accounts',
    label: 'Roster Settings',
    component: RosterSettings,
  },
]

</script>

<template>
  <div class="league-summary q-pa-lg">
    <q-list bordered class="rounded-borders list" v-if="appState.league?.id">
      <q-expansion-item
        default-opened
        v-for="category in categories"
        :key="category.label"
        expand-separator
        class="q-mb-md"
        style="font-size: 1.1rem;"
        :icon="category.icon"
        :label="category.label"
        :caption="category.caption"
      >
        <q-card>
          <q-card-section>
            <Component :is="category.component" v-if="category.component" />
            <div class="text-h5 q-pa-xl" v-else>No Content</div> 
          </q-card-section>
        </q-card>
      </q-expansion-item>
    </q-list>


  </div>

</template>

<style lang="scss">
  .league-settings .list{
    height: 850px;
    overflow: auto;
  }
</style>