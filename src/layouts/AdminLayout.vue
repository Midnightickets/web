<template>
    <q-layout view="hHh lpR lFr">

        <q-header class="bg-dark text-white animate__animated animate__fadeInDown" height-hint="98">
            <q-toolbar>
                <q-toolbar-title class="row items-center">
                    <q-avatar>
                        <q-icon size="md" color="purple-1" name="local_activity" />
                    </q-avatar>
                    <a style="text-decoration: none;" id="title-layout"
                        class="text-purple-1 q-pl-xs text-bold">
                        ADMINISTRADOR
                    </a>
                </q-toolbar-title>

                <q-btn class="rounded-borders" size="md" :label="isMobile ? null :'menu'" color="primary" glossy icon-right="menu"
                    @click="toggleRightDrawer" />
            </q-toolbar>

        </q-header>

        <q-drawer show-if-above v-model="rightDrawerOpen" side="right" class="bg-dark relative">
            <div v-if="adminInfo" class="w100">
                <div class="w100 text-center q-pt-sm bg-grad-3 q-pb-sm">
                    <q-btn @click="openInstagramMidnightickets()"  style="text-decoration: none;"
                    class="text-purple-1 text-bold"> 
                    <q-icon size="md" class="q-pr-xs q-pb-xs" color="purple-1" name="local_activity" />
                    Midnight Tickets
                    </q-btn>
                </div>
                <q-list class="text-bold text-white">
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
                    <q-btn @click="Utils.logout()" class="z-index-999 absolute-bottom cursor-pointer q-py-md" label="logout" icon-right="logout" color="secondary"></q-btn>
                </q-list>
                <div class="absolute-bottom w100  row no-wrap items-center justify-center q-mt-xl text-primary q-py-sm">
                    <div class="row items-center w100 q-mb-md">
                        <q-btn class="w100 q-mb-xl" flat @click="rightDrawerOpen = !rightDrawerOpen" color="secondary">fechar menu</q-btn>
                        <!-- <q-btn label="logout" icon-right="logout" color="secondary" class="w100 q-mx-md" to="/" glossy></q-btn> -->
                    </div>
                </div>
            </div>
            <div v-if="!adminInfo" class="w100 text-white text-bold row items-center justify-center q-mt-xl q-pt-xl">
                <a href="/" style="text-decoration: none;" id="title-layout"
                class="text-purple-1 text-bold row items-center q-mb-md">
                <q-icon size="md" class="q-pr-xs" color="purple-1" name="local_activity" />
                Midnight Tickets
                 </a>
                <div class="text-center text-grey-4 q-mb-md q-mx-md">
                    Faça Login para Comprar Ingressos e Acompanhar seus Eventos
                </div>
                <q-btn class="q-my-lg q-pa-lg shadow-2" to="/login" color="secondary" glossy label="Iniciar Sessão" icon-right="login" />
                <q-btn class="q-mt-xl" to="/" flat label="Página Inicial" color="secondary" icon="home" />
            </div>
        </q-drawer>

        <q-page-container class="relative">
            <div v-if="!adminInfo" class="w100 text-white text-bold row items-center wrap q-px-md justify-center q-gutter-y-sm q-gutter-x-md  q-pt-lg">
                <a href="/admin-auth" style="text-decoration: none;" id="title-2"
                class="text-grey-4 text-bold row items-center q-mb-sm">
                <q-icon size="md" class="q-pr-xs" color="secondary" name="local_activity" />
                Midnight Tickets
                 </a>
                <q-btn class=" q-pa-lg shadow-2" to="/admin-auth" color="primary" glossy label="Iniciar Sessão" />
                <div class="w100 q-pt-xs q-my-md mid-opacity bg-secondary rounded-borders">

                </div>
            </div>
            <router-view v-if="adminInfo"  />
        </q-page-container>

    </q-layout>
</template>

<script setup>
import { Utils } from 'src/utils/Utils';
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const adminInfo = JSON.parse(sessionStorage.getItem('admin'));
const isMobile = window.innerWidth < 800
const rightDrawerOpen = ref(false)
const router = useRouter()
// const isMobile = window.innerWidth < 800


const menuOptions = ref({
    items: [
        // USER MENUS
        { label: 'Logs Recentes', icon: 'notifications', to: '/admidnightickets', role: 'admin' },
        { label: 'Buscar Logs', icon: 'search', to: '/admidnightickets/buscar-logs', role: 'admin' },
        { label: 'Usuários', icon: 'groups', to: '/admidnightickets/users', role: 'admin' },
        { label: 'Produtores', icon: 'diversity_3', to: '/admidnightickets/hosts', role: 'admin' },
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

onBeforeUnmount(() => {
    sessionStorage.clear()
    localStorage.clear()
})

</script>
<style scoped>
.bg-purple-2 {
    background-color: #8025e22b !important;
}

.shadow-inset {
    box-shadow: inset 0 0 96px 0 rgba(0, 0, 0, 0.552);
}
</style>