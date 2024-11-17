<template>
    <q-page class="animate__animated animate__fadeIn bg-grad-7 q-pb-xl">
        <div class="relative bg-grey-4">
            <div
                class="title-1 w100 q-px-sm row items-center text-primary shadow-1 q-py-md justify-between no-wrap text-bold">
                <div class="row no-wrap items-center">
                    <q-icon size="sm" color="primary" name="paid" class="q-pr-sm" />
                    {{ Utils.formatCurrency(hostInfo.balance, 'brl') }}
                </div>
                <div class="row no-wrap items-center">
                    <div class="text-blue-7"> <strong class="high-opacity"></strong>
                        {{ hostInfo.name.toUpperCase() }}</div>
                    <q-icon size="sm" color="blue" name="diamond" class="q-pl-sm" />
                </div>
            </div>
        </div>
        <div id="title" class=" text-secondary q-mt-sm w100 text-center text-bold">Meus Eventos</div>
        <div class="q-ma-md">
            <q-input v-model="filter.title" label="Buscar Evento" filled  class="bg-white">
                <template v-slot:append>
                    <q-icon name="search" color="primary" size="md" @click="getEventos()"/>
                </template>
            </q-input>
            <q-toggle v-model="filter.inProgress" label="Em Andamento"  class="q-mt-xs q-mb-md text-white" />
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
            <div  v-if="!loading" class="w100 text-right text-secondary  q-mb-md text-bold">
                {{ rows.length > 0 ? (rows.length.toString() + ' evento(s) encontrado(s)🔎') : 'Nenhum evento encontrado🌃' }} 
            </div>
        </div>
    </q-page>
</template>

<script setup>
import { api } from 'src/boot/axios';
import { Utils } from 'src/utils/Utils';
import { onMounted, ref } from 'vue';

const hostInfo = sessionStorage.getItem('host') ? JSON.parse(sessionStorage.getItem('host')) : null;
const isMobile = window.innerWidth < 800 || document.documentElement.clientWidth < 800

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
        name: 'date',
        align: 'left',
        label: 'Data do Evento',
        field: 'date'
    },
    {
        name: 'available_tickets',
        align: 'left',
        label: 'Ingressos Disponíveis',
        field: 'available_tickets'
    },
    {
        name: 'package',
        label: 'Pacote',
        align: 'left',
        field: 'package'
    },
    {
        name: 'access',
        align: 'left',
        label: 'Acesso',
        field: 'access'
    },
    {
        name: 'status',
        align: 'left',
        label: 'Status',
        field: 'status'
    },

];

async function getEventos() {
    const reqObject = {
        host: {
            id: hostInfo.id,
            token: hostInfo.token,
        },
        isActiveEventsOnly: filter.value.inProgress,
        title: filter.value.title,
    }
    loading.value = true;
    await api.post('/host/events', reqObject).then((response) => {
        rows.value = response.data;
    }).catch((error) => {
        console.log(error);
    })
    .finally(() => {
        loading.value = false;
    });
}

onMounted(async () => {
    window.scrollTo(0, 0);
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
    position: sticky;
    top: 50px;
    background: #dacaff56;
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