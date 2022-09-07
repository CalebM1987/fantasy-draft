<script lang="ts" setup>
import { reactive } from 'vue'
import { validatePlayerName } from '../../../utils'

const member = reactive({
  name: '',
  teamName: ''
})

</script>

<template>
  <div class="league-member-info">
    <q-form>
      <q-input 
        label="name"
        v-model="member.name"
        lazy-rules
        :rules="[ val => validatePlayerName(val)]"
        error-message="please enter a first and last name"
     />

      <q-input 
        label="name"
        class="q-py-lg"
        v-model="member.teamName"
        lazy-rules
        :rules="[ val => val && val.length >= 3]"
        error-message="enter a name of at least 3 characters"
     />
    </q-form>

  </div>
</template>