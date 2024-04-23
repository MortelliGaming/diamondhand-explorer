<template>
  <v-container class="fill-height">
    <v-responsive class="align-center text-center fill-height">

      <v-img class="rotate" height="75" src="@/assets/logo.png" />
      <h1 class="text-h4 font-weight-bold pt-3">Loading</h1>

      <div class="py-14" ></div>
    </v-responsive>
  </v-container>
</template>

<script setup lang="ts">
</script>
<style lang="scss" scoped>
.rotate {
  animation: bounce 1.5s infinite linear;
}

@-moz-keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    -moz-transform: translateY(0);
  }
  40% {
    -moz-transform: translateY(-20px);
  }
  60% {
    -moz-transform: translateY(-10px);
  }
}
@-o-keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    -o-transform: translateY(0);
  }
  40% {
    -o-transform: translateY(-20px);
  }
  60% {
    -o-transform: translateY(-10px);
  }
}
@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-20px);
  }
  60% {
    transform: translateY(-10px);
  }
}
</style>