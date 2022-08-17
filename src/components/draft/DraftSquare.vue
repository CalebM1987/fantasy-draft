<script lang="ts" setup>
import { IDraftedPlayer } from '../../types/players'
import { useAppStore } from '../../store'

const appState = useAppStore()

interface Props {
  pickNumber: number;
  player?: IDraftedPlayer;
}

const playerDisplayName = (player: IDraftedPlayer) => {
  const name = player.name
  const parts = name.split(' ')
  const first = parts[0]
  console.log('parts: ', parts, first)
  return name
  // return [
  //   first.includes('.') ? first: (first[0] + '.'),
  //   ..parts.slice(1)
  // ].join(' ')
}

const props = defineProps<Props>()

</script>

<template>
 <div :class="`draft-square ${appState.compactView ? '': '--fixed-width'}`" :id="`draft-square-${pickNumber}`">
    <div class="pick-number">{{ pickNumber }}</div>
    <slot v-if="player">
      <div 
        :class="`drafted-player-name q-pa-md pos-${player.position.toLowerCase()}`"
      >{{ playerDisplayName(player) }}</div>
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
  min-height: 50px;
}
</style>