<template>
  <q-page class="bg-dark w100 animate__animated animate__fadeIn relative">
      <div class="steps w100  row justify-center bg-twitch q-py-sm">
          <div  id="step-1" :class=" step == 1 ?  'bg-grad-2 shadow-2' : 'bg-grey-14'"></div>
          <div  id="step-2" :class=" step == 2 ? 'bg-grad-2 shadow-2' : 'bg-grey-14'"></div>
      </div>
      <div class="step-wrapper">
          <CreateEventoStep1Component v-if="step == 1" @next="next"/>
          <CreateEventoStep2Component v-if="step == 2" @next="next" @prev="prev"/>
      </div>
  </q-page>
</template>
<script setup>
import CreateEventoStep1Component from 'src/components/CreateEventoStep1Component.vue'
import CreateEventoStep2Component from 'src/components/CreateEventoStep2Component.vue'
import { onBeforeMount, onBeforeUnmount, ref } from 'vue'

const step = ref(1)

function next(){
  step.value = step.value + 1
}

function prev(){
  step.value = step.value - 1
}

onBeforeMount(() => {
  sessionStorage.removeItem('eventoStep1')
  sessionStorage.removeItem('eventoStep2')
})

onBeforeUnmount(() => {
  sessionStorage.removeItem('eventoStep1')
  sessionStorage.removeItem('eventoStep2')
  sessionStorage.removeItem('pacote')
})

</script>
<style scoped>
.q-page {
  display: flex;
  flex-direction: column;

}
.steps{
  position: fixed;
  top: 50px;
  z-index: 9999;
}

#step-1, #step-2, #step-3 {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin: 10px;
}
.step-wrapper {
  margin-left: 260px;
  margin-right: 260px;
}

@media (max-width: 1100px) {
  .step-wrapper {
      margin-left: 0px;
      margin-right: 0px;
  }
}

</style>