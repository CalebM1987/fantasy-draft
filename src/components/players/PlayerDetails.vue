<script lang="ts" setup>
import { computed } from 'vue'
import { IPlayerDetails } from '../../types'
import { useDialogPluginComponent } from 'quasar'

interface Props {
  details: IPlayerDetails;
}

const props = defineProps<Props>()

const generalAttrs = computed(()=> 
  ['height', 'weight', 'age', 'college']
  .filter(a => !!props.details[a as keyof IPlayerDetails])
)

defineEmits([
  ...useDialogPluginComponent.emits
])

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent()

</script>

<template>
  
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-pa-md">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">{{ details.full_name }}</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>
      <q-card-section class="q-py-none">
        <div class="text-subtitle2">{{ details.team }} {{ details.position }}</div>
      </q-card-section>
      <q-separator />
  
      <q-card-section>
        <div class="row" v-if="generalAttrs.length">
          <div 
            class="col-md-6" 
            v-for="attr in generalAttrs"
            :key="attr"
          >{{ attr}}: {{ details[attr as keyof IPlayerDetails] }}</div>
        </div>
      </q-card-section>
  
      <q-card-section v-if="details.news?.length ?? 0">
        <div class="text-h6">Player News</div>
        <q-separator />
        <q-list>
          <q-item v-for="news in details.news ?? []">
            <q-item-section>
              <q-item-label>
                <div class="text-h6"><strong>{{ news.title }}</strong></div>
              </q-item-label>
              <q-item-label caption><i>last updated: {{ news.updated_at }}</i></q-item-label>
              <q-item-label><p>{{ news.content }}</p></q-item-label>
           </q-item-section>
          </q-item>
        </q-list>
  
      </q-card-section>
  
    </q-card>
  </q-dialog>
</template>