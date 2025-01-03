<template>
    <q-page v-if="hostInfo" class="animate__animated animate__fadeIn bg-grey-4 q-pb-xl">
        <div class="relative bg-grey-4">
            <div
                class="title-1 w100 q-px-sm row items-center text-primary shadow-1 q-py-md justify-between no-wrap text-bold">
                <div class="row no-wrap items-center">
                    <q-icon size="sm" color="primary" name="paid" class="q-pr-sm" />
                    {{ Utils.formatCurrency(hostInfo.balance ? hostInfo.balance : 0, 'brl') }}
                </div>
                <div class="row no-wrap items-center" v-if="hostInfo.balance" >
                        <q-btn v-if="hostInfo.balance > 0" @click="window.location.reload()" color="blue-14" label="atualizar" glossy icon-right="currency_exchange"  />
                </div>
            </div>
        </div>
        <div class="w100 q-pt-lg"></div>
        <div id="title" class=" text-primary q-pt-xl w100 text-center text-bold">Meus Eventos</div>
        <div class="w100 q-my-md q-pl-md">
            <q-btn class="q-pa-md text-bold" label="Novo Evento" glossy color="green-14"
                to="/host/criar-evento" icon="event" icon-right="add" />
        </div>
        <div class="q-ma-md">
            <div class="rounded-borders">
                <q-input v-model="filter.title" class="rounded-borders bg-white buscar-input" label="Buscar Evento" outlined  >
                    <template v-slot:append>
                        <q-btn color="primary" glossy icon-right="search" class="cursor-pointer " @click="getEventos ()" label="buscar"></q-btn>
                    </template>
                </q-input>
            </div>
            <q-toggle color="secondary" v-model="filter.inProgress" :label="filter.inProgress ? 'Em Andamento' : 'Todos'" @update:model-value="getEventos()" class="q-mt-xs q-mb-md text-bold text-secondary" />
            <div v-if="loading" class="row w100 q-pb-xl justify-center">
                <q-spinner-ball color="secondary" size="lg" />
                <q-spinner-ball color="secondary" size="lg" />
                <q-spinner-ball color="secondary" size="lg" />
            </div>
            <q-table v-if="!loading" no-data-label="Nenhum Evento Encontrado" separator="cell"
                class="my-sticky-column-table text-primary q-mb-md w100 text-bold" :rows="rows"
                :columns="columns">
                <template v-slot:body-cell-acoes="props">
                    <div class="column items-center justify-center q-gutter-y-xs q-py-sm">
                        <q-btn glossy :icon="props.row.status.includes('andamento')? 'edit' : 'visibility'" color="primary"  @click="openMeuEventoPage(props.row.id)">
                            <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">
                                Gerenciar Evento
                            </q-tooltip>
                        </q-btn>
                        <q-btn glossy icon="payments" color="orange">
                            <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">
                                Painel de Vendas
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
                <template v-slot:body-cell-profit="props">
                    <q-td :props="props">
                            {{ Utils.formatCurrency(props.row.profit, 'brl') }} 
                    </q-td>
                </template>
            </q-table>

        </div>
    </q-page>
</template>

<script setup>
import { api } from 'src/boot/axios';
import { Utils } from 'src/utils/Utils';
import { onBeforeMount, onMounted, ref } from 'vue';
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
        name: 'date',
        align: 'left',
        label: 'Data do Evento',
        field: 'date'
    },
    {
        name: 'profit',
        label: 'Faturamento',
        align: 'left',
        field: 'profit'
    },
    {
        name: 'access',
        align: 'left',
        label: 'Acesso',
        field: 'access'
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
        if(response.data.message) {
            console.log(response.data.message);
            rows.value = [];
            return
        } else {
            rows.value = response.data;
        }
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
        hostInfo.value.balance = response.data;
        sessionStorage.setItem('host', JSON.stringify(hostInfo.value));
    }).catch((error) => {
        console.log(error.data);
    });
}

onMounted( () => {
    window.scrollTo(0, 0);
})

onBeforeMount(async () => {
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
    .buscar-input{
        width: 40%;
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