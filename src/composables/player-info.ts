import { ref, computed, defineAsyncComponent } from 'vue'
import { usePlayerStore } from '../store'
import { IPlayer, IPlayerDetails } from '../types'
import { Dialog, Notify } from 'quasar'
import { getPlayerStatus } from '../utils'
import { fetchPlayerDetails } from '../services/espn'
import { log } from '../utils/logger'
const PlayerDetails = defineAsyncComponent(()=> import('../components/players/PlayerDetails.vue'))

/**
 * composables for working with player info
 * @param player - the player
 * @returns 
 */
export function usePlayerInfo(player: IPlayer){

  const players = usePlayerStore()

  const isFavorite = ref(players.favorites.includes(player.id))

  const isDrafted = computed(()=> players.pickLookup[player.id])

  const status = computed(()=> getPlayerStatus(player))
  
  const isLoadingDetails = ref(false)
  
  const updateFavorites = ()=> {
    isFavorite.value = !isFavorite.value
  
    if (isFavorite.value){
      players.addToFavorites(player)
    } else {
      players.removeFromFavorites(player)
    }
  }
  
  const showPlayerDetails = async ()=> {
    if (player.position === 'D/ST' || player.isCustom) return;
    try {
      isLoadingDetails.value = true
      let details: IPlayerDetails | undefined = players.playerDetailsCache[player.id]
      if (!details){ 
        details = await fetchPlayerDetails(player)
        if (!details){
          console.warn('no player details could be extracted for player: ', player)
          return
        }
        players.playerDetailsCache[player.id] = details
        log('set player details in cache: ', details)
      } else {
        log('pulled player details from cache:', details)
      }

      // create dialog
      Dialog.create({
        component: PlayerDetails,
        componentProps: {
          details,
          player
        }
      })
    } catch (err){
      console.warn(err)
      Notify.create({
        type: 'warning',
        message: `No details found for player: "${player.fullName}"`
      })
      throw err
    } finally {
      isLoadingDetails.value = false
    }
  }

  return {
    status,
    isDrafted,
    isFavorite,
    updateFavorites,
    isLoadingDetails,
    showPlayerDetails,
  }
} 