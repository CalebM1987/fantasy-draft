<script lang="ts" setup>
import { computed, ref } from 'vue'
import { IDraftedPlayer } from '../../types/players'
import { useAppStore } from '../../store'
import { usePlayerStore } from '../../store';
import { playerDisplayName } from '../../utils/utils';
import { removeDraftPick } from '../../services/firebase'
import { usePlayerInfo } from '../../composables/player-info'
import { log } from '../../utils/logger';

const appState = useAppStore()
const players = usePlayerStore()

interface Props {
  pickNumber: number;
}

const player = computed(()=> players.draftPicks.find(p => p.pickNumber === props.pickNumber))
const isLastPick = computed(()=> players.draftPicks.length  === props.pickNumber)
const roundPickNumber = computed<string | undefined>(()=> {
  if (players.totalPickCount && appState.rosterSize){
    const remainder = props.pickNumber % appState.sortedMembers.length 
    const rd = remainder 
      ? Math.floor(props.pickNumber / appState.sortedMembers.length) + 1
      : props.pickNumber / appState.sortedMembers.length
    const rdPick = remainder ? remainder : appState.sortedMembers.length
    return `${rd}.${rdPick}`
  }
  return undefined
})
const props = defineProps<Props>()
const showRemoveBtn = ref(false)
const isLoading = ref(false)

const showDetails = async ()=> {
  log('should show details from draft square')
  if (player.value){
    const { showPlayerDetails } = usePlayerInfo(player.value)
    try {
      isLoading.value = true
      await showPlayerDetails()
    } catch(err){
      log('failed to load details: ', err)
    } finally {
      isLoading.value = false
    }
  }
}

</script>

<template>
 <div 
    :class="`draft-square ${appState.compactView ? '': '--fixed-width'}`" 
    :id="`draft-square-${pickNumber}`"
  >
    <div class="picks-header q-px-xs">
      <span><strong>{{ pickNumber }}</strong></span>
      <span 
        :title="`round ${roundPickNumber?.split('.')[0]}, pick ${roundPickNumber?.split('.')[1]}`"
      >{{ roundPickNumber }}</span>
    </div>

    <slot v-if="player">
      <div 
        @mouseenter="showRemoveBtn = true"
        @mouseleave="showRemoveBtn = false"
        @click.stop.prevent="showDetails"
        :class="`drafted-player-name q-pa-md pos-${player.position.toLowerCase()}`"
      >
        <q-btn 
          round
          flat
          v-if="isLastPick && showRemoveBtn"
          title="remove pick from board"
          style="font-size: 0.6rem; margin: -1.5rem -.5rem;"
          icon="person_remove" 
          @click.stop.prevent="removeDraftPick(players.pickLookup[player!.player_id])" 
        />
        <div class="text-center q-my-sm">{{ playerDisplayName(player) }}</div>
        <div style="display: flex; justify-content: space-around; font-size: 0.6rem;">
          <span>{{ player.team }}</span>
          <span>{{ player.position }}</span>
          <span><strong>{{ player.bye }}</strong></span>
        </div>

        <div class="q-pa-sm mx-auto" style="font-size: 0.7rem;" v-if="isLoading">
          <q-spinner-oval
            size=".7rem"
          />
          <p>loading details...</p>
        </div>
      </div>
    </slot>
  </div>
</template>

<style lang="scss">
.picks-header {
  margin-top: 3px;
  color: black;
  font-size: 0.5rem;
  display: flex;
  justify-content: space-between;
}

.draft-square {
  cursor: pointer;
  height: 108px;
  border: solid 1px;
  background-color: #D3D3D3;
  &.--fixed-width {
    width: 200px;
  }
}

.drafted-player-name {
  font-size: 0.7rem;
  min-height: 50px;
}
</style>