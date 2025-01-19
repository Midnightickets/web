<template>
  <q-page class="animate__animated animate__fadeIn bg-grey-4 q-pb-xl">
      <div class="w100">
          <q-btn @click="Utils.goBack()" dense glossy flat icon="keyboard_return" label="voltar"
              color="primary">
          </q-btn>
      </div>
      <div class="q-pa-md">
          <div id="title" class="text-primary">Andamento do Evento</div>
          <div class="text-bold text-h6 text-blue-14 q-mb-lg">Checkins: {{ checkins.length }}</div>
              <div v-if="loading" class="row w100 q-pb-xl justify-center">
                  <q-spinner-ball color="secondary" size="lg" />
                  <q-spinner-ball color="secondary" size="lg" />
                  <q-spinner-ball color="secondary" size="lg" />
              </div>
          <div class="w100 row wrap items-center justify-center q-gutter-md" v-if="checkins.length > 0">
              <q-card v-for="checkin in checkins" :key="checkin.id" class="q-mb-md border-left-roxo">
                  <q-card-section>
                        <div class="text-primary text-bold text-h6">{{checkin.person_name}}</div>
                        <div class="text-grey-14 text-h6">{{checkin.person_cpf}}</div>
                        <div class="text-grey-14 text-h6">{{checkin.createdAt}}</div>
                  </q-card-section>
              </q-card>
          </div>
          <div v-else class="w100">
              <div id="title-2" class="text-primary text-center text-bold q-mt-lg">Ainda não foi realizado nenhum checkin neste evento</div>
          </div>
      </div>
  </q-page>
</template>

<script setup>
import { useQuasar } from 'quasar';
import { api } from 'src/boot/axios';
import { Utils } from 'src/utils/Utils';
import { onBeforeMount, ref } from 'vue';

const evento_title = sessionStorage.getItem('evento_title')
const checkins = ref([])
const loading = ref(false)

const $q = useQuasar()

onBeforeMount( async () => {
    loading.value = true
    const host = JSON.parse(sessionStorage.getItem('host'))
    const evento_andamento = sessionStorage.getItem('evento_andamento')
    await api.post('/event/andamento_evento', {host:{token: host.token, id: host.id}, event_id: evento_andamento}).then(response => {
        checkins.value = response.data
    })
    .catch(error => {
        $q.notify({
            color: 'secondary',
            icon:'sensor_occupied', 
            position: 'top',
            message: error.response.data.error,
            timeout: 2500
        })
    })
    .finally(() =>
        loading.value = false
    )
})

</script>

<style scoped>
@media (min-width: 600px) {
  .q-card {
      width: 40%;
  }
  
}
</style>