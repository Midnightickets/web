<template>
        <q-page class="w100 animate__animated animate__fadeIn relative q-pb-xl">
            <div class="w100 text-center q-py-md text-white" id="title">
                Saldo e Recarga
            </div>
            <div class="q-mx-md ">
                <div class="recarga row justify-center rounded-borders text-center">
                    <q-input v-model="recargaValor" label="Recarga" class="w100 q-mb-md bg-white rounded-borders text-bold" :inputStyle="{color: '#6310E1',fontWeight: 'bold'}" prefix="R$" reverse-fill-mask mask="#####,##" maxlength="8" placeholder="Digite o valor que deseja adicionar" filled>
                        <template v-slot:prepend>
                            <q-icon name="payments" class="q-mr-sm" color="primary"></q-icon>
                        </template>
                    </q-input>
                </div>
                <div class="pacotes w100">
                    <q-btn label="Recarregar" class="q-mb-md bg-green text-center w100 q-py-xl text-white rounded-borders" glossy :disabled="recargaValor.trim() === ''" @click="recarregarBtn()" icon-right="currency_exchange" />
                    <div class="q-mt-md q-pb-xs w100 text-secondary text-bold">Saldo Atual: {{ Utils.formatCurrency(host.balance, 'brl') }}</div>
                    <q-btn label="Solicitar Saque" class="q-mb-md bg-primary text-center w100 q-py-lg text-white rounded-borders" glossy icon-right="payments" />
                    <div id="title-menu" class="w100 q-my-md text-secondary">
                        Pacotes e Valores
                    </div>
                    <div class="w100 rounded-borders q-pt-xs bg-secondary q-mb-lg"></div>
                    <div class="w100">
                        <q-btn class="q-mb-md" color="secondary" :label="!showPacotes ? 'Ver pacotes de ingressos' : 'Ocultar'" :icon-right="!showPacotes ? 'arrow_drop_down' : 'arrow_drop_up'" glossy @click="showPacotes = !showPacotes"></q-btn>
                    </div>
                    <div v-if="showPacotes" class="w100 pacotes">
                        <div  class="pacote"  
                            v-for="pacote in pacoteOptions"
                            :key="pacote.id"
                        >
                            <q-card class="q-mb-md bg-grey-4">
                                <q-card-section>
                                    <q-icon name="confirmation_number" class="q-pr-sm" size="md" color="primary"></q-icon><strong class="text-secondary text-bold">UM EVENTO DE</strong><br>
                                    <div id="title-menu" class="text-primary row items-center">{{ pacote.max_tickets }} Ingressos <strong class="text-h6 text-secondary text-bold q-pl-sm">por</strong></div>
                                    <div class="w100 rounded-borders q-pt-xs bg-secondary q-mb-lg q-mt-md"></div>
                                    <div class="text-bold q-py-sm text-white bg-secondary row items-center q-px-md rounded-borders q-mt-md w50 no-wrap">
                                        {{ Utils.formatCurrency(pacote.price, 'brl') }}</div>
                                </q-card-section>
                            </q-card>
                            </div>
                    </div>
                </div>
            </div>
            <q-dialog  v-model="showRecargaModal" persistent>
                <div class="q-px-md q-pb-md bg-grey-4">
                    <div class="w100 q-mt-md text-white bg-blue-5 q-py-md text-center" id="title-layout">CONFIRMAR RECARGA</div>
                    <div class="text-center q-pt-lg text-secondary text-h6">Deseja realmente <strong class="text-primary">adicionar {{ format(recargaValor) }}</strong> ao seu saldo<br>por <strong class="text-primary">{{ calculaTaxaTransacao(recargaValor) }}</strong> ?</div><br>
                    <TicketPaymentComponent />
                    <div class="w100 row justify-center">
                        <q-btn label="voltar" flat color="secondary" @click="showRecargaModal = false" />
                    </div>
                </div>
            </q-dialog>
    </q-page>
</template>

<script setup>
import TicketPaymentComponent from 'src/components/TicketPaymentComponent.vue'
import { api } from 'src/boot/axios';
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { Utils } from 'src/utils/Utils';

const pacoteOptions = ref([])
const recargaValor = ref('')
const showPacotes = ref(false)
const host = JSON.parse(sessionStorage.getItem('host'))
const showRecargaModal = ref(false)

function recarregarBtn() {
    let recargaTaxaCalculada = calculaTaxaTransacaoFinal(recargaValor.value)
    recargaTaxaCalculada = recargaTaxaCalculada.toString()
    if(recargaTaxaCalculada.includes('.')) {
        recargaTaxaCalculada = recargaTaxaCalculada.replace('.', ',')
    }
    sessionStorage.setItem('recarga', recargaTaxaCalculada)
    showRecargaModal.value = true
}

function calculaTaxaTransacaoFinal(value) {
    if(value.includes(',')) {
        value = value.replace(',', '.')
    }
    return Number(value) + (Number(value) * 0.01)
}

function format(value) {
    if(value.includes(',')) {
        value = value.replace(',', '.')
    }
    return Utils.formatCurrency(Number(value), 'brl')
}

function calculaTaxaTransacao(value) {
    if(value.includes(',')) {
        value = value.replace(',', '.')
    }
    return Utils.formatCurrency(Number(value) + (Number(value) * 0.01), 'brl')
}

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

onBeforeUnmount(() => {
    sessionStorage.getItem('recarga') && sessionStorage.removeItem('recarga')
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
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: space-between;
    }
   .pacote{
        width: 26vw;
    }
    .recarga .q-input{
        width: 25vw;
    }
}

</style>