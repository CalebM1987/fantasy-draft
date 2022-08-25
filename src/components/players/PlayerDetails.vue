<script lang="ts" setup>
import { computed } from 'vue'
import { IPlayerDetails } from '../../types/players'

interface Props {
  details: IPlayerDetails;
}

const props = defineProps<Props>()

const generalAttrs = computed(()=> 
  ['height', 'weight', 'age', 'college']
  .filter(a => !!props.details[a as keyof IPlayerDetails])
)

</script>

<template>
  <q-card class="q-pa-md">
    <q-card-section>
      <div class="text-h6" style="display: flex; justify-content: space-between;">
        <div>{{ details.full_name }}</div>
        <div v-if="details.jersey_number">#{{ details.jersey_number }}</div>
        <div>{{ details.position}}</div>
        <div>{{ details.team }}</div>
      </div>
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
</template>