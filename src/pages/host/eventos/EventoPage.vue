<template>
    <q-page class="animate__animated animate__fadeIn">
        <div v-if="evento != null" class="text-secondary q-pt-xs">
            <div class="w100">
                <q-btn @click="goTo('/host')" dense class="q-ml-sm" flat  icon="keyboard_return" label="voltar" color="secondary">
                </q-btn>
            </div>
            <div id="title" class="text-white q-pl-md">{{ evento.title }}</div>
            <div class="text-bold q-pb-sm q-pl-md">{{ evento.status }}</div>
            <div class="text-bold q-pl-md">🕑 {{ evento.date.replaceAll("-", "/") }} às {{ evento.initial_time +
                (evento.final_time ? (' - ' + evento.final_time) : null ) }}</div>
            <!-- <q-date id="date-picker" class="" v-model="evento.date" mask="DD-MM-YYYY HH:mm" :options="(date) => {
                    const today = new Date();
                    const yesterday = new Date(today);
                    yesterday.setDate(today.getDate());
                    const minDate = yesterday.toISOString().split('T')[0];
                    const mydate = new Date(date);
                    return mydate >= new Date(minDate);
                }" color="primary" /> -->
            <div class="q-card-wrapper">
                <q-card class="w100 q-mt-md q-mx-md">
                    <div id="title-menu" class="text-primary w100 q-pt-md text-center">
                        Informações do Evento
                    </div>
                    <q-btn @click="dialogImg = !dialogImg" label="Ver Banner" icon-right="search"
                        class="q-ml-md q-mt-md q-px-md" dense color="primary"></q-btn>
                    <q-dialog v-model="dialogImg">
                        <q-card>
                            <q-card-section>
                                <img :src="evento.img_url" class="w100" alt="Banner do Evento">
                            </q-card-section>
                            <q-card-actions align="right">
                                <q-btn flat label="OK" color="primary" v-close-popup />
                            </q-card-actions>
                        </q-card>
                    </q-dialog>
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
                        <div class="text-h6 text-primary q-mb-sm">Localização</div>
                        <iframe :src="evento.maps_loc" class="w100" height="450" style="border:0;" loading="lazy"
                            referrerpolicy="no-referrer-when-downgrade"></iframe>
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
                        <div class="text-h6 text-primary text-bold q-mb-md">Tipos de Ingressos</div>
                        <div v-for="ticket in evento.ticket_types" :key="ticket.id">
                            <div>{{ ticket.title }}</div>
                            <div>{{ 'R$ ' + ticket.price }}</div>
                            <hr>
                        </div>
                        <q-btn label="Editar Ingressos" icon-right="edit" color="primary" class="w100 q-mt-sm"></q-btn>
                        <q-btn label="Adicionar Ingressos" icon-right="add" color="blue-14" glossy
                            class="w100 q-mt-sm"></q-btn>
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
                    <q-btn label="Adicionar Subhost" icon-right="person_add" color="primary"
                    class="q-mb-md q-ml-md"></q-btn>
                </q-card>
            </div>
            <div class="w100 q-mt-md q-px-md">
                <q-btn class="w100 q-py-lg" label="Painel de Vendas" color="primary" glossy
                    icon-right="payments"></q-btn>
                <q-btn class="w100 q-py-md q-mt-md" label="Encerrar Evento" color="dark" glossy
                    icon-right="event_available"></q-btn>
                <q-btn class="w100 q-py-md q-mt-sm" label="Cancelar Evento" color="red" flat></q-btn>
            </div>
        </div>
    </q-page>
</template>

<script setup>
import { api } from 'src/boot/axios';
import { Utils } from 'src/utils/Utils';
import { onBeforeMount, onBeforeUnmount, ref } from 'vue';
import { useRouter } from 'vue-router';

const hostInfo = sessionStorage.getItem('host') ? JSON.parse(sessionStorage.getItem('host')) : null;

const evento = ref(null);
const dialogImg = ref(false);
const router = useRouter();

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

function goTo(path) {
    router.push(path);
}

onBeforeMount(async () => {
    await getEvento();
});

onBeforeUnmount(() => {
    sessionStorage.removeItem('evento');
});

</script>

<style scoped>
.q-page {
    width: 100vw
}

.q-card {
    width: 90vw;
}

@media (min-width: 1024px) {
    .q-page {
        width: 90%;
        margin: 0 auto;
    }

    .q-card-wrapper {
        display: flex;
        flex-direction: row;
        align-items: flex-start;
        justify-content: space-around;
    }

    .q-card {
        width: 30vw;
    }

}
</style>