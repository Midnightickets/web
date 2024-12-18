<template>
    <q-layout view="hHh lpR lFr">

        <q-header class="bg-glass-2 text-white animate__animated animate__fadeInDown" height-hint="98">
            <q-toolbar>
                <q-toolbar-title class="row items-center">
                    <q-avatar>
                        <q-icon size="md" color="purple-1" name="local_activity" />
                    </q-avatar>
                    <a style="text-decoration: none;" id="title-layout"
                        class="text-purple-1 q-pl-xs text-bold">
                        Midnight Tickets
                    </a>
                </q-toolbar-title>

                <q-btn class="rounded-borders" size="md" label="menu" color="primary" glossy icon-right="menu"
                    @click="toggleRightDrawer" />
            </q-toolbar>

        </q-header>

        <q-drawer show-if-above v-model="rightDrawerOpen" side="right" class="bg-grad-1 relative">
            <div v-if="userInfo" class="w100">
                <div id="title-menu" class="text-center text-bold text-purple-1 q-pt-xl">
                    {{ Utils.convertStringToFirstAndLast(userInfo.name).toUpperCase() }}</div>
                <div class="text-center text-purple-1 mid-opacity text-bold q-mb-md q-pb-lg "><q-btn
                        @click="goTo({ to: '/me' })" label="Perfil" flat></q-btn></div>
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
                    <q-btn @click="Utils.logout()" class="z-index-999 absolute-bottom cursor-pointer q-py-sm" label="logout" icon-right="logout" color="secondary"></q-btn>
                </q-list>
                <div class="absolute-bottom w100  row no-wrap items-center justify-center q-mt-xl text-primary q-py-sm">
                    <div class="row items-center w100">
                        <q-btn class="w100 q-mb-xl" flat @click="rightDrawerOpen = !rightDrawerOpen" color="secondary">fechar menu</q-btn>
                        <!-- <q-btn label="logout" icon-right="logout" color="secondary" class="w100 q-mx-md" to="/" glossy></q-btn> -->
                    </div>
                </div>
            </div>
            <div v-if="!userInfo" class="w100 text-white text-bold row items-center justify-center q-mt-xl q-pt-xl">
                <a href="/" style="text-decoration: none;" id="title-layout"
                class="text-purple-1 text-bold row items-center q-mb-md">
                <q-icon size="md" class="q-pr-xs" color="purple-1" name="local_activity" />
                Midnight Tickets
                 </a>
                <div class="text-center text-grey-4 q-mb-md q-mx-md">
                    Faça Login para Comprar Ingressos e Encontrar Eventos
                </div>
                <q-btn class="q-my-lg q-pa-lg shadow-2" to="/login" color="secondary" glossy label="Iniciar Sessão" icon-right="login" />
                <q-btn class="q-mt-xl" to="/" flat label="Página Inicial" color="secondary" icon="home" />
            </div>
        </q-drawer>

        <q-page-container>
            <router-view />
        </q-page-container>

    </q-layout>
</template>

<script setup>
import { Utils } from 'src/utils/Utils';
import { computed, onBeforeUnmount, ref } from 'vue'
import { useRouter } from 'vue-router'

const userInfo = JSON.parse(sessionStorage.getItem('user'));

const rightDrawerOpen = ref(false)
const router = useRouter()
// const isMobile = window.innerWidth < 800


const menuOptions = ref({
    items: [
        // USER MENUS
        { label: 'Buscar Eventos', icon: 'travel_explore', to: '/', role: 'user' },
        { label: 'Meus Ingressos', icon: 'confirmation_number', to: '/me', role: 'user' },
    ]
})
function goTo(item) {
    router.push(item.to)
}

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