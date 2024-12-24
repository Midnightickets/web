<template>
  <q-page class="text-white q-pb-xl">
    <div id="title" class="q-pt-sm w100 text-center">
      Logs Recentes
    </div>
    <div id="logs" v-if="logs.length > 0" class="w100 q-px-md q-mt-md rounded-borders">
        <q-list  class="row justify-center items-center q-gutter-md">
            <div id="title-layout" class="w100 justify-center items-center text-secondary">
                {{ logs.length }} logs encontrado(s)
            </div>
            <q-card style="border-left: 4px solid #9573f3;" v-for="log in logs" :key="log.id" class="bg-grey-4 rounded-borders text-bold">
                <q-card-section>
                    <q-item-label id="title-2" class="text-primary">
                        {{ log.type }}
                    </q-item-label>
                </q-card-section>
                <q-card-section v-if="log.host" class="w100 bg-grey-6">
                    [host] {{ log.host }}
                </q-card-section>
                <q-card-section v-if="log.event" class="w100 bg-grey-6">
                    [evento] {{ log.event }}
                </q-card-section>
                <q-card-section v-if="log.payment" class="w100 bg-grey-6">
                    [pagamento] {{ log.payment }}
                </q-card-section>
                <q-card-section v-if="log.user" class="w100 bg-grey-6">
                    [usuário] {{ log.user }}
                </q-card-section>
                <q-card-section v-if="log.sake_status" class="w100 bg-grey-6">
                    {{ log.sake_status.includes('Aguardando') ? '🟡 ' + log.sake_status : '🟢 ' + log.sake_status }}
                </q-card-section>
                <q-card-section  class="w100 bg-dark text-right">
                     {{ log.created_at }}
                </q-card-section>
                <q-card-section class="w100">
                    <q-btn  label="ver log" color="green-14" glossy class="w100" icon-right="visibility"></q-btn>
                </q-card-section>
            </q-card>
        </q-list>
    </div>
  </q-page>
</template>

<script setup>
import { useQuasar } from 'quasar';
import { api } from 'src/boot/axios';
import { onBeforeMount, onMounted, ref } from 'vue';

const $q = useQuasar()

const logs = ref([])

// const LogEnum = {
//     NEW_EVENT: 'Novo Evento Criado',
//     UPDATE_EVENT: 'Informações de Evento Atualizadas',
//     UPDATE_TICKET_TYPES: 'Ingressos Atualizados',
//     UPDATE_EVENT_CANCELED: 'Evento Cancelado',
//     UPDATE_EVENT_FINISHED: 'Evento Finalizado',
//     REQUEST_SAKE: 'Solicitação de Saque',
//     SAKE_STATUS_REQUESTED: 'Aguardando Saque',
//     HOST_CREATED: 'Novo Host Criado',
// }

const filter = ref({
    _id: '',
    payment: '',
    event: '',
    user: '',
    host: '',
    sake_status: null,
    type: null,
})

onMounted(async () => {
    await buscarLogs()
})

const buscarLogs = async () => {
    const admin = JSON.parse(sessionStorage.getItem('admin'))
    let req = {
        admin: {
            token: admin.token,
            login: admin.login,
        }
    }
    if(filter.value._id.trim() !== '') req._id = filter.value._id.trim()
    if(filter.value.payment.trim() !== '') req.payment = filter.value.payment.trim()
    if(filter.value.event.trim() !== '') req.event = filter.value.event.trim()
    if(filter.value.user.trim() !== '') req.user = filter.value.user.trim()
    if(filter.value.host.trim() !== '') req.host = filter.value.host.trim()
    if(filter.value.sake_status !== null) req.sake_status = filter.value.sake_status.label
    if(filter.value.type !== null) req.type = filter.value.type.label
    await api.post('/admin/logs', req).then((response) => {
        if(response.data.length === 0) {
            $q.notify({
                color: 'secondary',
                icon: 'info',
                message: 'Nenhum log encontrado',
                position: 'top',
                timeout: 2500,
            })
            return
        }
        logs.value = response.data.reverse()
    }).catch((error) => {
        $q.notify({
            color: 'orange-14',
            message: error.response.data.message,
            position: 'top',
            timeout: 2500,
        })
    })
}

function disableSearch() {
    return filter.value.payment.trim() === '' && filter.value.event.trim() === '' && filter.value.user.trim() === '' && filter.value.host.trim() === '' && filter.value.sake_status === null && filter.value.type === null && filter.value._id.trim() === ''
}

</script>

<style scoped>
.q-input, .q-select {
    width: 80vw;
}
@media (min-width: 800px) {
    .q-input {
        width: 24vw;
    }
    .q-select {
        width: 35vw;
    }
    .q-card {
        width: 30vw;
    }
}

</style>