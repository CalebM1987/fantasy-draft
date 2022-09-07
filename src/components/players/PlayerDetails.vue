<script lang="ts" setup>
import { computed } from 'vue'
import { IPlayer, IPlayerDetails } from '../../types'
import { useDialogPluginComponent } from 'quasar'
import { getHeadshot, localeDateTime } from '../../utils'

interface Props {
  details: IPlayerDetails;
  player: IPlayer;
}

const props = defineProps<Props>()

const outlook = computed<string | undefined>(()=> {
  let outlook: string | undefined;
  const weeks = Object.keys(props.player.outlooks?.outlooksByWeek ?? {})
    .map(p => typeof p === 'string' ? parseInt(p): p)
  if (weeks.length){
    const current = Math.max(...weeks)
    outlook = props.player.outlooks?.outlooksByWeek[current]
  }
  return outlook ?? props.player.seasonOutlook 
})

const feed = computed(()=> props.details.feed.filter(f => f.type === 'Rotowire'))

defineEmits([
  ...useDialogPluginComponent.emits
])

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent()

</script>

<template>
  
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-pa-md">
      <q-item>
        <q-item-section avatar color="grey-5">
          <q-avatar>
            <img :src="getHeadshot(player)" style="background: white;">
          </q-avatar>
        </q-item-section>

        <q-item-section>
          <q-item-label>{{ player.fullName}}</q-item-label>
          <q-item-label caption>
            {{ player.team }} {{ player.position }}
          </q-item-label>
        </q-item-section>

        <q-item-section side top>
          <q-btn icon="close" flat round dense v-close-popup />
        </q-item-section>
      </q-item>
      <q-separator />
  
      <q-card-section>
        <div class="player-outlook" v-if="outlook">
          <div class="text-h6">Outlook</div>
          <p>{{ outlook }}</p>
        </div>
      </q-card-section>
      <q-separator />
  
      <q-card-section v-if="feed.length">
        <div class="text-h6">Player Feed</div>
        <q-separator />
        <q-list bordered separator class="player-feed">
          <q-item v-for="news in feed" class="q-my-sm bg-gray-3">
            <q-item-section>
              <q-item-label caption>
                last updated: {{ localeDateTime(news.lastModified) }}
              </q-item-label>
              <q-item-label>{{ news.headline }}</q-item-label>
              <q-separator class ="q-my-sm" />
              <q-item-label caption><p>{{ news.story }}</p></q-item-label>
           </q-item-section>
          </q-item>
        </q-list>
  
      </q-card-section>
  
    </q-card>
  </q-dialog>
</template>

<style>
  .player-feed {
    height: 40vh; 
    max-height: 550px;
    overflow-y: auto;
  }
</style>