<script lang="ts" setup>
import { ILeagueMember } from '../../types/app';
import { IPlayer, RosterSpot } from '../../types';
import { usePlayerStore, useAppStore } from '../../store'
import { getPlayerStatus } from '../../utils'
import { computed } from 'vue'

const appState = useAppStore()
const playerState = usePlayerStore()

interface Props {
  leagueMember: ILeagueMember;
}
const props = defineProps<Props>()

const roster = computed<IPlayer[]>(()=> 
  playerState.draftPicks
    .filter(p => p.owner?.name === props.leagueMember.name)
)

const flexSpots = ['RB', 'WR', 'TE']

const benchCount = computed<number>(()=> 
  appState.league 
    ? appState.rosterSize - (appState.league?.roster?.positions ?? []).length
    : 0
)

const abbreviateSpot = (spot: RosterSpot): string => {
  return spot === 'BENCH'
    ? 'BE'
    : spot === 'FLEX' 
      ? 'FLX'
      : spot
}

interface IRosterSlot {
  player?: IPlayer;
  type: RosterSpot;
}

const positions: RosterSpot[] = [
  ...(appState.league?.roster?.positions ?? []), 
  ...Array(benchCount.value).fill('BENCH')
]

const rosterSpots = computed<IRosterSlot[]>(()=> {
  const spots: IRosterSlot[] = positions.map(pos => { return { type: pos, player: undefined }})
  roster.value.forEach(p => {
    // console.log('player in iteration: ', p)
    for (const s of spots){
      // console.log('checking spot: ', s)
      if (s.type === p.position && !s.player){
        // console.log('found player matching position: ', s.type, p)
        s.player = p
        break;
      }
      else if (s.type === 'FLEX' && flexSpots.includes(p.position) && !s.player){
        // console.log('attempting to fill flex spot', p, s)
        s.player = p
        break;
      } else {
        // put on bench
        if (s.type === 'BENCH' && !s.player){
          // console.log('adding player to bench: ', p, s)
          s.player = p
          break;
        }
      }
    }
  })
  return spots
})
  
</script>

<template>
  <q-card bordered class="bg-grey-9 roster-card q-ma-md">
    <q-card-section style="width: 325px;">
      <div class="text-h6">{{ leagueMember.teamName }}</div>
      <div class="text-subtitle2">{{ leagueMember.name }}</div>
    </q-card-section>

    <q-separator dark inset />

    <q-card-section class="section">
      <q-list separator>
        <q-item v-for="spot in rosterSpots">
          <q-item-section avatar>
            <q-avatar color="primary">{{ abbreviateSpot(spot.type) }}</q-avatar>
          </q-item-section>

          <q-item-section :class="spot.player?.fullName ? 'slot plate' : ''">
            <q-item-label :class="spot.player ? 'player name': 'empty-slot'">
              <span class="line">{{ spot.player?.fullName ?? 'EMPTY' }}</span>
              <q-badge
                v-if="spot.player && spot.player?.injuryStatus !== 'ACTIVE'"
                rounded
                class="q-ml-sm"
                color="negative"
              >{{ getPlayerStatus(spot.player) }}</q-badge>
            </q-item-label>
            <q-item-label caption lines="1">
              <div class="player info" :class="spot.player ? 'plate' : ''" style="display: flex; justify-content: space-between;">
                <span class="pos ros" :class="`${spot.player?.position === 'D/ST' ? 'DEF': spot.player?.position}`">{{ spot.player?.position}} </span>
                <span class="team">{{ spot.player?.team }}</span>
                <span class="bye" v-if="spot.player">Bye: {{ spot.player?.bye }}</span>
              </div>
            </q-item-label>
              
          </q-item-section>
        </q-item>
      </q-list>
      
    </q-card-section>
  </q-card>

</template>

<style lang="scss">
.roster-card {
  width: 325px; // doesn't seem to take here
  height: 100%;
  & .section{
    height: calc(100vh - 265px);
    background: #d0d0d0; 
    overflow: auto;
    & .slot.plate{
      background: #fafafa;
      padding: 2px;
      border-radius: 3px;
    }
  }
}

.empty-slot {
  color: gray;
  font-style: italic;
  font-size: 0.8rem;
}

.player{
  color: #4a4a4a;
  &.name{
    font-weight: bold;
    & .line{
     &::after{
        content: "";
        height: 1px;
        width: 75%;
        position: relative;
        background: rgb(134, 134, 134);
        display: block;
        transition: width 0.3s ease-in-out;
        top: 0;
        left: -2px;
      }
    }
  }
  &.info{
    padding: 1px 4px 0 2px;
    border-radius: 3px;
    &.plate{
      padding: 2px 5px;
    }
    & .team{
      display: flex;
      color: #4a4a4a;
      margin: auto;
    }
    & .bye{
      margin: 0 0 0 1px;
      font-style: italic;
    }
  }
}

</style>