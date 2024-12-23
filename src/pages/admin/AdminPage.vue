<template>
  <q-page class="text-white q-pb-xl">
    <div id="title" class="q-pt-sm w100 text-center">
        Buscar Logs
    </div>
    <div style="border-left: 4px solid #9573f3;" class="shadow-2 bg-grey-4 row q-gutter-x-md q-gutter-y-md q-mx-md rounded-borders justify-start items-center q-pa-md q-mt-md">
    <q-select
        class="w100"
        v-model="filter.type"
        label="Tipo"
        outlined
        :options="typeOptions"
    >
        <template v-slot:prepend>
            <q-icon name="settings" :color="filter.type != null ? 'primary' : 'grey'"/>
        </template>
        <template v-slot:append>
            <q-btn icon="close" flat color="grey-14" @click="filter.type = null"></q-btn>
        </template>
    </q-select>
        <q-select
        class="w100"
        v-model="filter.sake_status"
        label="Status de Saque"
        outlined
        :options="sakeStatusOptions"
    >
        <template v-slot:prepend>
            <q-icon name="toggle_on" :color="filter.sake_status != null ? 'primary' : 'grey'"/>
        </template>
        <template v-slot:append>
            <q-btn icon="close" flat color="grey-14" @click="filter.sake_status = null"></q-btn>
        </template>
    </q-select>
        <q-input label="Log ID" maxlength="100" outlined v-model="filter._id">
            <template v-slot:prepend>
                <q-icon @click="colar('log')" name="description" :color="filter._id.trim() !== '' ? 'primary' : 'grey'"/>
            </template>
            <template v-slot:append>
                <q-btn icon="close" flat color="grey-14" @click="filter._id = ''"></q-btn>
            </template>
        </q-input>
        <q-input label="Host ID" maxlength="100" outlined v-model="filter.host">
            <template v-slot:prepend>
                <q-icon @click="colar('host')" name="diamond" :color="filter.host.trim() !== '' ? 'primary' : 'grey'"/>
            </template>
            <template v-slot:append>
                <q-btn icon="close" flat color="grey-14" @click="filter.host = ''"></q-btn>
            </template>
        </q-input>
        <q-input label="User ID" maxlength="100" outlined v-model="filter.user">
            <template v-slot:prepend>
                <q-icon @click="colar('user')" name="person" :color="filter.user.trim() !== '' ? 'primary' : 'grey'"/>
            </template>
            <template v-slot:append>
                <q-btn icon="close" flat color="grey-14" @click="filter.user = ''"></q-btn>
            </template>
        </q-input>
        <q-input label="Event ID" maxlength="100" outlined v-model="filter.event">
            <template v-slot:prepend>
                <q-icon @click="colar('event')" name="event" :color="filter.event.trim() !== '' ? 'primary' : 'grey'"/>
            </template>
            <template v-slot:append>
                <q-btn icon="close" flat color="grey-14" @click="filter.event = ''"></q-btn>
            </template>
        </q-input>
        <q-input label="Payment ID" maxlength="100" outlined v-model="filter.payment">
            <template v-slot:prepend>
                <q-icon @click="colar('payment')" name="payments" :color="filter.payment.trim() !== '' ? 'primary' : 'grey'"/>
            </template>
            <template v-slot:append>
                <q-btn icon="close" flat color="grey-14" @click="filter.payment = null"></q-btn>
            </template>
        </q-input>
        <div class="q-mb-md w100 row justify-end items-center">
            <q-btn @click="buscarLogs()" :disabled="disableSearch()" class="w80 q-py-md" icon-right="search" label="Buscar logs" color="primary" glossy></q-btn>
        </div>
    </div>
    <div id="logs" v-if="logs.length > 0" class="w100 q-px-md q-mt-md rounded-borders">
        <q-list  class="row justify-center items-center q-gutter-md">
            <div id="title-layout" class="w100 justify-center items-center">
                {{ logs.length }} logs encontrado(s)
            </div>
            <q-card style="border-left: 4px solid #9573f3;" v-for="log in logs" :key="log._id" class="bg-grey-4 rounded-borders text-bold">
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
                <q-card-section  class="w100 bg-dark text-right">
                     {{ log.created_at }}
                </q-card-section>
                <q-card-section class="w100">
                    <q-btn  label="ver log" color="primary" class="w100" icon-right="visibility"></q-btn>
                </q-card-section>
            </q-card>
        </q-list>
    </div>
  </q-page>
</template>

<script setup>
import { useQuasar } from 'quasar';
import { api } from 'src/boot/axios';
import { onBeforeMount, ref } from 'vue';

const $q = useQuasar()

const typeOptions = [
    {value: 1, label: 'Novo Evento Criado', index_enum: 'NEW_EVENT'},
    {value: 2, label: 'Informações de Evento Atualizadas', index_enum: 'UPDATE_EVENT'},
    {value: 3, label: 'Ingressos Atualizados', index_enum: 'UPDATE_TICKET_TYPES'},
    {value: 4, label: 'Evento Cancelado', index_enum: 'UPDATE_EVENT_CANCELED'},
    {value: 5, label: 'Solicitação de Saque', index_enum: 'REQUEST_SAKE'},
    {value: 6, label: 'Evento Finalizado', index_enum: 'UPDATE_EVENT_FINISHED'},
    {value: 8, label: 'Novo Host Criado', index_enum: 'HOST_CREATED'},
]

const sakeStatusOptions = [
    {value: 1, label: 'Aguardando Saque', index_enum: 'SAKE_STATUS_REQUESTED'},
    {value: 2, label: 'Saque Realizado', index_enum: 'SAKE_STATUS_DONE'},
]

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

async function colar(params) {
    try {
        const text = await navigator.clipboard.readText();
        switch(params) {
            case 'log':
                filter.value._id = text
                break
            case 'user':
                filter.value.user = text
                break
            case 'host':
                filter.value.host = text
                break
            case 'event':
                filter.value.event = text
                break
            case 'payment':
                filter.value.payment = text
                break
        }
    } catch (err) {
        $q.notify({
            color: 'secondary',
            message: 'Erro ao colar',
            position: 'top',
            timeout: 500,
        })
    }
}

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
        logs.value = response.data
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
}

</style>