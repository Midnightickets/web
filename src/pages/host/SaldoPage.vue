<template>
    <q-page>
        <q-page class="w100 animate__animated animate__fadeIn relative q-pb-xl">
            <div class="w100 text-center q-py-md text-white" id="title">
                Saldo
            </div>
            <div class="q-mx-md ">
                <div class="recarga row justify-center rounded-borders text-center">
                    <q-input v-model="recargaValor" label="Recarga" class="w100 q-mb-md bg-white rounded-borders text-bold" :inputStyle="{fontWeight: 'bold'}" prefix="R$" reverse-fill-mask mask="#####,##" maxlength="8" placeholder="Digite o valor que deseja adicionar" filled>
                        <template v-slot:prepend>
                            <q-icon name="payments" class="q-mr-sm" color="primary"></q-icon>
                        </template>
                    </q-input>
                </div>
                <div class="pacotes w100">
                    <q-btn label="Recarregar" class="q-mb-md bg-green text-center w100 q-py-lg text-white rounded-borders" :disabled="recargaValor.trim() === ''" icon-right="currency_exchange" />
                    <div id="title-menu" class="w100 q-my-md text-secondary">
                        Opções de Pacotes
                    </div>
                    <div class="w100 rounded-borders q-pt-xs bg-secondary q-mb-lg"></div>
                    <div class="pacote" 
                        v-for="pacote in pacoteOptions"
                        :key="pacote.id"
                    >
                        <q-card class="q-mb-md">
                            <q-card-section>
                                <q-icon name="local_activity" class="q-pr-sm" size="md" color="primary"></q-icon> 
                                <div id="title-menu" class="text-primary row items-center">{{ pacote.max_tickets }} Ingressos</div>
                                <div class="text-bold q-py-sm text-white bg-secondary row items-center q-px-md rounded-borders q-mt-md w50 no-wrap">
                                    {{ Utils.formatCurrency(pacote.price, 'brl') }}</div>
                            </q-card-section>
                        </q-card>
                        </div>
                </div>
            </div>
        </q-page>
    </q-page>
</template>

<script setup>
import { api } from 'src/boot/axios';
import { onMounted, ref } from 'vue';
import { Utils } from 'src/utils/Utils';

const pacoteOptions = ref([])
const recargaValor = ref('')

const loadPacotes = async () => {
    await api.get('/get_packages')
        .then((response) => {
            pacoteOptions.value = response.data
        })
        .catch((error) => {
            console.log(error)
        })
}

onMounted(async () => {
    await loadPacotes()
})

</script>

<style scoped>
.q-page {
    min-height: 100vh;
}
@media (min-width: 600px) {
    .pacotes{
        padding: 0 5%;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
    }
   .pacote{
        width: 27vw;
    }
    .recarga .q-input{
        width: 25vw;
    }
}

</style>