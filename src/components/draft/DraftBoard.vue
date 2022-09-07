<script lang="ts" setup>
import { computed, defineAsyncComponent, onMounted, ref } from 'vue'
import { useAppStore } from '../../store'
import { useQuasar } from 'quasar';
import { log } from '../../utils/logger';
import { EventBus } from '../../events/event-bus';
import { updateHook } from '../../utils';
import { useAutoDraft } from '../../composables/auto-draft';
import { updateLeagueClock } from '../../services/firebase';
import DraftSquare from './DraftSquare.vue';
const AutoDraftPlayer = defineAsyncComponent(()=> import('../draft/AutoDraftPlayer.vue'))

updateHook({ updateLeagueClock })

const appState = useAppStore()
const colSize = computed(()=> Math.min(Math.max(Math.ceil(12 / appState.sortedMembers.length), 1), 12))
const rounds = computed(()=> appState.league?.roster?.size ?? 14)
const gridClass = computed(()=> `grid-cell${appState.compactView ? ' col-md-' + colSize.value: '--fixed-width'}`)
const draftType = appState.league?.draft?.type ?? 'snake'
const autoDraftPromptOpen = ref(false)
log('teams: ', appState.sortedMembers)

const $q = useQuasar()
const { autoDraftPlayer } = useAutoDraft()

EventBus.on('draft-clock-expired', ()=> {
  autoDraftPromptOpen.value = true
  $q.dialog({
    component: AutoDraftPlayer,
  }).onOk(async ()=> {
    try {
      await autoDraftPlayer()
    } catch(err) {
      log('Failed to auto draft player', err)
      throw err
    }
  }).onDismiss(()=> {
    autoDraftPromptOpen.value = false
    // do not reset clock, wait for pick to be made
    // updateLeagueClock('reset', appState.timeLimit).then(()=> log('dismissed auto draft prompt'))
  
  })
})

onMounted(()=> {
  EventBus.on('draft-clock-expired', async ()=> {
    if (appState.isLM){
      // reset the timer
      if (!autoDraftPromptOpen.value){
        await updateLeagueClock('reset', appState.timeLimit)
        log('reset the clock in db after expiration')
      }
    }
  })
})

</script>

<template>
  <div class="col-md-9 q-pa-md q-mr-md" style="overflow: auto;">
   
    <div :class="`row${appState.compactView ? '': 'x'} franchise-header`">
      <div v-for="team in appState.sortedMembers" :key="team.name" :class="gridClass">
        <div :class="`team-header ${gridClass}`">
          <div class="q-pa-sm">
            <div class="player-name">{{ team.name }}</div>
            <div class="team-name">{{ team.teamName }}</div>
          </div>
        </div>
      </div>
    </div>

    <div v-for="(round, ri) in rounds" :key="round" :class="`row${appState.compactView ? '': 'x'} picks-container`">

      <div v-for="(team, ti) in appState.sortedMembers" :key="team.name" :class="gridClass">
        <draft-square 
          :pickNumber="(ri*appState.sortedMembers.length) + Math.abs(draftType === 'snake' && (ri > 0  && (ri % 2)) ? appState.sortedMembers.length-ti: ti+1)">
        </draft-square>
      </div>
    </div>

  </div>
</template>

<style lang="scss">

  .rowx {
    display: flex;
  }
  .picks-container {
    /* overflow: auto; */
  }

  .franchise-header {
    position:-webkit-sticky; 
    position:sticky; 
    top:0;
  }

  .board-container {
    overflow: auto;
  }

  .team-header {
    border: solid 1px;
    height: 100%;
  }

  .player-name {
    font-size: 1rem;
    font-weight: bold;
  }

  .team-name {
    font-size: 0.85rem;
  }

  .grid-cell {
    padding: 1px !important;
    height: 100%;
    &--fixed-width {
      width: 200px;
    }
    /* width: 170px;
    height: 100px; */
    /* padding-right: 1px !important; */
  }

</style>