<template>
  <v-row no-gutters>
    <v-col class="d-flex flex-row align-center pt-2 pb-2 pl-0 pr-0">
      <v-text-field
        v-model="searchText"
        append-inner-icon="mdi-magnify"
        density="compact"
        label=""
        variant="solo"
        hide-details
        single-line
        rounded
        elevation="12"
        @click:append-inner="checkSearchStringAndNavigate"
      ></v-text-field>
    </v-col>
  </v-row>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
const searchText = ref('')

function checkSearchStringAndNavigate() {
  // checko if it starts with 0x
  if(searchText.value.startsWith('0x')) {
    if(searchText.value.length == 66) {
      // evm tx hash
      console.log(`navigate to evm tx ${searchText.value}`)
    } else if(searchText.value.length == 42) {
      // evm address
      console.log(`navigate to evm account ${searchText.value}`)
    }
    // either a eth tx hash or an eth account/smartcontract address
  } else if(isNaN(Number(searchText.value))) {
    if(searchText.value.length == 64) {
      // its probably a cosmos tx hash
      console.log(`navigate to tx ${searchText.value}`)
    }
    else if(searchText.value.includes('valoper')) {
      // valoper
      console.log(`navigate to valoper ${searchText.value}`)
    }
    else if(searchText.value.includes('valcons')) {
      // valcons -> get valoper and navigate
      console.log(`navigate to valoper from cons ${searchText.value}`)
    }
    else {
      // bech32 address -> navigate
      console.log(`navigate to address ${searchText.value}`)
    }
  } else {
    // if its an int, its a block
    console.log(`navigate to block ${searchText.value}`)
  }
}
</script>
