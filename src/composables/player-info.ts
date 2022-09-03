import { ref, computed, defineAsyncComponent } from 'vue'
import { usePlayerStore } from '../store'
import { IPlayer, IPlayerDetails } from '../types/players'
import { fetchPlayerDetails } from '../services/fantasycalculator'
import { Dialog } from 'quasar'
import { log } from '../utils/logger'
const PlayerDetails = defineAsyncComponent(()=> import('../components/players/PlayerDetails.vue'))

/**
 * composables for working with player info
 * @param player - the player
 * @returns 
 */
export function usePlayerInfo(player: IPlayer){

  const players = usePlayerStore()

  const isFavorite = ref(players.favorites.includes(player.player_id))

  const isDrafted = computed(()=> players.pickLookup[player.player_id])
  
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
    if (player.position === 'DEF' || player.isCustom) return;
    try {
      isLoadingDetails.value = true
      let details: IPlayerDetails | undefined = players.playerDetailsCache[player.player_id]
      if (!details){ 
        details = await fetchPlayerDetails(player)
        if (!details){
          console.warn('no player details could be extracted for player: ', player)
          return
        }
        players.playerDetailsCache[player.player_id] = details
        log('set player details in cache: ', details)
      } else {
        log('pulled player details from cache:', details)
      }

      if (details?.news?.length){
        Dialog.create({
          component: PlayerDetails,
          componentProps: {
            details
          }
        })
      } else {
        log(`No details found for player: "${player.name}"`)
      }
    } catch (err){
      console.warn(err)
      throw err
    } finally {
      isLoadingDetails.value = false
    }
  }

  return {
    isDrafted,
    isFavorite,
    updateFavorites,
    isLoadingDetails,
    showPlayerDetails,
  }
} 