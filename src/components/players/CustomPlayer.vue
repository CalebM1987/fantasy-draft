<script lang="ts" setup>
import { ref} from 'vue'
import { PlayerPosition, NFLTeams, FreeAgent, IPlayer, NFLTeamID } from '../../types'
import { usePlayerStore } from '../../store';
import { useDialogPluginComponent, QForm, useQuasar } from 'quasar'
import { log, validatePlayerName } from '../../utils';
import { nflTeamAbbreviationToId, positionToSlotIDMap } from '../../services/espn';

const playerState = usePlayerStore()

defineEmits([
  ...useDialogPluginComponent.emits
])

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent()

const playerForm = ref<QForm | null>(null)
const name = ref('')
const position = ref<PlayerPosition | undefined>(undefined)
const team = ref<(NFLTeams | FreeAgent)| undefined>(undefined)
const $q = useQuasar()
const errMessage = ref('')

// this will get set if attempting to create player already in top 200 list
const existingPlayer = ref<IPlayer | undefined>()

const resetPlayer = ()=> {
  name.value = ''
  team.value = undefined
  position.value = undefined
}

const createPlayer = (): IPlayer => {
  if (!name.value || !team.value || !position.value){
    errMessage.value = 'Missing information for player'
    $q.notify({
      type: 'negative',
      message: errMessage.value
    })
    throw Error(errMessage.value)
  }

  const proTeamId = parseInt(nflTeamAbbreviationToId[team.value]) as unknown as NFLTeamID
  const positionId = positionToSlotIDMap[position.value]
  const parts = name.value.split(' ')

  const player: IPlayer = {
    active: true,
    injured: false,
    injuryStatus: 'ACTIVE',
    invalid: false,
    id: -1,
    defaultPositionId: positionId,
    eligibleSlots: [positionId],
    fullName: name.value,
    firstName: parts[0],
    lastName: parts.slice(1).join(' '),
    position: position.value!,
    team: team.value,
    proTeamId,
    rank: playerState.players.length + 1,
    adp: 0,
    bye: playerState.byeWeeks[proTeamId],
    isCustom: true,
    ownership: {
      averageDraftPosition: 300,
      auctionValueAverage: 0,
      auctionValueAverageChange: 0,
      averageDraftPositionPercentChange: 0,
      percentOwned: 0.1,
      percentChange: 0, 
      percentStarted: 0.01
    }
  }
  playerState.players.push(player)
  log('Created custom player: ', player)
  return player
}

const validateCustomPlayer = (player: IPlayer)=> {
  if (!validatePlayerName(player.fullName)){
    errMessage.value = 'Invalid Player Name Format'
  }
  const isDrafted = playerState.draftPicks.find(p => p.fullName.toLowerCase() === name.value.toLowerCase() && p.team === player.team && p.position === player.position)
  if (isDrafted) {
    errMessage.value = 'Cannot draft a player who has already been drafted'
    resetPlayer()
    playerForm.value?.resetValidation()
    return false
  }
  const isAlreadyInList = playerState.players.find(p => 
    p.fullName.toLowerCase() === name.value.toLowerCase() 
    && p.team === player.team 
    && p.position === player.position
  )
  if (isAlreadyInList){
    // this is not really an error, just grab the player from the list
    existingPlayer.value = isAlreadyInList
    log('Tried to create a custom player who was already in top 200: ', existingPlayer.value)
    $q.notify({
      type: 'warning',
      message: `Attempted to create a custom player who is already in the Available Players list: "${existingPlayer.value.fullName}"`
    })
  }
  return true
}

const submitNewPlayer = async ()=> {
  if (!playerForm.value){
    return
  }
  const isValid = await playerForm.value!.validate()
  if (isValid){
    const player = createPlayer()
    if (validateCustomPlayer(player)){
      onDialogOK(existingPlayer.value ?? player)
    } else {
      $q.notify({
        type: 'negative',
        message: errMessage.value
      })
    }
  }
}

</script>

<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card style="width: 350px;">
      <q-card-section class="row items-center q-pb-sm">
        <div class="text-h6">Draft Custom Player</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-separator />

      <q-card-section>
        <div class="q-pa-md">

          <q-form ref="playerForm" greedy>
            <q-input 
              autofocus
              v-model="name"
              label="Player Name"
              debounce="350"
              lazy-rules
              :rules="[ val => validatePlayerName(val)]"
              error-message="please enter a first and last name"
            />
            <q-select 
              required
              v-model="team"
              label="NFL Team"
              lazy-rules
              :error="!team"
              :rules="[ val => val && val.length ]"
              :options="playerState.nflTeams"
            />
      
            <q-select 
              required
              v-model="position"
              label="Position"
              lazy-rules
              :error="!position"
              :rules="[ val => val && val.length ]"
              :options="playerState.positions.filter(p => p !== 'D/ST')"
            />
      
          </q-form>
        </div>
      </q-card-section>

      <q-separator />

      <q-card-actions>
        <q-btn flat @click="submitNewPlayer">Draft Player</q-btn>
        <q-btn flat color="negative" v-close-popup>Cancel</q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>