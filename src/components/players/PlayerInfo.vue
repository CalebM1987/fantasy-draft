<script lang="ts" setup>
import { IPlayer } from '../../types/players'
import { usePlayerStore, useAppStore } from '../../store'
import { usePlayerInfo } from '../../composables/player-info'
import { log } from '../../utils/logger'

const players = usePlayerStore()
const appState = useAppStore()
interface Props {
  player: IPlayer;
  rankType: "adp" | "position_rank"
}
const props = defineProps<Props>()

const {
  isDrafted,
    isFavorite,
    updateFavorites,
    isLoadingDetails,
    showPlayerDetails,
 } = usePlayerInfo(props.player)

</script>

<template>
  <q-item 
    clickable 
    v-ripple 
    @click.stop.prevent="showPlayerDetails"
    :class="`player-container pos-${player.position.toLowerCase()}`"
    title="click for player news"
  >
    <q-item-section>
      <q-item-section>
        <q-item-label 
          class="q-py-sm player-content player-label"
          :style="isDrafted ? 'color: #505050; font-style: italic;': ''"
        >
          <span class="rank">{{ rankType === 'adp' ? player.rank: player.position_rank }}.</span>
          <span><strong>{{ player.name }}</strong></span>
          <span>
            <span 
              v-if="!isDrafted"
              class="player-actions"
            >
              <span>
                <q-btn
                  flat
                  rounded
                  :title="`${isFavorite ? 'remove from': 'add to'} favorites`"
                  :icon="isFavorite ? 'star': 'star_outline'" 
                  @click.stop.prevent="updateFavorites"
                />
              </span>
              <span>
                <q-btn 
                  v-if="appState.isLM"
                  flat 
                  rounded 
                  style="margin-left: -1.35rem;"
                  :icon="'person_add'" 
                  :disable="!appState.hasStartedDraft"
                  @click.stop.prevent="players.draftPlayer(player)"
                />
              </span>
            </span>
          </span>
        </q-item-label>
      </q-item-section>
      
      <q-item-section>
        <q-item-label  
          class="player-content q-px-md q-py-sm"
          :style="isDrafted ? 'color: #505050; font-style: italic;': ''"
        >
          <span>{{ player.position }}</span>
          <span>{{ player.team }}</span>
          <span>Bye: <strong>{{ player.bye }}</strong></span>
        </q-item-label>
      </q-item-section>

      <q-item-section v-if="isLoadingDetails">
        <div class="q-pa-sm mx-auto">
          <q-spinner-oval
            color="primary"
            size="1rem"
          />
          <p>loading details...</p>
        </div>
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