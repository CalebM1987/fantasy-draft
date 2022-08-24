<script lang="ts" setup>
import { IPlayerDetails } from '../../types/players'

interface Props {
  details: IPlayerDetails;
}

const props = defineProps<Props>()

</script>

<template>
  <q-card>
    <q-card-section>
      <div class="text-h5">{{ details.full_name }}<span class="q-ml-lg">#{{ details.jersey_number }}</span></div>
      <div class="text-subtitle2">{{ details.position}} for {{ details.team }}</div>
    </q-card-section>

    <q-card-section>
      <div class="row">
        <div class="col-md-6">height: {{ details.height }}</div>
        <div class="col-md-6">weight: {{ details.weight }}</div>
        <div class="col-md-6">age: {{ details.age }}</div>
        <div class="col-md-6">college: {{ details.college }}</div>
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
</template>