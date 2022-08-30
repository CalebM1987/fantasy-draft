<script lang="ts" setup>
import { ILeagueMember } from '../../types/app';
import { IDraftedPlayer, RosterSpot } from '../../types/players';
import { usePlayerStore, useAppStore } from '../../store'
import { ref, computed, watchEffect } from 'vue'

const appState = useAppStore()
const playerState = usePlayerStore()

interface Props {
  leagueMember: ILeagueMember;
}
const props = defineProps<Props>()

const roster = computed<IDraftedPlayer[]>(()=> 
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
  player?: IDraftedPlayer;
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
    <q-card-section>
      <div class="text-h6">{{ leagueMember.teamName }}</div>
      <div class="text-subtitle2">leagueMember.name</div>
    </q-card-section>

    <q-separator dark inset />

    <q-card-section>
      <q-list separator>
        <q-item v-for="spot in rosterSpots">
          <q-item-section avatar>
            <q-avatar color="primary">{{ abbreviateSpot(spot.type) }}</q-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label :class="spot.player ? '': 'empty-slot'">{{ spot.player?.name ?? 'EMPTY' }}</q-item-label>
            <q-item-label caption lines="1">{{ spot.player?.team }} {{ spot.player?.position}}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
      
    </q-card-section>
  </q-card>

</template>

<style>
.roster-card {
  width: 325px;
}

.empty-slot {
  color: gray;
  font-style: italic;
  font-size: 0.8rem;
}
</style>