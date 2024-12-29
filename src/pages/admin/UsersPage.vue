<template>
  <q-page class="text-white q-pb-xl bg-grey-4">
    <div id="title" class="text-primary q-pt-sm w100 text-center">
        Usuários
    </div>
    <div id="users" v-if="users.length > 0" class="w100 q-px-md q-mt-md rounded-borders">
        <q-list  class="row justify-center items-center q-gutter-md">
            <div id="title-layout" class="w100 justify-center items-center text-secondary">
                {{ users.length }} usuários encontrado(s)
            </div>
            <q-card style="border-left: 4px solid #616161;" v-for="(user, index) in users" :key="index" class="bg-grey-4 rounded-borders text-bold">
                <q-card-section>
                    <q-item-label id="title-2" class="text-dark">
                        {{index+1}}. {{ user.login }}
                    </q-item-label>
                </q-card-section>
                <q-card-section v-if="user.id" class="w100 bg-dark">
                    <q-icon @click="copy(user.id)" name="content_copy" size="sm" class="cursor-pointer q-pr-sm" color="white"></q-icon>{{ user.id }}[ID]
                </q-card-section>
                <q-card-section v-if="user.name" class="w100 bg-grey-14">
                    {{ user.name }}
                </q-card-section>
                <q-card-section  class="w100 bg-dark text-right">
                    {{ user.created_at }}
               </q-card-section>
                <q-card-section class="w100">
                    <q-btn  label="ver usuário" color="primary" glossy class="w100 q-py-md" icon-right="visibility"></q-btn>
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

async function copy (userId) {
    await navigator.clipboard.writeText(userId)
    $q.notify({
        color: 'green-14',
        icon: 'content_copy',
        message: 'ID copiado para a área de transferência',
        position: 'bottom',
        timeout: 2500,
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