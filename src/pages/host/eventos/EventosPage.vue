<template>
    <q-page class="animate__animated animate__fadeIn bg-twitch q-pb-xl">
        <div class="relative bg-grey-4">
            <div
                class="title-1 w100 q-px-sm row items-center text-primary shadow-1 q-py-md justify-between no-wrap text-bold">
                <div class="row no-wrap items-center">
                    <q-icon size="sm" color="primary" name="paid" class="q-pr-sm" />
                    {{ Utils.formatCurrency(hostInfo.balance ? hostInfo.balance : 0, 'brl') }}
                </div>
                <div class="row no-wrap items-center">
                    <div class="text-blue-7"> <strong class="high-opacity"></strong>
                        {{ hostInfo.name.toUpperCase() }}</div>
                    <q-icon size="sm" color="blue" name="diamond" class="q-pl-sm" />
                </div>
            </div>
        </div>
        <div class="w100 q-pt-md"></div>
        <div id="title" class=" text-secondary q-pt-xl w100 text-center text-bold">Meus Eventos</div>
        <div class="w100 q-my-md q-pl-md">
            <q-btn class="q-pa-md text-bold" label="Novo Evento" glossy color="primary"
                to="/host/criar-evento" icon="event" icon-right="add" />
        </div>
        <div class="q-ma-md">
            <q-input v-model="filter.title" label="Buscar Evento" filled  class="bg-white">
                <template v-slot:append>
                    <q-icon name="search" class="cursor-pointer " color="primary" size="md" @click="getEventos()"/>
                </template>
            </q-input>
            <q-toggle color="green-13" v-model="filter.inProgress" :label="filter.inProgress ? 'Em Andamento' : 'Todos'" @update:model-value="getEventos()" class="q-mt-xs q-mb-md text-white" />
            <div v-if="loading" class="row w100 q-pb-xl justify-center">
                <q-spinner-ball color="primary" size="lg" />
                <q-spinner-ball color="primary" size="lg" />
                <q-spinner-ball color="primary" size="lg" />
            </div>
            <q-table v-if="!loading && rows.length > 0" no-data-label="Nenhum evento encontrado 🌆" separator="cell"
                class="my-sticky-column-table text-primary q-mb-md w100 text-bold" :rows="rows"
                :columns="columns">
                <template v-slot:body-cell-acoes="props">
                    <div class="column items-center justify-center q-gutter-y-xs q-py-sm">
                        <q-btn glossy icon="visibility" color="green-14"  @click="openMeuEventoPage(props.row.id)">
                            <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">
                                Gerenciar Evento
                            </q-tooltip>
                        </q-btn>
                    </div>
                </template>
                <template v-slot:body-cell-title="props">
                    <q-td :props="props">
                        <div class="q-gutter-y-xs q-py-sm">
                            {{ isMobile ? Utils.formatBigString(props.row.title) : props.row.title }}
                        </div>
                        <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">
                            {{ props.row.title }}
                        </q-tooltip>
                    </q-td>
                </template>
                <template v-slot:body-cell-pacote="props">
                    <q-td :props="props">
                        <div class="q-gutter-y-xs q-py-sm">
                            {{ props.row.package }} 
                        </div>
                    </q-td>
                </template>
            </q-table>

        </div>
    </q-page>
</template>

<script setup>
import { api } from 'src/boot/axios';
import { Utils } from 'src/utils/Utils';
import { onBeforeMount, ref } from 'vue';
import { useRouter } from 'vue-router';

const hostInfo = ref(null);
const isMobile = window.innerWidth < 800 || document.documentElement.clientWidth < 800


const router = useRouter();
const loading = ref(false);
const filter = ref({
    title: '',
    inProgress: true,
});

const rows = ref([]);

const columns = [
    {
        name: 'title',
        label: 'Evento',
        align: 'left',
        field: 'title'
    },
    {
        name: 'acoes',
        align: 'center',
        label: 'Ações',
        field: 'acoes'
    },
    {
        name: 'status',
        align: 'left',
        label: 'Status',
        field: 'status'
    },
    {
        name: 'package',
        label: 'Pacote',
        align: 'left',
        field: 'package'
    },
    {
        name: 'available_tickets',
        align: 'left',
        label: 'Ingressos Disponíveis',
        field: 'available_tickets'
    },
    {
        name: 'access',
        align: 'left',
        label: 'Acesso',
        field: 'access'
    },
    {
        name: 'date',
        align: 'left',
        label: 'Data do Evento',
        field: 'date'
    },
];

function openMeuEventoPage(evento_id) {
    sessionStorage.setItem('evento', evento_id);
    router.push('/host/evento');
}


async function getEventos() {
    const reqObject = {
        host: {
            id: hostInfo.value.id,
            token: hostInfo.value.token,
        },
        isActiveEventsOnly: filter.value.inProgress,
        title: filter.value.title,
    }
    loading.value = true;
    await api.post('/host/events', reqObject).then((response) => {
        rows.value = response.data;
    }).catch((error) => {
        console.log(error.data);
    })
    .finally(() => {
        loading.value = false;
    });
}

async function getSaldo() {
    const reqObject = {
            id: hostInfo.value.id,
    }
    await api.post('/host/get_saldo', reqObject).then((response) => {
        hostInfo.value.balance = response.data.balance;
        sessionStorage.setItem('host', JSON.stringify(hostInfo.value));
    }).catch((error) => {
        console.log(error.data);
    });
}

onBeforeMount(async () => {
    window.scrollTo(0, 0);
    hostInfo.value = sessionStorage.getItem('host') ? JSON.parse(sessionStorage.getItem('host')) : null
    await getSaldo();
    await getEventos();
})

</script>

<style scoped>
.q-page {
    min-height: 100vh;
}

.q-table {
    position: relative;
}

@media (min-width: 1100px) {
    .es1 {
        margin: 0px 100px;
    }
}

.title-1 {
    position: fixed;
    top: 50px;
    background: #fdfcffcc;
    backdrop-filter: blur(12px);
    z-index: 2;
}
</style>
<style lang="sass">
.my-sticky-column-table
  thead
    background-color: #c7afff

  thead tr:first-child th:first-child
    /* bg color is important for th; just specify one */
    background-color: #c7afff

  td:first-child
    background-color: #c7afff

  th:first-child,
  td:first-child
    position: sticky
    font-weight: bold
    left: 0
    z-index: 1
    border-right: 2px solid #5D0CE0
</style>