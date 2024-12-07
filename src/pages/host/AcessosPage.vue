<template>
    <q-page class=" w100 animate__animated animate__fadeIn relative">
        <div class="w100">
            <q-btn to='/host' dense class="q-ml-sm" flat  icon="keyboard_return" label="eventos" color="secondary">
            </q-btn>
        </div>
        <div id="title" class="text-white q-px-sm q-pb-sm text-center">
            Acessos
        </div>
        <div v-if="!editing" class="w100 flex flex-center">
            <q-btn @click="editing = !editing" label="Criar Acesso" color="blue" glossy icon-right="add_circle"></q-btn>
        </div>
        <div v-if="editing"  class="q-px-xl rounded-borders q-gutter-y-sm text-bold row justify-center">
            <q-input v-model="subhostHandler.name" dense maxlenght="20" class="rounded-borders w80 bg-grey-4 q-px-sm text-white" color="primary" placeholder="Nome*"/>
            <q-input v-model="subhostHandler.login" dense maxlenght="20" class="rounded-borders w80 bg-grey-4 q-px-sm text-white" color="primary" placeholder="Login*"/>
            <q-input v-model="subhostHandler.password" dense maxlenght="4" mask="####" class="rounded-borders w80 bg-grey-4 q-px-sm text-white" color="primary" placeholder="Senha*"/>
            <q-btn style="width: 100%;" label="Adicionar" @click="adicionarSubhost()" :disabled="!subhostHandler.name || !subhostHandler.login || !subhostHandler.password" glossy icon-right="add" color="green" class="w100 q-mt-md"></q-btn>
            <q-btn class="w100" flat @click="editing = !editing; clearSubhostHandler()" label="Cancelar" color="secondary"></q-btn>
        </div>
        <div id="subhosts" class="row q-mt-md" v-if="subhosts && !loading">
            <q-card v-for="subhost in subhosts" :key="subhost.name" class="w100 q-mx-md q-mt-md q-pb-sm">
                <q-card-section class="text-bold">
                    <div class="w100 row items-center justify-between">
                        <div id="title-layout" class="text-primary">{{ subhost.name }}</div>
                        <q-btn @click="removerSubhost(subhost.login)" style="width: 20%;"  icon-right="close" flat color="red" class="w100 q-mt-sm"></q-btn>
                    </div>
                    <div class="text-blue">👨🏼‍💼 {{ subhost.login.toLowerCase() }}</div>
                    <div class="text-secondary">🔑 {{ subhost.password }}</div>
                </q-card-section>
            </q-card>                
        </div>
        <div class="w100" v-if="subhosts.length == 0">
            <div class="text-bold text-center text-white q-pt-xl">Nenhum acesso cadastrado</div>
        </div>
        <div v-if="loading" class="row w100 q-py-sm justify-center">
            <q-spinner-ball color="primary" size="lg" />
            <q-spinner-ball color="primary" size="lg" />
            <q-spinner-ball color="primary" size="lg" />
        </div>
    </q-page>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { api } from 'src/boot/axios';
import { useQuasar } from "quasar";

const editing = ref(false);
const subhosts = ref([]);
const subhostHandler = ref({
    name: '',
    login: '',
    password: ''
})
const host = JSON.parse(sessionStorage.getItem('host'));
const loading = ref(false);
const $q = useQuasar()

const clearSubhostHandler = () => {
    subhostHandler.value = {
        name: '',
        login: '',
        password: ''
    }
}

async function removerSubhost(login) {
    subhosts.value = subhosts.value.filter(subhost => subhost.login != login);
    await updateSubhosts();
}


async function adicionarSubhost() {
    loading.value = true;
    if(subhostHandler.value.name.trim() == '' || subhostHandler.value.login.trim() == '' || subhostHandler.value.password.trim() == '') {
        $q.notify({
            color: 'orange',
            textColor: 'white',
            icon: 'error',
            message: 'Preencha todos os campos',
        });
        return;
    }
    subhostHandler.value.name = subhostHandler.value.name.trim().toUpperCase();
    subhostHandler.value.login = subhostHandler.value.login.trim().toUpperCase();
    subhosts.value.push(subhostHandler.value);
    await updateSubhosts();
}

async function updateSubhosts() {
    loading.value = true;
    const reqOpts = {
        host: {
            id: host.id,
            token: host.token,
        },
        subhosts: subhosts.value
    }
    await api.put('/host/update_subhosts', reqOpts)
        .then(response => {
            $q.notify({
                position: 'top',
                color: 'green',
                textColor: 'white',
                icon: 'check',
                message: response.data.message,
            });
            subhosts.value = response.data.subhosts;
        })
        .catch(error => {
            $q.notify({
                color: 'red-4',
                textColor: 'white',
                icon: 'error',
                position: 'top',
                message: error.response.data.error,
            });
            getSubhosts()
        })
        .finally(() => {
            loading.value = false;
            clearSubhostHandler();
        });
}

async function getSubhosts () {
    const req = {
        id: host.id,
        token: host.token
    }
    await api.post('/host/get_subhosts', req)
        .then(response => {
            subhosts.value = response.data.subhosts;
        })
}

onMounted( async () => {
    window.scrollTo(0, 0);
    loading.value = true;
    await getSubhosts().finally(() => {
        loading.value = false;
    });
});


</script>

<style scoped>

.q-card {
    width: 100%;
}


@media (min-width: 600px) {
    .q-card {
        width: 20vw;
    }
}

</style>