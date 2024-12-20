<template>
    <div class="w100 bg-grey-4  rounded-borders shadow-4 relative">
        <div
            class="title-1 w100 text-h6 row items-center text-primary shadow-1 q-mt-xl q-py-sm justify-center text-bold">
            <q-icon size="md" color="primary" name="date_range" class="q-pr-sm" />
            Novo Evento
            <q-icon size="md" color="primary" name="add_circle" class="q-pl-sm" />
        </div>
        <div class="q-mx-md column q-gutter-y-md q-mb-xl">
            <div class="text-center w100 text-secondary high-opacity text-bold q-pt-md">Preencha as informações para
                criação do seu
                evento, elas poderão ser editadas posteriormente:</div>
            <q-input maxlength="50" filled class="q-mt-lg" v-model="evento.title" label="Título*">
                <template v-slot:append>
                    <q-btn flat icon="nightlife" color="primary" />
                </template>
            </q-input>
            <q-input maxlength="500" filled type="textarea" v-model="evento.desc" label="Descrição">
                <template v-slot:append>
                    <q-btn flat icon="info" color="primary" />
                </template>
            </q-input>
            <q-input maxlength="400" filled type="textarea" v-model="evento.address" label="Endereço*">
                <template v-slot:append>
                    <q-btn flat icon="pin_drop" color="primary" />
                </template>
            </q-input>
            <q-input maxlength="200" filled type="textarea" v-model="evento.contact" label="Contato*">
                <template v-slot:append>
                    <q-btn flat icon="phone" color="primary" />
                </template>
            </q-input>
            <div class="w100 row justify-center items-center no-wrap">
                <q-input class="q-mr-sm" id="times" label="Início" outlined v-model="evento.initial_time" mask="time" :rules="['time']">
                    <template v-slot:append>
                        <q-icon name="access_time" color="primary" class="cursor-pointer">
                            <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                                <q-time v-model="evento.initial_time">
                                    <div class="row items-center justify-end">
                                        <q-btn v-close-popup label="Fechar" color="primary" flat />
                                    </div>
                                </q-time>
                            </q-popup-proxy>
                        </q-icon>
                    </template>
                </q-input>
                <q-input label="Final" outlined v-model="evento.final_time" mask="time" :rules="['time']">
                    <template v-slot:append>
                        <q-icon name="access_time" color="primary" class="cursor-pointer">
                            <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                                <q-time v-model="evento.final_time">
                                    <div class="row items-center justify-end">
                                        <q-btn v-close-popup label="Fechar" color="primary" flat />
                                    </div>
                                </q-time>
                            </q-popup-proxy>
                        </q-icon>
                    </template>
                </q-input>
            </div>
            <div class="w100 row justify-center">
                <q-date id="date-picker" class="w100 row" v-model="evento.date" mask="DD-MM-YYYY HH:mm" :options="(date) => {
                    const today = new Date();
                    const yesterday = new Date(today);
                    yesterday.setDate(today.getDate());
                    const minDate = yesterday.toISOString().split('T')[0];
                    const mydate = new Date(date);
                    return mydate >= new Date(minDate);
                }" color="primary" />
            </div>
            <div class="w100 text-center text-secondary" id="title-layout">Data do Evento é Obrigatória*</div>
            <q-input maxlength="300" placeholder="Insira a url do banner" filled v-model="evento.img_url"
                label="Link da Imagem do Evento">
                <template v-slot:append>
                    <q-btn flat icon="image" @click="openImgur()" color="primary" />
                </template>
            </q-input>
            <q-input placeholder="Clique no ícone ao lado para ajuda" maxlength="800" filled v-model="evento.maps_loc"
                label="Localização Google Maps">
                <template v-slot:append>
                    <q-btn flat icon="map" @click="helpLocGoogle()" color="primary" />
                </template>
            </q-input>
            <div class="w100 hline bg-primary"></div>
            <q-btn :disabled="checkRequiredFields()" label="configurar ingressos" glossy class="q-py-lg" color="primary" @click="goNext()"
                icon-right="skip_next" />
            <q-btn class="q-mb-md" label="meus eventos" flat color="primary" to="/host" />
        </div>

    </div>
</template>

<script setup>
import { ref, defineEmits, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";

const router = useRouter()
const emit = defineEmits(['next', 'prev'])
const $q = useQuasar()

const evento = ref({
    title: '',
    desc: '',
    address: '',
    contact: '',
    date: '',
    maps_loc: '',
    initial_time: '',
    final_time: '',
    img_url: '',
})

function openImgur() {
    window.open('https://imgur.com/', '_blank')
}

const goNext = () => {
    evento.value.date = evento.value.date.slice(0, 10)
    sessionStorage.setItem('eventoStep1', JSON.stringify(evento.value))
    emit('next')
}

const returnEventos = () => {
    router.push('/eventos')
}

const checkRequiredFields = () => {
    const { title, address, contact, date } = evento.value;

    // Verifica se algum campo obrigatório está vazio ou nulo
    if (!title || !address || !contact || !date) {
        return true;
    }
    // Converte a data do formato DD-MM-YYYY para um objeto Date no fuso horário local
    const [day, month, year] = date.slice(0, -6).split('-');
    const dataEventoDate = new Date(year, month - 1, day); // Mês é zero-indexado


    // Verifica se a data do evento é anterior ou igual à data de hoje
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0); // Zera as horas para comparar apenas as datas

    if (dataEventoDate < hoje) {
        // $q.notify({
        //     message: 'A data do evento não pode ser anterior à data de hoje',
        //     color: 'orange-8',
        //     position: 'top',
        //     icon: 'event_busy'
        // })
        return true;
    }

    return false;
}

function verImg(url) {
    window.open(url, '_blank')
}

const helpLocGoogle = () => {
    $q.notify({
        message: 'Para buscar a localização do seu evento acesse o Google Maps, pesquise o local do seu evento, clique em "Compartilhar" e depois em "Incorporar um mapa". Copie e cole o html(iframe) no campo localização.',
        color: 'blue-8',
        position: 'top',
        icon: 'pin_drop',
        timeout: 10000
    })
}

onMounted(() => {
    const es1Storage = sessionStorage.getItem('eventoStep1')
    const es1 = JSON.parse(es1Storage)
    if (es1) {
        evento.value = es1
    }
    window.scrollTo(0, 0);
})

</script>


<style scoped>
.title-1 {
    background: #efefef4d;
    backdrop-filter: blur(10px);
}

#date-picker {
    width: 20%;
}
</style>