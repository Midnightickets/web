<template>
    <div class="es1 bg-grey-4 q-mx-sm  rounded-borders shadow-4 relative">
        <div
            class="title-1 w100 text-h6 row items-center text-primary shadow-1 q-pt-md q-pb-sm q-mt-lg q-px-sm justify-center text-bold">
            <q-icon size="md" color="primary" name="confirmation_number" class="q-pr-sm" />
            Configurar Ingressos
        </div>
        <div class="column q-gutter-y-md q-pa-md q-mb-lg">
            <div class="column q-gutter-y-md">
            </div>
            <div class="column q-gutter-y-md q-mb-xs">
                <q-input :inputStyle="{ fontWeight: 'bold', color: '' }" outlined class="bg-grey-2"
                    v-model="ingressoHandler.title" placeholder="Entrada Masculina, Camarote, Pista Inteira"
                    maxlength="40" label="Título do Ingresso">
                    <template v-slot:append>
                        <q-icon name="confirmation_number" color="primary" />
                    </template>
                </q-input>
                <q-input :inputStyle="{ fontWeight: 'bold', color: '' }" outlined maxlength="7" prefix="R$" class="bg-grey-2"
                    v-model="ingressoHandler.price" label="Preço do Ingresso" reverse-fill-mask mask="####,##">
                    <template v-slot:append>
                        <q-icon name="payments" color="primary" />
                    </template>
                </q-input>
                <div class="w100 row">
                    <div class="w100  text-bold">Vendas</div>
                    <div class="w100 q-mx-sm rounded-borders q-py-md">
                        <q-radio v-model="limitedTickets.isLimited" :val="true" label="Limitar Ingressos" color="primary" />
                        <q-input v-if="limitedTickets.isLimited" v-model="limitedTickets.maxTickets" outlined class="q-mx-sm q-my-sm bg-grey-2 rounded-borders" mask="####" maxlength="4" 
                            label="Máximo de Ingressos">
                            <template v-slot:append>
                                <q-icon name="local_activity" color="primary" />
                            </template>
                        </q-input>
                        <q-radio v-model="limitedTickets.isLimited" :val="false" label="Parar vendas manualmente" color="primary" />
                    </div>
                </div>
                <q-btn class="q-py-md" label="Adicionar Ingresso" color="primary" glossy :disable="validaIngresso()"
                    @click="addIngresso()" icon-right="add_circle" />
            </div>
            <div  class="w100 hline bg-primary"></div>
            <div  class="text-bold text-h6 text-primary text-center">Ingressos do Evento
            </div>
            <div id="list-ingressos" class="column">
                <div v-for="(ingresso, index) in ingressos" :key="index"
                    class="relative column no-wrap items-center rounded-borders bg-twitch q-mb-md  justify-between">
                    <div class="row q-py-xs items-center">
                        <div class="text-bold text-white q-py-sm text-center" id="title-layout">{{
                            format(ingresso.title) }}
                            <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">
                                {{ ingresso.title }}
                            </q-tooltip>
                        </div>
                    </div>
                    <div class="w100 bg-secondary mid-opacity q-mx-md" style="height: 2px"></div>
                    <div class="row w100 items-center justify-center ">
                        <q-btn class="absolute" style="top:-5px;left:-15px" color="secondary" flat icon="close"
                            @click="removeIngresso(index)" />
                        <div class="text-bold text-secondary text-shadow q-py-xs text-h6">R$ {{ Utils.formatCurrency(ingresso.price) }}</div>
                    </div>
                    <div v-if="ingresso.maxTickets < 999" class="w100">
                        <div class="text-bold text-grey-6 q-pl-sm text-shadow q-py-xs text-h6">Máximo: {{ ingresso.maxTickets }}</div>
                    </div>
                </div>
                <div v-if="ingressos.length == 0" class="text-center text-bold text-secondary">No momento não há ingressos cadastrados</div>
            </div>
            <div class="w100 hline bg-primary"></div>
            <q-btn v-if="!loading" :disabled="checkNext()" label="Criar Evento" glossy color="green" class="q-py-xl"
                @click="criarEvento()" icon-right="event_available" />
            <div v-if="loading" class="row w100 q-py-md q-mt-xs justify-center">
                <q-spinner-ball color="secondary" size="lg" />
                <q-spinner-ball color="secondary" size="lg" />
                <q-spinner-ball color="secondary" size="lg" />
            </div>
            <q-btn v-if="!loading" label="voltar" flat color="primary" @click="goPrev()" />
        </div>

    </div>
