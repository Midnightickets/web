<template>
    <q-page>
            <div v-if="evento != null" class="text-secondary q-pt-md">
                <div id="title" class="text-h6 text-white q-mb-md q-pl-md">{{ evento.title }}</div>
                <div class="q-pb-md q-pl-md">{{ evento.status }}</div>
                <!-- <q-date id="date-picker" class="" v-model="evento.date" mask="DD-MM-YYYY HH:mm" :options="(date) => {
                    const today = new Date();
                    const yesterday = new Date(today);
                    yesterday.setDate(today.getDate());
                    const minDate = yesterday.toISOString().split('T')[0];
                    const mydate = new Date(date);
                    return mydate >= new Date(minDate);
                }" color="primary" /> -->
                <q-card class="w100 q-mx-md">
                    <div id="title-menu" class="text-primary w100 q-pt-md text-center">
                            Informações do Evento
                    </div>
                    <q-card-section>
                        <div class="text-h6 text-primary">Descrição</div>
                        <div>{{ evento.desc }}</div>
                    </q-card-section>
                    <q-card-section>
                        <div class="text-h6 text-primary">Endereço</div>
                        <div>{{ evento.address }}</div>
                    </q-card-section>
                    <q-card-section>
                        <div class="text-h6 text-primary">Contato</div>
                        <div>{{ evento.contact }}</div>
                    </q-card-section>
                    <q-card-section>
                        <div class="text-h6 text-primary">Hora e Data do Evento</div>
                        <div>{{ evento.date.replaceAll("-", "/") }} às {{ evento.initial_time }}</div>
                    </q-card-section>
                </q-card>
                <q-card class="w100 q-mx-md q-mt-md">
                    <div id="title-menu" class="text-primary w100 q-pt-md text-center">
                            Pacote de Ingressos
                    </div>
                    <q-card-section>
                        <div class="text-h6 text-primary">Pacote</div>
                        <div>{{ evento.package }}</div>
                    </q-card-section>
                    <q-card-section>
                        <div class="text-h6 text-primary">Ingressos Disponíveis</div>
                        <div>{{ evento.available_tickets }}</div>
                    </q-card-section>
                    <q-card-section>
                        <div class="text-h6 text-primary q-mb-sm">Tipos de Ingressos</div>
                        <div v-for="ticket in evento.ticket_types" :key="ticket.id">
                            <div>{{ ticket.title }}</div>
                            <div>{{ 'R$ ' + ticket.price }}</div>
                            <hr>
                        </div>
                    </q-card-section>
                </q-card>
                <q-card class="w100 q-mx-md q-mt-md">
                    <div id="title-menu" class="text-primary w100 q-pt-md text-center">
                            Acesso
                    </div>
                    <q-card-section>
                        <div class="text-h6 text-primary">Subhosts Cadastrados</div>
                        <div>{{ evento.subhosts.length }}</div>
                    </q-card-section>
                </q-card>
            </div>
    </q-page>
</template>

<script setup>
import { api } from 'src/boot/axios';
import { Utils } from 'src/utils/Utils';
import { onBeforeMount, onBeforeUnmount, ref } from 'vue';

const hostInfo = sessionStorage.getItem('host') ? JSON.parse(sessionStorage.getItem('host')) : null;

const evento = ref(null);

async function getEvento() {
    const reqObject = {
        host: {
            id: hostInfo.id,
            token: hostInfo.token
        },
        event: sessionStorage.getItem('evento')
    }
    await api.post('/host/event', reqObject)
        .then(response => {
            evento.value = response.data;
        })

}

onBeforeMount(async () => {
    await getEvento();
});

onBeforeUnmount(() => {
    sessionStorage.removeItem('evento');
});

</script>

<style scoped>
.q-page{
    width: 100vw
}

.q-card{
    width: 90vw;
}

@media (min-width: 1024px) {
    .q-card{
        width: 30vw;
    }
    
}

</style>