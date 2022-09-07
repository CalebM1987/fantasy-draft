import { defineAsyncComponent, computed, defineEmits } from "vue";
import { QuasarDialogEmits, IPlayer } from "../types";
import { useDraftClock } from '../composables/draft-clock';
import { usePlayerStore } from "../store";
import { clonePlayer } from "../utils";

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
    // const player = clonePlayer(bestAvailable.value)
    try {
      await players.draftPlayer(bestAvailable.value)
      resetTimer({ start: true })
      return clonePlayer(bestAvailable.value)
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