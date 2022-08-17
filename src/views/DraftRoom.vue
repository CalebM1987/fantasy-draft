<script lang="ts" setup>
import { defineAsyncComponent } from 'vue'

const DraftBoard = defineAsyncComponent(()=> import('../components/draft/DraftBoard.vue'))
</script>

<template>
  <Suspense>
    <draft-board />
    <template #fallback>
      <div class="q-pa-xl mx-auto">
        <q-spinner-facebook
          color="primary"
          size="2em"
        />
        <p>loading...</p>
      </div>
    </template>
  </Suspense>
</template>