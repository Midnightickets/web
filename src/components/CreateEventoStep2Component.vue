<template>
    <div class="es1 bg-white q-mx-sm  rounded-borders shadow-4 relative">
        <div
            class="title-1 w100 text-h6 row items-center text-primary shadow-1 q-py-xs q-px-sm justify-center text-bold">
            <q-icon size="md" color="primary" name="confirmation_number" class="q-pr-sm" />
            Configurar Ingressos
        </div>
        <div class="column q-gutter-y-md q-pa-md q-mb-lg">
            <div class="column q-gutter-y-md">
                <div id="title-layout" class="w100 text-bold text-secondary"><q-icon name="payments" color="primary"
                        size="md" class="q-mb-xs"></q-icon> Saldo Atual: {{
                            Utils.formatCurrency(hostInfo.balance, 'brl') }}</div>
                <q-select v-if="!loading" v-model="pacote" @update:model-value="verificaSaldoDisponivel()"
                    :options="pacoteOptions" outlined label="Pacote de Ingressos*" color="primary" />
                <div v-if="loading" class="row w100 q-pb-xl justify-center">
                    <q-spinner-ball color="primary" size="lg" />
                    <q-spinner-ball color="primary" size="lg" />
                    <q-spinner-ball color="primary" size="lg" />
                </div>
            </div>
            <div v-if="pacote != null && possuiSaldo && ingressosDisponiveis > 0" class="column q-gutter-y-md q-mb-xl">
                <div class="w100 hline bg-primary"></div>
                <q-input :inputStyle="{ fontWeight: 'bold', color: '#6310E1' }" outlined class="q-mt-lg"
                    v-model="ingressoHandler.title" placeholder="Entrada Masculina, Camarote, Pista Inteira"
                    maxlength="40" label="Título do Ingresso*" />
                <q-input :inputStyle="{ fontWeight: 'bold', color: '#6310E1' }" outlined maxlength="7" prefix="R$"
                    v-model="ingressoHandler.price" label="Preço do Ingresso*" reverse-fill-mask mask="####,##">
                    <template v-slot:append>
                        <q-icon name="payments" color="primary" />
                    </template>
                </q-input>
                <q-input :inputStyle="{ fontWeight: 'bold', color: '#6310E1' }" outlined mask="#####" maxlength="4"
                    v-model="ingressoHandler.quantity" label="Quantidade de Ingressos*" reverse-fill-mask>
                    <template v-slot:append>
                        <div class="q-pr-sm">{{ ingressosDisponiveis }}</div>
                        <q-icon name="confirmation_number" color="primary" />
                    </template>
                </q-input>
                <q-btn label="Adicionar Ingresso" color="blue-14" glossy :disable="validaIngresso()"
                    @click="addIngresso()" icon-right="add_circle" />
            </div>
            <div v-if="pacote" class="w100 hline bg-primary"></div>
            <div v-if="pacote" class="text-bold text-h6 text-primary text-center">Ingressos do Evento
            </div>
            <div id="list-ingressos" class="column">
                <div v-for="(ingresso, index) in ingressos" :key="index"
                    class="relative column no-wrap items-center rounded-borders shadow-4 bg-grad-1 q-mb-md  justify-between">
                    <div class="row q-py-xs items-center">
                        <div class="text-bold text-white q-py-sm text-center" id="title-layout">{{
                            format(ingresso.title) }}</div>
                    </div>
                    <div class="w100 bg-secondary mid-opacity q-mx-md" style="height: 2px"></div>
                    <div class="row w100 items-center justify-center ">
                        <q-btn class="absolute" style="top:-5px;left:-15px" color="red" flat icon="close"
                            @click="removeIngresso(index)" />
                        <q-btn :label="ingresso.quantity" icon="local_activity" flat color="grey-4"
                            class="text-bold q-mr-lg" />
                        <div class="text-bold text-green-13 text-shadow">R$ {{ ingresso.price }}</div>
                    </div>
                </div>
                <div v-if="ingressos.length" class="text-center text-bold text-secondary">{{ ingressos.length }} Tipo(s)
                    de ingresso
                </div>
                <div v-else class="text-center text-bold text-secondary">No momento não há ingressos cadastrados</div>
            </div>
            <div class="w100 hline bg-primary"></div>
            <q-btn :disabled="checkNext()" label="Criar Evento" glossy color="green-14" class="q-py-lg"
                @click="criarEventTrigger()" icon-right="event" />
            <q-btn label="voltar" flat color="primary" @click="goPrev()" />
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

