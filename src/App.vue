<template>
  <q-layout view="hHh lpR fFf">

    <q-header elevated class="bg-primary text-white" height-hint="98">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>
          <q-avatar icon="sports_football" />
          Draft Party - {{ config.league.name }}
        </q-toolbar-title>

        <q-btn dense flat round icon="menu" @click="toggleRightDrawer" />
      </q-toolbar>

      <q-tabs align="center">
        <q-route-tab to="/" label="Draft Room" />
        <q-route-tab to="/page2" label="Teams" />
        <q-route-tab to="/page3" label="League Settings" />
      </q-tabs>
    </q-header>

    <q-drawer show-if-above v-model="leftDrawerOpen" side="left" bordered>
      <!-- drawer content -->
    </q-drawer>

    <q-drawer show-if-above v-model="rightDrawerOpen" side="right" bordered>
      <!-- drawer content -->
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useAppStore } from './store'
const { config } = useAppStore()

const $q = useQuasar()

$q.dark.set(true)

const leftDrawerOpen = ref(false)
const rightDrawerOpen = ref(false)

    
const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value
}


const toggleRightDrawer = () => {
  rightDrawerOpen.value = !rightDrawerOpen.value
}

onMounted(()=> {
  setTimeout(()=> {
    toggleLeftDrawer()
    toggleRightDrawer()
  }, 20)
})
    
</script>

<style>
.pos-rb {
  background-color: rgb(255, 38, 0);
}

.pos-wr {
  background-color: rgb(49, 193, 9);
}

.pos-def {
  background-color: rgba(252, 118, 15, 0.995);
}

.pos-qb {
  background-color: rgb(70, 133, 243);
}

.pos-pk {
  background-color: rgba(201, 59, 185, 0.872);
}

.pos-te {
  background-color:gold;
}
</style>