import { defineAsyncComponent, computed, defineEmits } from "vue";
import { useDraftClock } from '../composables/draft-clock';
import { QuasarDialogEmits, IPlayer } from "../types";
import { usePlayerStore } from "../store";

export interface AutoDraftEmits extends QuasarDialogEmits {
  (e: 'did-auto-draft-player', player: IPlayer): void; 
  (e: 'cancel-auto-draft-player'): void; 
}

export function useAutoDraft(){

  const { resetTimer } = useDraftClock()

  const players = usePlayerStore()
  
  const bestAvailable = computed(()=> players.availablePlayers[0])
  
  // extend the dialog emitter
  const emit = defineEmits<AutoDraftEmits>()
  
  const autoDraftPlayer = async (): Promise<IPlayer> => {
    const player = Object.freeze(bestAvailable.value)
    try {
      await players.draftPlayer(bestAvailable.value)
      resetTimer({ start: true })
      return player
    } catch(err){
      throw err
    }
  }

  return {
    emit,
    bestAvailable,
    autoDraftPlayer
  }
  
}