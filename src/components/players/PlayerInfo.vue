<script lang="ts" setup>
import { ref } from 'vue'
import { IPlayer } from '../../types/players'

interface Props {
  player: IPlayer;
  rankType: "adp" | "position_rank"
}


const props = defineProps<Props>()

</script>

<template>
  <q-item clickable v-ripple>
    <q-item-section>

      <div :class="`player-container pos-${player.position.toLowerCase()} q-pa-sm q-mt-sm, q-mb-1`">
        <h5><span class="float-left rank">{{ rankType === 'adp' ? player.rank: player.position_rank }}.</span><strong>{{ player.name }}</strong></h5>
        <div class="d-flex justify-content-between p-1">
          <p>{{ player.position }}</p>
          <p>{{ player.team }}</p>
          <p>bye: {{ player.bye }}</p>
        </div>
    
      </div>
    </q-item-section>

  </q-item>
</template>