<template>
    <q-layout view="hHh lpR lFr">

        <q-header class="bg-glass-2 text-white animate__animated animate__fadeInDown" height-hint="98">
            <q-toolbar>
                <q-toolbar-title class="row items-center">
                    <q-avatar>
                        <q-icon size="md" color="purple-1" name="local_activity" />
                    </q-avatar>
                    <a  v-if="userInfo" style="text-decoration: none;" id="title-layout"
                        class="text-purple-1 q-pl-xs text-bold">
                        {{ userInfo.login }}
                    </a>
                    <a  v-else style="text-decoration: none;" id="title-layout"
                        href="/me" class="text-purple-1 q-pl-xs text-bold">
                        Midnight Tickets
                    </a>
                </q-toolbar-title>

                <q-btn class="rounded-borders" size="md" :label="isMobile ? null :'menu'" color="primary" glossy icon-right="menu"
                    @click="toggleRightDrawer" />
            </q-toolbar>

        </q-header>

        <q-drawer show-if-above v-model="rightDrawerOpen" side="right" class="bg-grad-1 relative">
            <div v-if="userInfo" class="w100">
                <div class="w100 text-center q-pt-lg">
                    <q-btn to="/" style="text-decoration: none;"
                    class="text-purple-1 text-bold"> 
                    <q-icon size="md" class="q-pr-xs q-pb-xs" color="purple-1" name="local_activity" />
                    Midnight Tickets
                    </q-btn>
                </div>
                <div id="title-menu" class="text-center text-bold text-purple-1 q-pt-xl">
                    {{ Utils.convertStringToFirstAndLast(userInfo.name).toUpperCase() }}</div>
                <div class="text-center text-purple-1 mid-opacity text-bold q-mb-md q-pb-lg "><q-btn
                        to="/me/perfil" label="Perfil Usuário" flat></q-btn></div>
                <q-list class="text-bold text-white">
                    <q-input placeholder="Digite o nome da produtor(a)" label="Buscar Produtor(a)" filled class="bg-grey-2 rounded-borders shadow-1 q-mb-md" :class="search.length >= 3 ? '' : 'q-mx-md'" v-model="search">
                        <template v-slot:prepend>
                            <q-icon name="search"  :color="search.length < 3 ? 'grey-7' : 'primary'" />
                        </template>
                        <template v-slot:append>
                            <q-btn @click="searchHost()" glossy color="primary" class="" label="buscar" v-if="search.length >= 3" />
                        </template>
                    </q-input>
                    <q-item v-for="item in menuOptions.items" :key="item.label" clickable @click="goTo(item)"
                        style="border-radius: 8px;"
                        class="q-mt-md q-mx-md text-blue-2 shadow-2 bg-twitch-rev">
                        <q-item-section avatar>
                            <q-icon :name="item.icon" color="secondary" />
                        </q-item-section>
                        <q-item-section>
                            <q-item-label  class="text-grey-4">{{ item.label
                                }}</q-item-label>
                        </q-item-section>
                    </q-item>
                    <q-btn @click="Utils.logout()" class="z-index-999 absolute-bottom cursor-pointer q-py-md" label="Sair" icon-right="logout" color="secondary"></q-btn>
                </q-list>
                <div class="absolute-bottom w100  row no-wrap items-center justify-center q-mt-xl text-primary q-py-sm">
                    <!-- <div class="row items-center w100">
                        <q-btn class="w100 q-mb-xl" flat @click="rightDrawerOpen = !rightDrawerOpen" color="secondary">fechar menu</q-btn>
                    </div> -->
                </div>
            </div>
            <div v-if="!userInfo" class="w100 text-white text-bold row items-center justify-center q-mt-xl q-pt-xl">
                <a href="/" style="text-decoration: none;" id="title-layout"
                class="text-purple-1 text-bold row items-center q-mb-md">
                <q-icon size="md" class="q-pr-xs" color="purple-1" name="local_activity" />
                Midnight Tickets
                 </a>
                <div class="text-center text-grey-4 q-mb-md q-mx-md">
                    Faça Login para comprar ingressos e encontrar eventos
                </div>
                <q-btn class="q-my-lg q-pa-lg shadow-2" to="/login" color="secondary" glossy label="Iniciar Sessão" icon-right="login" />
                <q-btn class="q-mt-xl" to="/" flat label="Página Inicial" glossy icon="home" />
            </div>
        </q-drawer>
        <q-dialog v-model="produtoresDialog">
            <div v-if="loading" class="w100 bg-grey-2">
                <div v-if="loading" class="row w100 q-py-sm q-mt-xs justify-center">
                    <q-spinner-ball color="secondary" size="lg" />
                    <q-spinner-ball color="secondary" size="lg" />
                    <q-spinner-ball color="secondary" size="lg" />
                </div>
            </div>
            <div class="bg-grey-2" v-else>
                <q-card class="bg-grey-2" style="max-width: 400px;">
                    <q-card-section class="bg-grey-2">
                        <q-card-title class="text-primary" id="title-2">Produtores</q-card-title>
                    </q-card-section>
                    <q-separator />
                    <q-card-section class="bg-grey-2">
                        <q-list>
                            <q-item v-for="produtor in produtores" :key="produtor.id" clickable class="bg-grey-4 rounded-borders shadow-1" style="border-left: 4px solid #6310e1" @click="Utils.goToHost(produtor.id)">
                                <q-item-section avatar>
                                    <img :src="produtor.img_url" class="q-pa-xs" width="80px" style="border-radius: 50%;" />
                                </q-item-section>
                                <q-item-section>
                                    <q-item-label class="text-primary text-bold">{{ Utils.toCamelCase(produtor.name) }}</q-item-label>
                                    <q-item-label class="text-primary">{{ Utils.toCamelCase(produtor.login) }}</q-item-label>
                                </q-item-section>
                                <q-item-section side>
                                    <q-btn icon="chevron_right" color="secondary" size="md" :to="'/' + produtor.login" />
                                </q-item-section>
                            </q-item>
                        </q-list>
                    </q-card-section>
                    <q-card-actions align="right">
                        <q-btn flat label="Fechar" color="secondary" @click="produtoresDialog = false" />
                    </q-card-actions>
                </q-card>
            </div>
        </q-dialog>
        <q-page-container class="relative w100 bg-grad-4 ">
            <!-- <div v-if="!userInfo" class="w100 text-white text-bold row items-center wrap w100 justify-center q-gutter-y-sm q-gutter-x-md  q-pt-lg">
                <a href="/" style="text-decoration: none;" id="title-2"
                class="text-white  text-shadow text-bold row items-center q-mb-sm">
            </a>
                <q-btn class=" q-pa-lg shadow-2" to="/login" color="green-14" glossy label="Entre ou cadastre-se agora!" icon-right="login" />
                <div class="w100 q-pt-xs q-my-md mid-opacity bg-secondary rounded-borders">

                </div>
            </div> -->
            <router-view />
            <footer class="w100 row wrap justify-center items-center q-py-xl bg-primary q-px-xl">
                <div class=" column q-py-md">
                    <q-btn label="Encontre eventos" to="/" class="text-grey-5" flat></q-btn>
                    <q-btn label="Suporte ao usuário" @click="goToBlank('/Manual-do-Usuario.pdf')" class="text-grey-5" flat></q-btn>
                </div>
                <div class="w100 q-pt-xs bg-secondary rounded-borders"></div>
                <div class="column q-py-md items-center">
                    <q-btn label="termos de uso" to="/termos-de-uso" class="text-grey-5" flat></q-btn>
                    <q-btn label="email" @click="alertar('midnightickets@gmail.com')" class="text-grey-5" flat></q-btn>
                    <q-btn label="instagram" @click="goToBlank('https://www.instagram.com/midnightickets')" class="text-grey-5" flat></q-btn>
                    <q-btn label="desenvolvedor" @click="goToBlank('https://samuelvictorol.github.io/portfolio')" class="text-grey-5" flat></q-btn>
                </div>
                <div class="w100 row q-pt-xl items-center justify-start text-secondary" id="title-layout">
                    Midnight Tickets 
                </div>
            </footer>
        </q-page-container>

    </q-layout>
