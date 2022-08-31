<script lang="ts" setup>
import { ref } from 'vue'
import { PlayerPosition, NFLTeams, FreeAgent, IPlayer } from '../../types/players'
import { usePlayerStore } from '../../store';

const { nflTeams, positions, players: allPlayers } = usePlayerStore()

const name = ref('')
const position = ref<PlayerPosition | undefined>(undefined)
const team = ref<(NFLTeams | FreeAgent)| undefined>(undefined)

const createPlayer = (): IPlayer => {
  if (!name.value || !team.value || !position.value){
    throw Error('Missing information for player')
  }
  const teammate = allPlayers.find(p => p.team === team.value)
  const player: IPlayer = {
    player_id: new Date().getTime(),
    name: name.value,
    position: position.value!,
    team: team.value!,
    rank: allPlayers.length,
    adp: allPlayers.length,
    times_drafted: 1,
    bye: teammate!.bye
  }
  return player
}

</script>

<template>
  <q-card style="width: 350px;">
    <q-card-section class="row items-center q-pb-sm">
      <div class="text-h6">Draft Custom Player</div>
      <q-space />
      <q-btn icon="close" flat round dense v-close-popup />
    </q-card-section>

    <q-separator />

    <q-card-section>
      <div class="q-pa-md">

        <q-form>
          <q-input 
            v-model="name"
            label="Player Name"
            debounce="350"
          />
          <q-select 
            v-model="team"
            label="NFL Team"
            :options="nflTeams"
          />
    
          <q-select 
            v-model="position"
            label="Position"
            :options="positions"
          />
    
        </q-form>
      </div>
    </q-card-section>

    <q-separator />

      <q-card-actions>
        <q-btn flat>Draft Player</q-btn>
        <q-btn flat color="negative" v-close-popup>Cancel</q-btn>
      </q-card-actions>

  </q-card>
</template>