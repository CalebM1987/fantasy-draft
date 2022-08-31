<script lang="ts" setup>
import { ref, computed, } from 'vue'
import { useQuasar } from 'quasar'
import { IPlayer, IPlayerDetails } from '../../types/players'
import { usePlayerStore, useAppStore } from '../../store'
import { fetchPlayerDetails } from '../../services/fantasycalculator'
import { log } from '../../utils/logger'
import PlayerDetails from './PlayerDetails.vue'
// const PlayerDetailsComp = defineAsyncComponent(()=> import('./PlayerDetails.vue'))

const players = usePlayerStore()
const appState = useAppStore()
interface Props {
  player: IPlayer;
  rankType: "adp" | "position_rank"
}
const props = defineProps<Props>()

const $q = useQuasar()
const isFavorite = ref(players.favorites.includes(props.player.player_id))

const isDrafted = computed(()=> players.pickLookup[props.player.player_id])

const isLoadingDetails = ref(false)
const showPlayerDetails = ref(false)

const updateFavorites = ()=> {
  isFavorite.value = !isFavorite.value

  if (isFavorite.value){
    players.addToFavorites(props.player)
  } else {
    players.removeFromFavorites(props.player)
  }
}

const loadDetails = async ()=> {
  try {
    isLoadingDetails.value = true
    let details: IPlayerDetails | undefined = players.playerDetailsCache[props.player.player_id]
    if (!details){ 
      details = await fetchPlayerDetails(props.player)
      if (!details){
        console.warn('no player details could be extracted for player: ', props.player)
        return
      }
      players.playerDetailsCache[props.player.player_id] = details
      log('set player details in cache: ', details)
    } else {
      log('pulled player details from cache:', details)
    }
    // $q.dialog({
    //   component: PlayerDetailsComp,
    //   componentProps: { details }
    // })
    showPlayerDetails.value = true
  } catch (err){
    console.warn(err)
    throw err
  } finally {
    isLoadingDetails.value = false
  }
}

</script>

<template>
  <q-item 
    clickable 
    v-ripple 
    @click.stop.prevent="loadDetails"
    :class="`player-container pos-${player.position.toLowerCase()}`"
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

    <q-dialog v-model="showPlayerDetails">
      <player-details :details="players.playerDetailsCache[player.player_id]" />
    </q-dialog>
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