</template>

<script setup>
import { useQuasar } from "quasar";
import { ref, defineEmits, onMounted } from "vue";
import { api } from 'src/boot/axios';
import { Utils } from 'src/utils/Utils';
import { useRouter } from "vue-router";

const emit = defineEmits(['next', 'prev'])
const router = useRouter()

const loading = ref(false)
const hostInfo = sessionStorage.getItem('host') ? JSON.parse(sessionStorage.getItem('host')) : null;

const limitedTickets = ref({
    isLimited: false,
    maxTickets: '0'
})

const ingressoHandler = ref({
    title: '',
    price: '',
    maxTickets: '999',
    status: true
})

const $q = useQuasar()

const ingressos = ref([])
function formatToNumber(inputString) {
    // Remove todos os caracteres que não sejam dígitos ou vírgula
    let cleanString = inputString.replace(/[^\d,]/g, '');

    // Substitui vírgula por ponto para lidar com números decimais
    let numericString = cleanString.replace(',', '.');

    // Converte para número e força duas casas decimais
    let number = parseFloat(numericString).toFixed(2);

    // Se a conversão não resultar em um número válido, retorna 0.00
    if (isNaN(number)) {
        number = '0.00';
    }

    // Converte de volta para string e substitui ponto por vírgula
    let formattedString = number.toString().replace('.', ',');

    return formattedString;
}
const addIngresso = () => {
    let valid = true
    ingressoHandler.value.title = ingressoHandler.value.title.trim().toLowerCase()
    ingressos.value.forEach(ingresso => {
        if (ingresso.title.trim().toLowerCase() == ingressoHandler.value.title) {
            $q.notify({
                color: 'orange-14',
                position: 'top',
                message: 'Título de ingresso já cadastrado',
                icon: 'report_problem'
            })
            ingressoHandler.value.title = ''
            valid = false
            return
        }
    });
    if(limitedTickets.value.isLimited) {
            if(limitedTickets.value.maxTickets == 0) {
                $q.notify({
                    color: 'orange-14',
                    position: 'top',
                    message: 'O número de ingressos deve ser maior que 0',
                    icon: 'report_problem'
                })
                valid = false
                return
            }
            ingressoHandler.value.maxTickets = limitedTickets.value.maxTickets
        }
        if(!limitedTickets.value.isLimited) {
            ingressoHandler.value.maxTickets = 999
        }
    if (valid) {
        ingressoHandler.value.maxTickets = Number(ingressoHandler.value.maxTickets)
        ingressos.value.push(ingressoHandler.value)
        ingressoHandler.value = {
            title: '',
            price: '',
            status: true,
        }
        limitedTickets.value.isLimited = false
        console.log(JSON.stringify(ingressos.value))
    }
}

function validaIngresso() {
    return ingressoHandler.value.title == '' || ingressoHandler.value.price == ''

}

function format(text) {
    if (text.length > 20) {
        return (text.substring(0, 13) + '...').toUpperCase()
    }
    return text.toUpperCase()
}

function removeIngresso(index) {
    const confirm = window.confirm('Deseja realmente remover este tipo de ingresso?')
    if (confirm) {
        ingressos.value.splice(index, 1)
    }
}

const criarEvento = async () => {
    loading.value = true
    const reqObject = {
        ...JSON.parse(sessionStorage.getItem('eventoStep1')),
        ticket_types: ingressos.value,
        host: {
            login: hostInfo.login,
            password: hostInfo.token
        },
    }
    await api.post('/create_event', reqObject)
        .then(response => {
            $q.notify({
                color: 'primary',
                position: 'top',
                message: response.data.message,
                icon: 'event'
            })
            sessionStorage.removeItem('eventoStep1')
            sessionStorage.removeItem('eventoStep2')
            sessionStorage.setItem('evento', response.data.event_id)
            router.push('/host/evento')
        })
        .catch(error => {
            $q.notify({
                color: 'orange',
                position: 'top',
                message: error.response.data.error,
                icon: 'report_problem'
            })
        })
        .finally(() => { loading.value = false })
}

const goPrev = () => {
    emit('prev')
}

onMounted(async () => {
    window.scrollTo(0, 0);
})

const checkNext = () => {
    // if (ingressos.value.length == 0) {
    //     return true
    // }
    // else {
    //     return false
    // }
    return false
}

</script>

<style scoped>
.title-1 {
    position: sticky;
    top: 90px;
    background: #efefef4d;
    backdrop-filter: blur(4px);
    z-index: 1;
}
</style>