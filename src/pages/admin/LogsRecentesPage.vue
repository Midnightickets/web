<template>
  <q-page class="text-white bg-grey-4 q-pb-xl">
    <div id="title" class="q-pt-sm w100 text-primary text-center">
      Logs Recentes
    </div>
    <div id="logs" v-if="logs.length > 0" class="w100 q-px-md q-mt-md rounded-borders">
        <q-list  class="row justify-center items-center q-gutter-md rounded-borders">
            <div id="title-layout" class="w100 justify-center items-center text-secondary rounded-borders">
                {{ logs.length }} logs encontrado(s)
            </div>
            <q-card style="border-left: 6px solid #1D1D1D;" v-for="(log, index) in logs" :key="index" class="bg-grey-4 rounded-borders text-bold">
                <q-card-section>
                    <q-item-label id="title-2" class="text-dark">
                        {{ index + 1 }}. {{ log.type }}
                    </q-item-label>
                </q-card-section>
                <q-card-section v-if="log.sake_status" class="w100 bg-dark" :class="log.sake_status.includes('Aguardando') ? 'text-orange-12' : 'text-green-12'">
                    {{ log.sake_status.includes('Aguardando') ? '🟡 ' + log.sake_status : '🟢 ' + log.sake_status }}
                </q-card-section>
                <q-card-section v-if="log.host" class="w100 bg-grey-14">
                    [host] {{ log.host }}
                </q-card-section>
                <q-card-section v-if="log.event" class="w100 bg-grey-14">
                    [evento] {{ log.event }}
                </q-card-section>
                <q-card-section v-if="log.payment" class="w100 bg-grey-14">
                    [pagamento] {{ log.payment }}
                </q-card-section>
                <q-card-section v-if="log.user" class="w100 bg-grey-14">
                    [usuário] {{ log.user }}
                </q-card-section>
                <q-card-section  class="w100 bg-dark text-right">
                     {{ log.created_at }}
                </q-card-section>
                <q-card-section class="w100">
                    <q-btn @click="showLogJson(log)" label="ver log" color="primary" glossy class="w100 q-py-md" icon-right="visibility"></q-btn>
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

async function showLogJson(log) {
    const admin = JSON.parse(sessionStorage.getItem('admin'))
    await api.post('/admin/log', { id: log.id, admin: { login: admin.login, token: admin.token } }).then((response) => {
        const formattedJson = JSON.stringify(response.data, null, 2);
        $q.dialog({
            title: 'Log ' + log.type,
            color: 'secondary',
            message: `<pre style="font-family: monospace; white-space: pre-wrap; text-align: left;">${formattedJson}</pre>`,
            html: true,
            ok: 'Fechar',
        })
    }).catch((error) => {
        $q.notify({
            color: 'orange-14',
            message: error.response.data.message,
            position: 'top',
            timeout: 2500,
        })
    })
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