const loading = ref(true)
const pacoteOptions = ref([])
const pacote = ref(null)
const hostInfo = sessionStorage.getItem('host') ? JSON.parse(sessionStorage.getItem('host')) : null;
const possuiSaldo = ref(false)
const ingressosDisponiveis = ref(0)

const ingressoHandler = ref({
    title: '',
    price: '',
    quantity: '',
})

const $q = useQuasar()

function verificaSaldoDisponivel() {
    if (pacote.value.price > hostInfo.balance) {
        $q.notify({
            color: 'orange-9',
            position: 'top',
            message: 'Saldo Insuficiente',
            icon: 'payments',
            actions: [{ label: 'RECARREGAR', color: 'white', handler: () => { router.push('/host/recarga') } }]
        })
        possuiSaldo.value = false
        sessionStorage.removeItem('pacote')
        pacote.value = null
    } else {
        possuiSaldo.value = true
        sessionStorage.setItem('pacote', JSON.stringify(pacote.value))
        ingressosDisponiveis.value = pacote.value.max_tickets
    }
}

const getPackageOptions = async () => {
    await api.get('/get_packages')
        .then(response => {
            const giveQuasarSelectValueToPackage = (data) => {
                data.forEach((item) => {
                    item.value = item.id
                    item.label = (item.price < hostInfo.balance ? '🎫 ' : '🎟️ ') + item.title
                })
                pacoteOptions.value = data
            }
            giveQuasarSelectValueToPackage(response.data)
        })
}


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
    if (ingressoHandler.value.quantity > ingressosDisponiveis.value) {
        $q.notify({
            color: 'blue-8',
            position: 'top',
            message: 'Quantidade de ingressos maior do que o disponível',
            icon: 'report_problem'
        })
        ingressoHandler.value.quantity = 0
        return
    } else {
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
    }
    if (valid) {
        ingressoHandler.value.quantity = Number(ingressoHandler.value.quantity)
        ingressosDisponiveis.value -= ingressoHandler.value.quantity
        ingressoHandler.value.price = formatToNumber(ingressoHandler.value.price)
        ingressos.value.push(ingressoHandler.value)
        sessionStorage.setItem('pacote', JSON.stringify(pacote.value))
        sessionStorage.setItem('eventoStep2', JSON.stringify(ingressos.value))
        ingressoHandler.value = {
            title: '',
            price: '',
            quantity: '',
            vendidos: 0
        }
    }
}

function validaIngresso() {
    return ingressoHandler.value.title == '' || ingressoHandler.value.price == '' || ingressoHandler.value.quantity == 0 || ingressoHandler.value.quantity == null

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
        ingressosDisponiveis.value += Number(ingressos.value[index].quantity)
        ingressos.value.splice(index, 1)
    }
}

const criarEvento = async () => {
    const reqObject = {
        ...JSON.parse(sessionStorage.getItem('eventoStep1')),
        ticket_types: ingressos.value,
        host: {
            login: hostInfo.login,
            password: hostInfo.token
        },
        package_id: pacote.value.id
    }
    await api.post('/create_event', reqObject)
        .then(response => {
            $q.notify({
                color: 'green-14',
                position: 'top',
                message: response.data.message,
                icon: 'event'
            })
            sessionStorage.removeItem('eventoStep1')
            sessionStorage.removeItem('eventoStep2')
            sessionStorage.removeItem('pacote')
            router.push('/host')
        })
        .catch(error => {
            $q.notify({
                color: 'orange',
                position: 'top',
                message: error.response.data.error,
                icon: 'report_problem'
            })
        })
}

const criarEventTrigger = async () => {
    if (ingressosDisponiveis.value > 0) {
        const confirm = window.confirm('Você ainda possui Ingressos Disponíveis para uso.\nCaso não os utilize eles serão perdidos.\nDeseja Continuar?')
        if (confirm) {
            await criarEvento()
        }
        else {
            return
        }
    } else {
        await criarEvento()
    }
}

const goPrev = () => {
    emit('prev')
}

onMounted(async () => {
    window.scrollTo(0, 0);
    await getPackageOptions().finally(() => { loading.value = false })
    const es2Storage = sessionStorage.getItem('eventoStep2')
    const es2 = JSON.parse(es2Storage)
    if (es2) {
        ingressos.value = es2
        pacote.value = JSON.parse(sessionStorage.getItem('pacote'))
        verificaSaldoDisponivel()
        ingressosDisponiveis.value = pacote.value.max_tickets - es2.reduce((acc, curr) => acc + curr.quantity, 0)
    }
})

const checkNext = () => {
    if (ingressos.value.length == 0 || !pacote) {
        return true
    }
    else {
        return false
    }
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