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

const media = computed(()=> props.details.feed.filter(f => f.type === 'Media' && f.section === 'Fantasy NFL')[0])
const feed = computed(()=> props.details.feed.filter(f => f.type === 'Rotowire'))

const openMediaLink = ()=> {
  const im = media.value
  if (im){
    window.open(im.links.web.href, '_blank')
  }
}

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
          <q-avatar style="height: 55px; width: 55px;">
            <img :src="getHeadshot(player)" style="background: white;">
          </q-avatar>
        </q-item-section>

        <q-item-section>
          <q-item-label style="font-size: 25px;">{{ player.fullName}}</q-item-label>
          <q-item-label caption style="font-size: 18px;">
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
          <div class="outlook-body">
            <p>{{ outlook }}</p>
          </div>
        </div>
      </q-card-section>
      <q-separator />
  
      <q-card-section v-if="media" class="cursor-pointer">
        <div class="text-h6">Fantasy News</div>
        <q-separator />
        <div 
          v-if="media.images.length"
          class="fantasy-media-link" 
          @click="openMediaLink"
        >
          <q-img 
            :src="media.images[0].url"
            
          />
            <div class="text-subtitle2 q-my-sm">
              <q-icon name="info_outline" class="q-mr-sm"/>  
              {{ media.images[0].name }}
            </div>
            <p class="text-caption link">{{ media.description }}</p>
              
        </div>
        <q-separator />
      </q-card-section>

      <q-card-section v-if="feed.length">
        <div class="text-h6 feed-header">Player Feed</div>
        <q-separator />
        <q-list bordered separator class="player-feed">
          <q-item v-for="news in feed" class="q-my-sm bg-gray-3">
            <q-item-section>
              <q-item-label class="update" caption>
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

<style lang="scss">
  @import '../../base.scss';
  .player-outlook > :first-child::after, .feed-header::after{
    content: "";
        height: 1px;
        width: 100%;
        position: relative;
        background: rgb(134, 134, 134);
        display: block;
        transition: width 0.3s ease-in-out;
        bottom: 4px;
        left: -2px;
  }

  .player-outlook .outlook-body{
    background: $white;
    color: black;
    padding: 2px 5px 0px 5px;
    border-radius: 2px;
  }

  .player-feed {
    height: 40vh; 
    // max-height: 550px;
    overflow-y: auto;
    background: $white;
    color: black !important;
    border-radius: 2px;
    & .update{
      color: black;
      font-style: italic;
    }
    & > *, p, div {
      color: black;
    }
  }

  .text-caption.link{
    background: $white;
    color: black !important;
    padding: 2px;
    border-radius: 2px;
  } 
</style>