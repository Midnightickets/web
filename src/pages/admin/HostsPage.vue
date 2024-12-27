<template>
<q-page class="text-white q-pb-xl">
    <div id="title" class="q-pt-sm w100 text-center">
        Produtores
    </div>
    <div id="hosts" v-if="hosts.length > 0" class="w100 q-px-md q-mt-md rounded-borders">
        <q-list  class="row justify-center items-center q-gutter-md">
            <div id="title-layout" class="w100 justify-center items-center text-secondary">
                {{ hosts.length }} produtores encontrado(s)
            </div>
            <q-card style="border-left: 6px solid #1D1D1D" v-for="(host, index) in hosts" :key="index" class="bg-grey-4 rounded-borders text-bold">
                <q-card-section>
                    <q-item-label id="title-2" class="text-dark">
                        {{index + 1}}. {{ host.login }}
                    </q-item-label>
                </q-card-section>
                <q-card-section class="w100 bg-dark" :class="host.waitingSake ? 'text-orange-12' : 'text-green-12'">
                    {{ host.waitingSake ? '🟡 Aguardando Saque' : '🟢 Saque Disponível' }}
                </q-card-section>
                <q-card-section v-if="host.name" class="w100 bg-grey-14">
                    {{ host.name }}
                </q-card-section>
                <q-card-section v-if="host.id" class="w100 bg-grey-14">
                    <q-icon @click="copy(host.id)" name="content_copy" size="sm" class="cursor-pointer q-pr-sm" color="white"></q-icon>{{ host.id }} [ID]
                </q-card-section>
                <q-card-section class="w100 bg-grey-14">
                    R$ {{ host.balance.toFixed(2) }}
                </q-card-section>
                <q-card-section  class="w100 bg-dark text-right">
                    {{ host.created_at }}
               </q-card-section>
                <q-card-section class="w100">
                    <q-btn  label="ver produtor" color="primary" glossy class="w100 q-py-md" icon-right="visibility"></q-btn>
                </q-card-section>
            </q-card>
        </q-list>
    </div>
</q-page>
</template>

<script setup>
import { useQuasar } from 'quasar';
import { api } from 'src/boot/axios';
import { onMounted, ref } from 'vue';

const $q = useQuasar()

const hosts = ref([])

onMounted(async () => {
    await buscarHosts()
})

const buscarHosts = async () => {
    const admin = JSON.parse(sessionStorage.getItem('admin'))
    let req = {
        admin: {
            token: admin.token,
            login: admin.login,
        },
        getter: 'hosts',
    }
    await api.post('/admin/getAllUsersOrHostsResumed', req).then((response) => {
        if(response.data.length === 0) {
            $q.notify({
                color: 'secondary',
                icon: 'info',
                message: 'Nenhum Produtor Encontrado',
                position: 'top',
                timeout: 2500,
            })
            return
        }
        hosts.value = response.data.reverse()
    }).catch((error) => {
        $q.notify({
            color: 'orange-14',
            message: error.response.data.message,
            position: 'top',
            timeout: 2500,
        })
    })
}

async function copy (hostId) {
    await navigator.clipboard.writeText(hostId)
    $q.notify({
        color: 'green-14',
        icon: 'content_copy',
        message: 'ID copiado para a área de transferência',
        position: 'bottom',
        timeout: 2500,
    })
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