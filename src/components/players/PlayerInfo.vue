<script lang="ts" setup>
import { computed } from 'vue'
import { IPlayer } from '../../types'
import { usePlayerStore, useAppStore } from '../../store'
import { usePlayerInfo } from '../../composables/player-info'
import { log } from '../../utils/logger'

// https://a.espncdn.com/combiner/i?img=/i/headshots/nfl/players/full/4242335.png&w=96&h=70&cb=1

const players = usePlayerStore()
const appState = useAppStore()
interface Props {
  player: IPlayer;
  rankType: "adp" | "position_rank"
}
const props = defineProps<Props>()
const percentChanged = computed(()=> Math.abs(props.player.ownership.percentChange) > 0.1 ? parseFloat(props.player.ownership.percentChange.toFixed(1)): 0)

const {
  status,
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
    class="player-container pos"
    :class="`${player.position === 'D/ST' ? 'DEF': player.position}`"
    title="click for player news"
  >
    <q-item-section class="player-info-container">
      <q-item-section>
        <q-item-label 
          class="q-py-sm player-content player-label"
          :style="isDrafted ? 'color: #505050; font-style: italic;': ''"
        >
          <span class="rank">{{ rankType === 'adp' ? player.rank: player.position_rank }}.</span>
          <span>
            <strong>{{ player.fullName }}</strong>
            <q-badge
              rounded
              v-if="status"
              class="q-ml-sm"
              color="negative"
            >{{ status }}</q-badge>
          </span>
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

      <q-item-section v-if="player.ownership.percentOwned">
        <q-item-label caption class="row justify-between percentOwn">
          <span>{{ player.ownership.percentOwned.toFixed(1).replace(/(.[0]+)$/,"") }}% owned </span>
          <span>{{ player.ownership.percentStarted.toFixed(1).replace(/(.[0]+)$/,"") }}% started</span>
          <span></span>
          <q-badge 
            rounded
            floating
            :title="`trending ${percentChanged < 0 ? 'down': 'up'}`"
            :color="percentChanged < 0 ? 'negative': 'success'"
            v-if="percentChanged"
          >{{ `${percentChanged > 0 ? '+':''}${percentChanged}` }}</q-badge>
        </q-item-label>
      </q-item-section>
      
      <q-item-section>
        <q-item-label  
          class="player-content q-px-md q-py-sm"
          :style="isDrafted ? 'color: #505050; font-style: italic;': ''"
        >
        <div class="info" >
          <span class="pos ros" :class="`${player.position === 'D/ST' ? 'DEF': player.position}`">{{ player.position }}</span>
          <span>{{ player.team }}</span>
          <span>Bye: <strong>{{ player.bye }}</strong></span>
        </div>
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
  @import '../../base.scss';
.player-info-container{
  background: #f7f7f7bd;
    border: 1px solid #ffffffa3;
    width: 50%;
    border-radius: 3px;
}

.player-container{
  color: white;
}

.percentOwn{
  display: flex;
  & > span{
    color: black;
    margin: auto;
  }
}

.player-content {
  display: flex;
  justify-content: space-between;
  border-radius: 2px;
  margin: auto;
  margin: 5px auto 0 auto;
  & .info{
    display: flex;
    width: 20vh;
    justify-content: space-between;
    color: #4a4a4a;
    & > span{
      margin: auto;
    }
  }
  &.player-label{
    color: #4a4a4a;
    padding: 2px 1px;
    margin: 0px 10px 5px;
    align-items: center;
    justify-content: space-evenly;
    border-radius: 3px;
    font-size: 1.2rem;
  }
}
</style>