import { ref, computed, defineAsyncComponent } from 'vue'
import { usePlayerStore } from '../store'
import { IPlayer, IPlayerDetails } from '../types'
import { Dialog, Notify } from 'quasar'
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

  const status = computed(()=> {
    let st: 'O' | 'D'| 'Q' | 'SSPD' | 'IR' | undefined = undefined
    switch(player.injuryStatus){
      case 'DOUBTFUL': {
        st = 'D'
        break;
      }
      case 'OUT': {
        st = 'O'
        break;
      }
      case 'QUESTIONABLE': {
        st = 'Q'
        break;
      }
      case 'INJURY_RESERVE': {
        st = 'IR';
        break;
      }
      default: {
        break;
      }
    }
    return st
  })
  
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
        // details = await fetchPlayerDetails(player)
        details = {} as any
        if (!details){
          console.warn('no player details could be extracted for player: ', player)
          return
        }
        players.playerDetailsCache[player.id] = details
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
        Notify.create({
          type: 'warning',
          message: `No details found for player: "${player.fullName}"`
        })
      }
    } catch (err){
      console.warn(err)
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