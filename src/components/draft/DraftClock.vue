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
  <div class="draft-clock q-pa-md"
  :class="appState.screen.gt.md ? '' : 'r'"
  >
    <div class="timer-container" v-if="appState.hasStartedDraft">
      <div class="row items-start">
        <span 
          v-if="players.onTheClock"
          class="on-the-clock glow"
          :class="appState.screen.gt.md ? '' : 'r'"
        >{{ players.onTheClock.name }} is on the clock!</span>
        <div class="timer" :class="appState.screen.gt.md ? '' : 'r'">{{ displayClock(appState.timer) }}</div>
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
@import '../../base.scss';

.timer-container{
  justify-content: center;
}

.draft-clock{
  background: $accent-orange;
  padding: 2px;
  margin: 0 -12px 5px auto;
  border-radius: 0 0 0 3px;
  color: #7e2929;
  &.r{
    width: 100vw;
    margin-left: -12px;
  }
}

.timer {
  font-size: 2rem;
  &.r{
    font-size: 20px;
  }
}

.on-the-clock {
  font-size: 1.8rem;
  // color: #d9534f;
  color: #AB0003;
  text-shadow: 2px 2px 4px white;
  margin: .2rem .8rem;
  &.r{
    font-size: 18px !important;
  }
}

.clock-public-message {
  font-size: .9rem;
}

.glow {
  color: #fff;
  animation: glow 1.5s ease-in-out infinite alternate;
}

@-webkit-keyframes glow {
  from {
    text-shadow: 0 0 10px red, 0 0 15px #fff, 0 0 20px #fff;
  }
  to {
    text-shadow: 0 0 5px red, 0 0 15px red, 0 0 25px red;
  }
}

.pulsate {
  -webkit-animation: pulsate 1.5s ease-out;
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

// .q-toolbar__title.ellipsis{
//   display:none;
// }

</style>