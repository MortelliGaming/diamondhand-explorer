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
  <v-dialog max-width="340" v-model="dialog">
    <template v-slot:default>
      <v-card
        prepend-icon="mdi-package"
        :text="dialogText"
        :title="dialogTitle"
      >
        <v-card-text>
          <v-responsive>
            <v-row no-gutters>
              <v-col
                role="button"
                v-for="chain of availableChains" :key="chain.name"
                @click="confirmChain(chain.name)">
                <v-avatar>
                  <v-img 
                    v-if="chain.keplr"
                    :src="chain.keplr.chainSymbolImageUrl" />
                </v-avatar>
                {{ chain.name }}
              </v-col>
            </v-row>
          </v-responsive>
        </v-card-text>
        <template v-slot:actions>
          <v-btn
            class="ml-auto"
            text="Close"
            @click="closeDialog"
          ></v-btn>
        </template>
      </v-card>
    </template>
  </v-dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useBlockchainStore } from '@/store/blockchain'
import { useValidatorsStore } from '@/store/validators'
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';

const { availableChains } = storeToRefs(useBlockchainStore())
const { getValidatorInfo } = useValidatorsStore()
const { validators } = storeToRefs(useValidatorsStore())
const router = useRouter()

const dialog = ref(false)
const dialogTitle = ref('')
const dialogText = ref('')
const searchText = ref('')
const selectedChain = ref('')

function closeDialog() {
  dialog.value = false
  dialogTitle.value = ''
  dialogText.value = ''
}

function confirmChain(chainName: string) {
  selectedChain.value = chainName;
  closeDialog();
  checkSearchStringAndNavigate();
}

function getChainConfigByAddressPrefix(prefix: string) {
  return availableChains.value
    .filter(c => c.keplr) 
    .find(c => Object.values(c.keplr!.bech32Config).includes(prefix))
}

function checkSearchStringAndNavigate() {
  if(searchText.value == '') {
    return;
  }
  // checko if it starts with 0x
  if(searchText.value.startsWith('0x')) {
    if(searchText.value.length == 66) {
      if(!selectedChain.value) {
        dialog.value = true;
        dialogTitle.value = 'search.selectChain'
        dialogText.value = 'search.evmTx'
      } else {
        router.push(`/${selectedChain.value}/transaction/${searchText.value}`)
        searchText.value = '';
        selectedChain.value = '';
      }
      // evm tx hash
      console.log(`navigate to evm tx ${searchText.value}`)
    } else if(searchText.value.length == 42) {
      if(!selectedChain.value) {
        dialog.value = true;
        dialogTitle.value = 'search.selectChain'
        dialogText.value = 'search.evmAccount'
      } else {
        router.push(`/${selectedChain.value}/account/${searchText.value}`)
        searchText.value = '';
        selectedChain.value = '';
      }
      // evm address
      console.log(`navigate to evm account ${searchText.value}`)
    }
    // either a eth tx hash or an eth account/smartcontract address
  } else if(isNaN(Number(searchText.value))) {
    if(searchText.value.length == 64) {
      if(!selectedChain.value) {
        dialog.value = true;
        dialogTitle.value = 'search.selectChain'
        dialogText.value = 'search.cosmosTx'
      } else {
        router.push(`/${selectedChain.value}/transaction/${searchText.value}`)
        searchText.value = '';
        selectedChain.value = '';
      }
      // its probably a cosmos tx hash
      console.log(`navigate to tx ${searchText.value}`)
    }
    else if(searchText.value.includes('valoper')) {
      const chain = getChainConfigByAddressPrefix(searchText.value.split('1')[0])
      if(chain) {
        router.push(`/${chain.name}/validator/${searchText.value}`)
        searchText.value = '';
        selectedChain.value = '';
      }
    }
    else if(searchText.value.includes('valcons')) {
      const chain = getChainConfigByAddressPrefix(searchText.value.split('1')[0])
      // valcons -> get valoper and navigateconst chain = getChainConfigByAddressPrefix(searchText.value.split('1')[0])
      if(chain) {
        const validator = validators.value[chain.name]?.find(v => getValidatorInfo(chain.name, v).consensusAddress == searchText.value)
        if(validator) {
          const operatorAddress = getValidatorInfo(chain.name, validator).operatorAddress
          router.push(`/${chain.name}/validator/${operatorAddress}`)
          searchText.value = '';
          selectedChain.value = '';
        }
      }
    }
    else {
      // bech32 address -> navigate
      const chain = getChainConfigByAddressPrefix(searchText.value.split('1')[0])
      if(chain) {
        router.push(`/${chain.name}/account/${searchText.value}`)
        searchText.value = '';
        selectedChain.value = '';
      }
    }
  } else {
    if(!selectedChain.value) {
      dialog.value = true;
      dialogTitle.value = 'search.selectChain'
      dialogText.value = 'search.block'
    } else {
      router.push(`/${selectedChain.value}/block/${searchText.value}`)
      searchText.value = '';
      selectedChain.value = '';
    }
    // if its an int, its a block
    console.log(`navigate to block ${searchText.value}`)
  }
}
</script>
