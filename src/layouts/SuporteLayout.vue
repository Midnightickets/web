<template>
    <q-layout view="hHh lpR lFr">

        <q-header class="bg-grad-2 text-white animate__animated animate__fadeInDown" height-hint="98">
            <q-toolbar>
                <q-toolbar-title class="row items-center">
                    <q-avatar>
                        <q-icon size="md" color="purple-1" name="local_activity" />
                    </q-avatar>
                    <a style="text-decoration: none;" id="title-layout"
                        class="text-purple-1 q-pl-xs text-bold">
                        Suporte Midnight Tickets
                    </a>
                </q-toolbar-title>

                <q-btn class="rounded-borders" size="md" :label="isMobile ? null :'menu'" color="primary" glossy icon-right="menu"
                    @click="toggleRightDrawer" />
            </q-toolbar>

        </q-header>

        <!-- <q-drawer show-if-above v-model="rightDrawerOpen" side="right" class="bg-dark relative">
            <div v-if="adminInfo" class="w100">
                <q-list class="q-pt-md text-bold text-white">
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
                    <q-btn @click="Utils.logout()" class="z-index-999 absolute-bottom cursor-pointer q-py-md" label="logout" icon-right="logout" color="secondary"></q-btn>
                </q-list>
                <div class="absolute-bottom w100  row no-wrap items-center justify-center q-mt-xl text-primary q-py-sm">
                    <div class="row items-center w100 q-mb-md">
                        <q-btn class="w100 q-mb-xl" flat @click="rightDrawerOpen = !rightDrawerOpen" color="secondary">fechar menu</q-btn>
                        <q-btn label="logout" icon-right="logout" color="secondary" class="w100 q-mx-md" to="/" glossy></q-btn> -->
                    <!-- </div>
                </div>
            </div>
            <div v-if="!adminInfo" class="w100 text-white text-bold row items-center justify-center q-mt-xl q-pt-xl">
                <a href="/" style="text-decoration: none;" id="title-layout"
                class="text-purple-1 text-bold row items-center q-mb-md">
                <q-icon size="md" class="q-pr-xs" color="purple-1" name="local_activity" />
                Midnight Tickets
                 </a>
                <div class="text-center text-grey-4 q-mb-md q-mx-md">
                    Faça Login para gerenciar o Midnight Tickets 
                </div>
                <q-btn class="q-mt-xl" to="/admin-auth" flat label="Página Inicial" color="dark" icon="login" />
            </div>
        </q-drawer> -->

        <q-page-container class="relative bg-grey-4" style="height: 100vh;">
            <div id="title" class="w100 text-center q-py-md text-primary">
                Em desenvolvimento...
            </div>
            <q-btn to="/" label="página inicial" icon-right="home" color="primary" glossy></q-btn> 
            
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


// const menuOptions = ref({
//     items: [
//         // USER MENUS
//         { label: 'Logs Recentes', icon: 'notifications', to: '/admidnightickets', role: 'admin' },
//         { label: 'Buscar Logs', icon: 'search', to: '/admidnightickets/buscar-logs', role: 'admin' },
//         { label: 'Buscar Pagamento', icon: 'account_balance', to: '/admidnightickets/buscar-pagamento', role: 'admin' },
//         { label: 'Produtores', icon: 'diamond', to: '/admidnightickets/hosts', role: 'admin' },
//         { label: 'Usuários', icon: 'groups', to: '/admidnightickets/users', role: 'admin' },
//         { label: 'Suporte', icon: 'support', to: '#', role: 'admin' },
//     ]
// })


const toggleRightDrawer = () => {
    rightDrawerOpen.value = !rightDrawerOpen.value
}



</script>
<style scoped>

</style>