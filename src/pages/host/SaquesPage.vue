<template>
<q-page  class=" w100 animate__animated animate__fadeIn bg-grey-4 relative q-pb-xl">
    <div class="text-primary text-bold q-pl-md q-py-md text-h6">Saques</div>
        <q-btn glossy class="q-ml-md q-mb-md" label="Solicitar Saque" color="green" icon-right="currency_exchange" to="/host/me"></q-btn>
    <div v-if="saques != null && saques.length > 0"  class="w100 column q-px-md">
        <q-card class="q-mb-md" :class="saque.status.includes('Realizado') ? 'bg-green' : 'bg-orange-14'" v-for="saque in saques" :key="saque.id">
            <q-card-section class="text-white text-bold">
                {{ saque.status }}
            </q-card-section>
            <q-card-section class="text-black bg-white">
                <strong>Data Solicitação: </strong> {{ Utils.formatDate(saque.time_requested) }}<br>
                <strong>Data Efetivação: </strong>{{ Utils.formatDate(saque.time_paid) }}
            </q-card-section>
            <q-card-section class="text-black bg-white">
                <strong>Valor Solicitado:</strong> R$ {{ Utils.formatCurrency(saque.price) }}<br>
                <strong>Valor a Receber:</strong> R$ {{ Utils.formatCurrency(saque.final_price) }} (5% de taxa) 
            </q-card-section>
            <q-card-section class="text-black bg-white">
                <strong>Chave Pix:</strong> {{ saque.pix_key }}<br>
                <strong>Tipo: </strong> {{ saque.pix_type }}
            </q-card-section>
            <q-card-section v-if="saque.status.includes('Realizado')" class="text-black bg-white text-right">
                <q-btn label="Ver Comprovante" @click="verComprovante(saque.comprovante)" glossy icon-right="search" color="primary" />
            </q-card-section>
        </q-card>
        <q-dialog v-model="showComprovante">
            <q-card class="w100">
                <div id="title-2" class="text-primary q-pa-md">
                    Comprovante
                </div>
                <q-card-section>
                    <img :src="comprovante" class="w100">
                </q-card-section>
                <q-card-actions align="right">
                    <q-btn label="Fechar" flat color="primary" @click="showComprovante = false" />
                </q-card-actions>
            </q-card>

        </q-dialog>
    </div>
</q-page>
</template>

<script setup>
import { onBeforeMount, ref } from 'vue';
import { api } from 'src/boot/axios';
import { Utils } from "src/utils/Utils";

const showComprovante = ref(false);
const comprovante = ref(null);
const saques = ref(null);

onBeforeMount(async () => {
    const host = JSON.parse(sessionStorage.getItem('host'));
    await api.post('/host/saques', { id: host.id, token: host.token}).then((response) => {
        saques.value = response.data;
    }).catch((error) => {
        console.log(error);
    });
});
function verComprovante(comprovante_url) {
    comprovante.value = comprovante_url;
    showComprovante.value = true;
}
// return {
//             status: log.sake_status,
//             time_requested: log.content.time_requested,
//             time_paid: log.content.time_paid,
//             price: log.content.price,
//             final_price: log.content.final_price,
//         };

</script>

<style>

</style>