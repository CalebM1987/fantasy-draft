import { set } from 'firebase/database'
import { useAppStore } from '../../store';
import { getReference } from './core';
import { DraftClockOperation } from '../../types';

export async function updateLeagueClock(operation: DraftClockOperation, time?: number){
  const appState = useAppStore()
  const timeRef = getReference('draft-clock')
  const message = operation === 'pause' 
    ? 'the League Manager has paused the clock'
    : operation === 'start'
      ? 'the League Manager has started the clock'
      : ''

  await set(timeRef, {
    time: time ?? appState.timer,
    timestamp: new Date().getTime(),
    operation,
    message
  })
}

// @ts-ignore
hook.updateClock = updateLeagueClock