</template>

<script setup>
import { useQuasar } from 'quasar';
import { api } from 'src/boot/axios';
import { Utils } from 'src/utils/Utils';
import { onBeforeMount, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const userInfo = JSON.parse(sessionStorage.getItem('user'));
const isMobile = window.innerWidth < 800
const rightDrawerOpen = ref(false)
const router = useRouter()
const search = ref('')
// const isMobile = window.innerWidth < 800
const route = ref('')
const produtoresDialog = ref(false)
const loading = ref(false)
const produtores = ref([])
onBeforeMount(() => {
    sessionStorage.removeItem('isHost')
    
})
const $q = useQuasar()

async function searchHost() {
    produtoresDialog.value = true
    loading.value = true
    const req = {
        titleEventOrHostName: search.value.trim(),
        isByHostName: true
    }
    await api.post('/host/public_events', req).then((response) => {
        if (response.data.length === 0) {
            $q.notify({
                message: 'Nenhum resultado encontrado para sua busca',
                color: 'secondary',
                position: 'top',
                icon: 'event',
            });
            produtoresDialog.value = false
        } else {
            produtores.value = response.data
        }
    }).catch(() => {
        $q.notify({
            message: 'Erro ao buscar eventos',
            color: 'orange-14',
            position: 'top',
            icon: 'event',
        });
    }).
    finally(() => {
        loading.value = false
    })
}

function alertar(msg) {
    alert(msg)
}

function goToBlank(url) {
    window.open(url, '_blank');
}

const menuOptions = ref({
    items: [
        // USER MENUS
        { label: 'Página Inicial', icon: 'home', to: '/', role: 'user' },
        { label: 'Meus Ingressos', icon: 'confirmation_number', to: '/me', role: 'user' },
        { label: 'Minhas Compras', icon: 'paid', to: '/me/tickets', role: 'user' },
    ]
})
function goTo(item) {
    router.push(item.to)
}

const toggleRightDrawer = () => {
    rightDrawerOpen.value = !rightDrawerOpen.value
}


function openInstagramMidnightickets() {
    window.open('https://www.instagram.com/midnightickets', '_blank')
}

</script>
<style scoped>
.bg-purple-2 {
    background-color: #8025e22b !important;
}

.shadow-inset {
    box-shadow: inset 0 0 96px 0 rgba(0, 0, 0, 0.552);
}
</style>