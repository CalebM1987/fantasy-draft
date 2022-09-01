import { ref } from 'vue'
import { log } from '../utils/logger';
import { useAppStore, usePlayerStore } from '../store';
import { updateLeagueClock } from '../services/firebase'
import { EventBus } from '../events/event-bus';

const interval = ref<NodeJS.Timeout | undefined>()
const isTicking = ref(false)
const publicMessage = ref<string | undefined>(undefined)

export function useDraftClock() {
  const appState = useAppStore()
  const players = usePlayerStore()

  const onStartClicked = async ()=> {
    if (appState.isLM){
      await updateLeagueClock('start')
    }
  }

  const onPauseClicked = async ()=> {
    pauseTimer()
    if (appState.isLM){
      await updateLeagueClock('pause')
    }
  }

  const startTimer = ()=> {
    if (!interval.value){
      interval.value = setInterval(()=> {
        appState.timer -= 1000
        if (appState.timer === 0){
          pauseTimer()
          EventBus.emit('draft-clock-expired')
          log('draft clock has expired')
        } 
      }, 1000)
      isTicking.value = true
      log(`started draft pick timer, clock is at ${appState.timer / 1000} seconds`)
    }
  }

  const pauseTimer = ()=> {
    if (interval.value){
      clearInterval(interval.value)
      interval.value = undefined
      isTicking.value = false
      log(`paused draft pick timer, clock is at ${appState.timer / 1000} seconds`)
    }
  }

  const resetTimer = ({time=undefined, start=undefined }: { time?: number; start?: boolean })=> {
    pauseTimer()
    appState.timer = time ?? appState.timeLimit
    start = start ?? false
    log('reset draft timer with auto start: ', start)
    start && startTimer()
  }

  const displayClock = (seconds=0): string => {
    const parts = [
      Math.floor((seconds / 1000) / 60 / 60), 
      Math.floor((seconds / 1000) / 60 % 60),
      Math.round((seconds / 1000) % 60)
    ];
    if (!parts[0]){
      parts.splice(0,1);
    }
    return parts
      .join(":")
      .replace(/\b(\d)\b/g, "0$1");
  }

  const beginDraft = async ()=> {
    appState.hasStartedDraft = true
    await updateLeagueClock('start', appState.timeLimit)
    log('beginning draft at: ', new Date())
  }

  return {
    interval, 
    isTicking,
    onStartClicked,
    onPauseClicked,
    startTimer,
    pauseTimer,
    resetTimer,
    beginDraft,
    displayClock,
    publicMessage
  }
}