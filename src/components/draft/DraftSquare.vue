<script lang="ts" setup>
import { computed } from 'vue'
import { IDraftedPlayer } from '../../types/players'
import { useAppStore } from '../../store'
import { usePlayerStore } from '../../store';
import { playerDisplayName } from '../../utils/utils';

const appState = useAppStore()
const players = usePlayerStore()

interface Props {
  pickNumber: number;
}

const player = computed(()=> players.draftPicks.find(p => p.pickNumber === props.pickNumber))

const props = defineProps<Props>()

</script>

<template>
 <div :class="`draft-square ${appState.compactView ? '': '--fixed-width'}`" :id="`draft-square-${pickNumber}`">
    <div class="pick-number">{{ pickNumber }}</div>
    <slot v-if="player">
      <div 
        :class="`drafted-player-name q-pa-md pos-${player.position.toLowerCase()}`"
      >
        <div class="text-center q-my-sm">{{ playerDisplayName(player) }}</div>
        <div style="display: flex; justify-content: space-around; font-size: 0.6rem;">
          <span>{{ player.team }}</span>
          <span>{{ player.position }}</span>
        </div>
      </div>
    </slot>
  </div>
</template>

<style lang="scss">
.pick-number {
  /* position: absolute; */
  // top: 3px;
  // left: 3px;
  margin: 3px 3px;
  color: black;
  font-size: 0.5rem;
}

.draft-square {
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