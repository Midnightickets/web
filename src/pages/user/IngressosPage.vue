<template>
    <q-page class="bg-grey-5 text-white q-px-md animate__animated animate__fadeIn q-pb-xl" id="title">
        <div class="w100" >
            <q-btn to="/" icon="home" color="secondary" glossy></q-btn>
        </div>
        <div class="w100 text-primary animate__animated animate__zoomIn text-center q-mb-md" id="title">Meus Ingressos</div>
        <div id="meus-ingressos">
            <q-list >
                <q-card v-for="ingresso in ingressos" :key="ingresso.id" class="q-pb-md bg-grey-3">
                    <q-card-section>
                        <div :class="!ingresso.isExpired ? 'text-primary' : 'text-secondary'" id="title-menu">{{ ingresso.ticket_type.title }}</div>
                        <div class="text-h6 text-secondary text-bold">{{ ingresso.event }}</div>
                        <div class="text-grey-8 text-bold q-pt-md" style="font-size: 16px">{{ !ingresso.isExpired ? '🟢 Disponível' : '🟡  Utilizado' }}</div>
                        <div class="text-h6 text-blue-14 text-bold mid-opacity text-right">R$ {{ formatCurrency(ingresso.ticket_type.totalValue) }}</div>
                    </q-card-section>
                    <div class="w100 q-px-md">
                        <q-btn @click="generateQRCode(ingresso.id)" label="Ver Ingresso" icon-right="confirmation_number" class="w100 q-py-md" color="primary" glossy></q-btn>
                    </div>
                </q-card>                
            </q-list>
        </div>
        <q-dialog v-model="dialogQrIngresso" persistent >
            <div v-if="loading" class="row w100 q-py-sm q-mt-xs justify-center">
                <q-spinner-ball color="secondary" size="lg" />
                <q-spinner-ball color="secondary" size="lg" />
                <q-spinner-ball color="secondary" size="lg" />
            </div>
            <div class="column items-center justify-center">
                <canvas ref="qrcodeCanvas"></canvas>
                <q-btn v-if="!loading" @click="dialogQrIngresso = false" label="Fechar" color="primary" class="q-mt-xl" glossy></q-btn>
            </div>
        </q-dialog>
    </q-page>
</template>

<script setup>
import { onBeforeMount, ref } from 'vue';
import { api } from 'src/boot/axios';
import QRCode from 'qrcode';

const dialogQrIngresso = ref(false)
const ingressos = ref([])
const loading = ref(false)
onBeforeMount(async () => {
    const user = JSON.parse(sessionStorage.getItem('user'))
    await api.post('/user/ingressos', {user: { id: user.id , token: user.token}})
        .then(response => {
            ingressos.value = response.data
        })
        .catch(error => {
            console.log(error)
        })
})

function formatCurrency(valor) {
    if(typeof valor === 'number') {
        return valor.toFixed(2).toString().replace('.', ',')
    } else {
        return valor.toString().replace('.', ',')
    }
}

const qrcodeCanvas = ref(null);

const generateQRCode = (ingressoId) => {
    loading.value = true
    dialogQrIngresso.value = true
    setTimeout(() => {
        QRCode.toCanvas(qrcodeCanvas.value, ingressoId, (error) => {
            if (error) console.error(error);
        });
        loading.value = false
    }, 1000)
};

</script>

<style scoped>
.q-card{
    border-left: 6px solid #9573f3;

}
@media (min-width: 600px) {
   .q-card{
        width: 50%;
    }
    .q-list {
        display: flex;
        justify-content: center;
    }
}

</style>