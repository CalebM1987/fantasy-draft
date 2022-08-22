<script lang="ts" setup>
import { ref } from 'vue'
import { IPlayer } from '../../types/players'
import { usePlayerStore } from '../../store'

const players = usePlayerStore()
interface Props {
  player: IPlayer;
  rankType: "adp" | "position_rank"
}


const props = defineProps<Props>()

</script>

<template>
  <q-item clickable v-ripple :class="`player-container pos-${player.position.toLowerCase()}`">
    <q-item-section>
      <q-item-section>

        <q-item-label class="q-py-md player-content player-label">
          <span class="rank">{{ rankType === 'adp' ? player.rank: player.position_rank }}.</span>
          <strong>{{ player.name }}</strong>
          <span><q-btn rounded flat :icon="'person_add'" @click="players.draftPlayer(player)"/></span>
        </q-item-label>
      </q-item-section>
      
      <q-item-section>
        <q-item-label  class="player-content q-px-md q-py-sm">
          <span>{{ player.position }}</span>
          <span>{{ player.team }}</span>
          <span>bye: <strong>{{ player.bye }}</strong></span>
        </q-item-label>
    
      </q-item-section>
   
    </q-item-section>

  </q-item>
</template>

<style lang="scss">
.player-label {
  font-size: 1.2rem;
}
.player-content {
  display: flex;
  justify-content: space-between;
}
</style>