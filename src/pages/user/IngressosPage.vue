<template>
    <q-page class="bg-grad-1 text-white q-px-md animate__animated animate__fadeIn q-pb-xl" id="title">
        <div class="w100" >
            <q-btn @click="retornar()" icon="keyboard_return" color="secondary" glossy></q-btn>
        </div>
        <div class="w100 text-white animate__animated animate__zoomIn text-center q-mb-md" id="title">Meus Ingressos</div>
        <div id="meus-ingressos">
            <q-list class="row q-gutter-x-md q-gutter-y-md">
                <q-card v-for="ingresso in ingressos" :key="ingresso.id" class="w100 q-pb-md bg-grey-3">
                    <q-card-section>
                        <div :class="!ingresso.isExpired ? 'text-primary' : 'text-secondary'" id="title-menu">
                            <q-icon class="q-pb-xs" name="local_activity" color="primary"></q-icon>
                            {{ ingresso.ingresso }}
                        </div>
                        <div class="text-h6 text-blue-14 text-bold">{{ ingresso.event }}</div>
                        <div class="bg-grey-9 rounded-borders q-pa-sm q-mt-sm text-h6 text-secondary text-bold">{{ ingresso.ticket_person_name.toUpperCase() }}</div>
                        <div class="text-grey-8 text-bold q-pt-md" style="font-size: 16px">{{ !ingresso.isExpired ? '🟢 Disponível' : '🟡  Utilizado' }}</div>
                        <div class="text-h6 text-grey-5 text-right text-bold">{{ ingresso.payer }}</div>
                    </q-card-section>
                    <div class="w100 q-px-md" v-if="!ingresso.isExpired">
                        <q-btn @click="generateQRCode(ingresso)" label="Ver Ingresso" icon-right="confirmation_number" class="w100 q-py-md" color="green-14" glossy></q-btn>
                    </div>
                </q-card>                
                <q-card v-if="ingressos.length == 0 && !loading" class="w100 q-pb-md bg-grey-3">
                    <q-card-section>
                        <div class="text-secondary text-center" id="title-menu">
                            Você ainda <strong class="text-primary">não</strong> possui ingressos<br>(˘･_･˘)<br>
                            <div class="w100 q-pt-xs bg-secondary q-mt-md"></div>
                            <br><strong class="text-primary">Encontre eventos</strong> pelo menu ou pela página inicial e <strong class="text-primary">adquira já</strong> o seu ingresso!<br>╰(*°▽°*)╯
                        </div>
                    </q-card-section>
                </q-card>                
            </q-list>
        </div>
        <q-dialog v-model="dialogQrIngresso" persistent >
            <div class="text-secondary text-center text-shadow bg-dark q-pa-md shadow-2" id="title-2">
                <q-icon class="q-pb-xs" size="lg" name="local_activity" color="secondary"></q-icon>
                {{ ingressoHandler.ingresso }}<br>
                <div class="text-blue-14 text-center q-mt-sm">
                    {{ ingressoHandler.event }}</div>
                <div class="text-grey-7 text-center bg-grey- q-mt-md q-pa-md shadow-1" id="title-layout">
                    Apresente este QRCode na entrada do Evento junto com seu Documento de Identidade
                </div>
                <div class="text-secondary text-center bg-black q-mt-md q-pb-lg rounded-borders shadow-1" id="title-layout">
                    <br>{{ ingressoHandler.ticket_person_name.toUpperCase() }}<br>{{ ingressoHandler.ticket_person_cpf }}
                </div>
                <div class="column q-mt-lg items-center justify-center">
                    <canvas class="shadow-1 rounded-borders" ref="qrcodeCanvas"></canvas>
                </div>
                <div class="text-blue text-center bg-black q-mt-md q-py-xs rounded-borders shadow-1" id="title-layout">
                    Comprado por: {{ ingressoHandler.payer }}
                </div>
                <div v-if="loading" class="row w100 q-py-sm q-mt-xs justify-center">
                    <q-spinner-ball color="secondary" size="lg" />
                    <q-spinner-ball color="secondary" size="lg" />
                    <q-spinner-ball color="secondary" size="lg" />
                </div>
                <q-btn @click="dialogQrIngresso = false" label="Fechar" color="secondary" class="w100 q-mt-md" flat></q-btn>
            </div>
        </q-dialog>
    </q-page>
</template>

<script setup>
import { onBeforeMount, ref } from 'vue';
import { api } from 'src/boot/axios';
import QRCode from 'qrcode';
import { Utils } from 'src/utils/Utils';

const dialogQrIngresso = ref(false)
const ingressos = ref([])
const ingressoHandler = ref(null)
const loading = ref(true)
onBeforeMount(async () => {
    const user = JSON.parse(sessionStorage.getItem('user'))
    await api.post('/user/ingressos', {user: { id: user.id , token: user.token}})
        .then(response => {
            ingressos.value = response.data
        })
        .catch(error => {
            console.log(error)
        })
        .finally(() => {
            loading.value = false
        })
})

function formatCurrency(valor) {
    if(typeof valor === 'number') {
        return valor.toFixed(2).toString().replace('.', ',')
    } else {
        if(valor.includes(',')) {
            valor = valor.replace(',', '.')
        }
        valor = Number(valor).toFixed(2)        
        return valor.toString().replace('.', ',')
    }
}

function retornar() {
    window.history.back()
}

const qrcodeCanvas = ref(null);

const generateQRCode = (ingresso) => {
    loading.value = true
    ingressoHandler.value = ingresso
    dialogQrIngresso.value = true
    setTimeout(() => {
        QRCode.toCanvas(qrcodeCanvas.value, ingresso.id, (error) => {
            if (error) console.error(error);
        });
        loading.value = false
    }, 1000)
};

</script>

<style scoped>
.q-card{
    border-left: 6px solid #9573f3;
    cursor: pointer;
}

@media (min-width: 600px) {
   .q-card{
        width: 45%;
    }
    .q-list {
        display: flex;
        justify-content: center;
    }
}

</style>