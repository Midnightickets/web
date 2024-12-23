<template>
    <q-page class=" w100 animate__animated animate__fadeIn relative">
        <div class="w100 q-mt-xs">
            <q-btn to='/host' dense class="q-ml-sm" flat  icon="keyboard_return" label="eventos" color="secondary">
            </q-btn>
        </div>
        <div id="title" class="text-white q-px-sm q-pb-sm text-center">
            Meu Perfil
        </div>
        <div v-if="!editing" class="w100 flex flex-center q-mb-md">
            <q-btn @click="editing = !editing" label="Editar Pefil" color="secondary" glossy icon-right="account_circle"></q-btn>
        </div>
        <div v-if="host" class="row wrap justify-evenly w100 q-px-md q-mt-md cards-wrapper justify-center items-center">
            <q-card class="q-mb-md">
                <q-card-section class="q-pa-md">
                    <div class="text-h6 text-primary">Nome</div>
                    <div class="text-h6">{{ host.name }}</div>
                </q-card-section>
                <q-card-section class="q-pa-md">
                    <div class="text-h6 text-primary">Login</div>
                    <div class="text-h6">{{ host.login }}</div>
                </q-card-section>
                <q-card-section class="q-pa-md">
                    <div class="text-h6 text-primary">Email</div>
                    <div class="text-h6">{{ host.email }}</div>
                </q-card-section>
                <q-card-section class="q-pa-md">
                    <div class="text-h6 text-primary">Senha</div>
                    <div class="text-h6">**********</div>
                </q-card-section>
            </q-card>
            <q-card class="q-mb-md">
                <q-card-section class="q-pa-md">
                    <div class="text-h5 text-primary">Saldo</div>
                    <div class="text-h6 ">R$ {{ host.balance }}</div>
                </q-card-section>
                <q-card-section class="q-pa-md">
                    <div class="text-h6 text-primary">Chave PIX - {{ host.pix_key.type != 'xxx'? `[${host.pix_key.type}]` : '[Não Cadastrado]' }}</div>
                    <div class="text-bold">{{ host.pix_key.key }}</div>
                </q-card-section>
                <q-card-section class="q-pa-md">
                    <div class="text-h6 text-primary">Solicitação de Saque</div>
                    <div class="text-bold">{{ host.waitingSake ? '🟣 Aguardando Processamento' : '🟢 Disponível para saque'}}</div>
                </q-card-section>
                <q-card-section v-if="!host.waitingSake" class="q-pa-md">
                    <q-btn class="w100 q-py-md" label="Solicitar Saque" icon-right="paid" glossy color="green-14"></q-btn>
                </q-card-section>
            </q-card>
        </div>
        <div v-if="loading" class="row w100 q-py-sm justify-center">
            <q-spinner-ball color="primary" size="lg" />
            <q-spinner-ball color="primary" size="lg" />
            <q-spinner-ball color="primary" size="lg" />
        </div>
    </q-page>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { api } from 'src/boot/axios';
import { useQuasar } from "quasar";

const editing = ref(false);

const host = JSON.parse(sessionStorage.getItem('host'));
const loading = ref(false);
const $q = useQuasar()

onMounted( async () => {
    window.scrollTo(0, 0);
});


</script>

<style scoped>

.q-card {
    width: 100%;
}


@media (min-width: 600px) {
    .q-card {
        width: 20vw;
    }
    
    .add-subhost{
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        width: 100%;
    }
    .add-subhost .q-input, .add-subhost .q-btn{
        width: 20vw;
    }
}

</style>