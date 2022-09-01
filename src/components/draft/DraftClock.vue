<script lang="ts" setup>
import { ref } from 'vue'
import { useAppStore, usePlayerStore } from '../../store';
import { useDraftClock } from '../../composables/draft-clock'
import { useQuasar } from 'quasar';

const {
  isTicking,
  onStartClicked,
  onPauseClicked,
  beginDraft,
  displayClock,
  publicMessage
} = useDraftClock()

const appState = useAppStore()
const players = usePlayerStore()
const $q = useQuasar()

</script>

<template>
  <div class="draft-clock q-pa-md">
    <div class="timer-container" v-if="appState.hasStartedDraft">
      <div class="row items-start">
        <span 
          v-if="players.onTheClock"
          class="pulsate on-the-clock" 
        >{{ players.onTheClock.name }} is on the clock!</span>
        <div class="timer">{{ displayClock(appState.timer) }}</div>
        <q-btn
          flat
          rounded
          v-if="appState.isLM"
          style="font-size: 1.2rem"
          :icon="isTicking ? 'pause_circle': 'play_circle'"
          :title="`${isTicking ? 'pause': 'start'} timer`"
          @click="isTicking ? onPauseClicked(): onStartClicked()"
        />
      </div>
      
      <div 
        class="clock-public-message row float-right items-end" 
        v-if="publicMessage && !appState.isLM"
      >
        <span class="q-mr-sm">
          <q-icon
            color="yellow"
            name="warning"
            
          />
        </span>
        <span class="text-gray"><i>{{ publicMessage }}</i></span>
      </div>
    </div>

    <q-btn 
      v-else
      color="negative" 
      @click="beginDraft"
      :disable="!appState.isLM"
    >Begin Draft</q-btn>

  </div>
</template>

<style lang="scss">
.timer {
  font-size: 2rem;
}

.on-the-clock {
  font-size: 1.8rem;
  // color: #d9534f;
  color: #AB0003;
  margin: .2rem .8rem;
}

.clock-public-message {
  font-size: .9rem;
}

.pulsate {
  -webkit-animation: pulsate 3s ease-out;
  -webkit-animation-iteration-count: infinite; 
  opacity: 0.5;
}
@-webkit-keyframes pulsate {
  0% { 
    opacity: 0.6;
  }
  50% { 
    opacity: 1.0;
  }
  100% { 
    opacity: 0.6;
  }
}

</style>