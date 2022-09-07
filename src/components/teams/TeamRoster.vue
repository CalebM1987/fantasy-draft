<script lang="ts" setup>
import { ILeagueMember } from '../../types/app';
import { IPlayer, RosterSpot } from '../../types';
import { usePlayerStore, useAppStore } from '../../store'
import { ref, computed, watchEffect } from 'vue'

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
    <q-card-section style="width: max-content;">
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

          <q-item-section>
            <q-item-label :class="spot.player ? 'sec player': 'empty-slot'">{{ spot.player?.fullName ?? 'EMPTY' }}</q-item-label>
            <q-item-label caption lines="1">
              <div class="sec info" :class="spot.player ? 'plate' : ''" style="display: flex; justify-content: space-between;">
                <span class="team">{{ spot.player?.team }} <span class="pos" :class="spot.player?.position">{{ spot.player?.position}} </span></span>
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
  width: 325px;
  height: 100%;
  & .section{
    height: 600px;
    background: #d0d0d0; 
    overflow: auto;
  }
}

.empty-slot {
  color: gray;
  font-style: italic;
  font-size: 0.8rem;
}

.sec{
  color: #4a4a4a;
  &.player{
    font-weight: bold;
  }
  &.info{
    padding: 1px 4px 0 2px;
    border-radius: 3px;
    &.plate{
      background: #efefef;
      padding: 2px 5px;
    }
    & .team{
      display: flex;
      color: #4a4a4a;
    }
    & .pos{
      margin: 0 0 0 2px;
      padding: 0px 3px;
      color: white;
      border-radius: 2px;
      &.RB{
        background-color: red;
      }
      &.WR{
        background-color: green;
      }
      &.TE{
        background-color: yellow;
      }
      &.QB{
        background-color: blue;
      }
      &.DEF{
        background-color: orange;
      }
      &.PK{
        background-color: purple;
      }
    }
      & .bye{
        margin: 0 0 0 1px;
        font-style: italic;
      }
  }
}

</style>