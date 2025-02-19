<template>
    <div class="w100 bg-grey-4  rounded-borders shadow-4 relative">
        <div
            class=" w100 text-h6 row items-center text-primary shadow-1 q-mt-xl q-py-sm justify-center text-bold">
            NOVO EVENTO
            <q-icon size="md" color="primary" name="add_circle" class="q-pl-sm" />
        </div>
        <div class="q-mx-md column q-gutter-y-md q-mb-xl">
            <div class="text-center w100 text-secondary high-opacity text-bold q-pt-md">Preencha as informações para
                criação do seu
                evento, elas poderão ser editadas posteriormente:</div>
                <div class="w100 text-left text-primary text-bold">Campos Obrigatórios*</div>
            <q-input maxlength="50" outlined class="q-mt-lg bg-grey-3" v-model="evento.title" label="Título*">
                <template v-slot:append>
                    <q-btn flat icon="nightlife" color="primary" />
                </template>
            </q-input>
            <q-input maxlength="1000" outlined type="textarea" class="bg-grey-3" v-model="evento.desc" label="Descrição">
                <template v-slot:append>
                    <q-btn flat icon="info" color="primary" />
                </template>
            </q-input>
            <q-input maxlength="400" outlined type="textarea" class="bg-grey-3" v-model="evento.address" label="Endereço*">
                <template v-slot:append>
                    <q-btn flat icon="pin_drop" color="primary" />
                </template>
            </q-input>
            <q-input maxlength="200" outlined placeholder="Descreva o contato dos produtores do eventos" class="bg-grey-3" type="textarea" v-model="evento.contact" label="Contato*">
                <template v-slot:append>
                    <q-btn flat icon="phone" color="primary" />
                </template>
            </q-input>
            <div class="w100 row justify-center items-center no-wrap bg-grey-4 ">
                <q-input class="q-mr-sm bg-grey-4" id="times" label="Início"  placeholder="00:00" outlined v-model="evento.initial_time" mask="time" :rules="['time']">
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
                <q-input label="Final" outlined class="bg-grey-4" v-model="evento.final_time" placeholder="00:00" mask="time" :rules="['time']">
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
                <div class="w100 text-left q-pb-xs text-secondary" id="title-layout">Data do Evento*</div>
                <q-date id="date-picker" class="w100 row" v-model="evento.date" mask="DD-MM-YYYY HH:mm" :options="(date) => {
                    const today = new Date();
                    const yesterday = new Date(today);
                    yesterday.setDate(today.getDate());
                    const minDate = yesterday.toISOString().split('T')[0];
                    const mydate = new Date(date);
                    return mydate >= new Date(minDate);
                }" color="primary" />
            </div>
            <q-input placeholder="Clique no ícone ao lado para ajuda" class="bg-grey-3" maxlength="800" outlined v-model="evento.maps_loc"
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
  message: `
    Para buscar a localização do seu evento, acesse o Google Maps, pesquise o local do seu evento, clique em "Compartilhar" e depois em "Incorporar um mapa". Copie e cole o HTML (iframe) no campo localização.
    <br>
    <a target="_blank" href="/Manual-do-Produtor.pdf" class="q-btn q-btn-item q-btn--dense text-white q-px-md w100 q-my-md bg-primary">Ajuda</a>
    
  `,
  color: 'blue-8',
  position: 'top',
  icon: 'map',
  timeout: 5000,
  html: true // Permite inserir HTML no `message`
});
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