<template>
    <q-layout view="hHh lpR lFr">

        <q-header v-if="hostInfo" class="bg-grad-1 text-white" height-hint="98">
            <q-toolbar>
                <q-toolbar-title class="row items-center">
                    <q-avatar>
                        <q-icon size="md" color="purple-1" name="local_activity" />
                    </q-avatar>
                    <a @click="goTo('/app')" style="text-decoration: none;" id="title-layout"
                        class="text-purple-1 q-pl-xs text-bold">
                        Área do Produtor
                    </a>
                </q-toolbar-title>

                <q-btn class="rounded-borders" size="md" label="menu" color="primary" glossy icon-right="menu"
                    @click="toggleRightDrawer" />
            </q-toolbar>

            <!-- <q-tabs align="center" v-if="!isMobile">
            <q-route-tab class="text-purple-1" to="/app" label="Perfil" />
            <q-route-tab class="text-purple-1" v-if="isAuthenticated && isHost" to="/evento" label="Eventos" />
        </q-tabs> -->
        </q-header>

        <q-drawer v-if="hostInfo" show-if-above v-model="rightDrawerOpen" side="right" class="bg-dark relative">
            <div v-if="isAuthenticated" class="w100 flex q-mb-md flex-center q-mt-lg">
                <q-avatar style="width:155px;height:150px;" class="shadow-2">
                    <img v-if="hostInfo.img_url" :src="hostInfo.img_url" style="border-bottom: 4px solid #802DE0;object-fit: cover;width: 100%;height: 100%;" alt="">
                    <q-icon v-else name="account_circle" size="100px" color="purple-1" />
                </q-avatar>
            </div>
            <div id="title-menu" v-if="isHost" class="text-center q-px-sm text-bold text-purple-1">
                {{ Utils.convertStringToFirstAndLast(hostInfo.name).toUpperCase() }}</div>
            <div v-if="isAuthenticated" class="text-center text-purple-1 mid-opacity text-bold q-mb-md "><q-btn
                    @click="goTo({ to: '/host/me' })" label="Perfil" flat></q-btn></div>
            <q-list v-if="isAuthenticated" class="text-bold text-white" >
                <q-item v-for="item in menuOptions.items" :key="item.label" clickable @click="goTo(item)"
                    style="border-radius: 8px;"
                    class="q-mt-md q-mx-md text-blue-2 shadow-2 bg-grad-4">
                    <q-item-section avatar>
                        <q-icon :name="item.icon" color="grey-4" />
                    </q-item-section>
                    <q-item-section>
                        <q-item-label  class="text-grey-4">{{ item.label
                            }}</q-item-label>
                    </q-item-section>
                </q-item>
                <q-btn @click="Utils.logout()" class="z-index-999 absolute-bottom cursor-pointer q-py-md" label="Sair" icon-right="logout" color="secondary"></q-btn>
            </q-list>
            <div v-if="!isAuthenticated" class="w100 text-white text-bold row items-center justify-center q-mt-xl">
                <div class="text-center q-mb-md q-mx-md">
                    Registre-se ou Faça Login para ter acesso aos seus Eventos e Ingressos!!
                </div>
                <q-btn v-if="!isAuthenticated" class="q-mt-lg" to="/" label="Página Inicial" color="primary"
                    icon="home" />
            </div>
            <!-- <div class="absolute-bottom w100  row no-wrap items-center justify-center q-mt-xl text-primary q-py-sm">
                <div class="row items-center w100">
                    <q-btn class="w100 q-mb-xl" flat @click="rightDrawerOpen = !rightDrawerOpen" color="secondary">fechar menu</q-btn>
                </div>
            </div> -->
        </q-drawer>

        <q-page-container>
            <router-view />
            <footer class="w100 row wrap justify-center items-center q-py-xl bg-primary q-px-xl">
                <div class=" column q-py-md">
                    <q-btn label="Crie seu evento" to="/login-host" class="text-grey-5" flat></q-btn>
                    <q-btn label="Valide ingressos" to="/login-subhost" class="text-grey-5" flat></q-btn>
                    <q-btn label="Encontre eventos" to="/" class="text-grey-5" flat></q-btn>
                    <q-btn label="Suporte ao produtor" @click="goToBlank('/Manual-do-Produtor.pdf')" class="text-grey-5" flat></q-btn>
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
import { Utils } from 'src/utils/Utils';
import { computed, onBeforeMount, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const hostInfo = JSON.parse(sessionStorage.getItem('host'));

const isHost = computed(() => hostInfo != null);
const isAuthenticated = computed(() => sessionStorage.getItem('isHost'));

const $q = useQuasar()
const rightDrawerOpen = ref(false)
const router = useRouter()
// const isMobile = window.innerWidth < 800


const menuOptions = ref({
    items: [
        // HOST MENUS
        { label: 'Eventos', icon: 'calendar_month', to: '/host', role: 'host' },
        { label: 'Acessos', icon: 'sensor_occupied', to: '/host/acessos', role: 'host' },
        { label: 'Saques', icon: 'currency_exchange', to: '/host/saques', role: 'host' },
        // { label: 'Suporte', icon: 'support_agent', to: 'https://samuelvictorol.github.io/portfolio/contato', selected: false },
    ]
})

function goToBlank(url) {
    window.open(url, '_blank');
}


function goTo(item) {
    router.push(item.to)
}

function alertar(msg) {
    alert(msg)
}

function cleanSessionStorage() {
    sessionStorage.clear()
}

onBeforeUnmount(() => {
    cleanSessionStorage()
})

onMounted(() => {
    if(!hostInfo) {
        $q.notify({
            color: 'blue-14',
            textColor: 'white',
            icon: 'update',
            message: 'Sessão expirada, faça login novamente',
            position: 'top',
            timeout: 3000
        })
        router.push('/login-host')
    }
})

const toggleRightDrawer = () => {
    rightDrawerOpen.value = !rightDrawerOpen.value
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