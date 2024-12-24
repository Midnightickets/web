<template>
  <q-page class="text-white q-pb-xl">
    <div id="title" class="q-pt-sm w100 text-center">
        Usuários
    </div>
    <div id="users" v-if="users.length > 0" class="w100 q-px-md q-mt-md rounded-borders">
        <q-list  class="row justify-center items-center q-gutter-md">
            <div id="title-layout" class="w100 justify-center items-center text-secondary">
                {{ users.length }} usuários encontrado(s)
            </div>
            <q-card style="border-left: 4px solid #9573f3;" v-for="user in users" :key="user.id" class="bg-grey-4 rounded-borders text-bold">
                <q-card-section>
                    <q-item-label id="title-2" class="text-primary">
                        {{ user.login }}
                    </q-item-label>
                </q-card-section>
                <q-card-section v-if="user.name" class="w100 bg-grey-6">
                    {{ user.name }}
                </q-card-section>
                <q-card-section class="w100">
                    <q-btn  label="ver usuário" color="green-14" glossy class="w100" icon-right="visibility"></q-btn>
                </q-card-section>
            </q-card>
        </q-list>
    </div>
</q-page>
</template>

<script setup>
import { useQuasar } from 'quasar';
import { api } from 'src/boot/axios';
import { onBeforeMount, onMounted, ref } from 'vue';

const $q = useQuasar()

const users = ref([])

onMounted(async () => {
    await buscarUsers()
})

const buscarUsers = async () => {
    const admin = JSON.parse(sessionStorage.getItem('admin'))
    let req = {
        admin: {
            token: admin.token,
            login: admin.login,
        },
        getter: 'users',
    }
    await api.post('/admin/getAllUsersOrHostsResumed', req).then((response) => {
        if(response.data.length === 0) {
            $q.notify({
                color: 'secondary',
                icon: 'info',
                message: 'Nenhum Usuário Encontrado',
                position: 'top',
                timeout: 2500,
            })
            return
        }
        users.value = response.data.reverse()
    }).catch((error) => {
        $q.notify({
            color: 'orange-14',
            message: error.response.data.message,
            position: 'top',
            timeout: 2500,
        })
    })
}

</script>

<style scoped>
.q-input, .q-select {
    width: 80vw;
}
@media (min-width: 800px) {
    .q-input {
        width: 24vw;
    }
    .q-select {
        width: 35vw;
    }
    .q-card {
        width: 30vw;
    }
}

</style>