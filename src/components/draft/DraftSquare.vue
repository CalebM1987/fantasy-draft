<script lang="ts" setup>
import { computed, ref } from 'vue'
import { IDraftedPlayer } from '../../types/players'
import { useAppStore } from '../../store'
import { usePlayerStore } from '../../store';
import { playerDisplayName } from '../../utils/utils';
import { removeDraftPick } from '../../services/firebase'

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

</script>

<template>
 <div 
    :class="`draft-square ${appState.compactView ? '': '--fixed-width'}`" 
    :id="`draft-square-${pickNumber}`"
  >
    <div class="picks-header q-px-xs">
      <span><strong>{{ pickNumber }}</strong></span>
      <span :title="`round ${roundPickNumber?.split('.')[0]}, pick ${roundPickNumber?.split('.')[1]}`">{{ roundPickNumber }}</span>
    </div>
    <slot v-if="player">
      <div 
        @mouseenter="showRemoveBtn = true"
        @mouseleave="showRemoveBtn = false"
        :class="`drafted-player-name q-pa-md pos-${player.position.toLowerCase()}`"
      >
        <q-btn 
          round
          flat
          v-if="isLastPick && showRemoveBtn"
          title="remove pick from board"
          style="font-size: 0.6rem; margin: -1.5rem -.5rem;"
          icon="person_remove" 
          @click="removeDraftPick(players.pickLookup[player!.player_id])" 
        />
        <div class="text-center q-my-sm">{{ playerDisplayName(player) }}</div>
        <div style="display: flex; justify-content: space-around; font-size: 0.6rem;">
          <span>{{ player.team }}</span>
          <span>{{ player.position }}</span>
          <span><strong>{{ player.bye }}</strong></span>
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