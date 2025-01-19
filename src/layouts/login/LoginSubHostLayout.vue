<template>
    <div id="login-user" class="animate__animated animate__fadeIn bg-grad-2 w100 flex flex-center">
        <div id="login-card" class="bg-white animate__animated animate__zoomIn rounded-borders">
            <div id="title-menu" class="text-primary text-center q-mt-md row justify-center items-center">
                <q-icon name="sensor_occupied" size="md" color="primary" class="q-mr-md"></q-icon>Validar Ingressos</div>
            <div class="q-pa-md">
                <q-input
                    class="q-mb-md"
                    v-model="subhostCodigo"
                    placeholder="Código Evento*"
                    maxlength="200"
                    type="text"
                    outlined
                    color="dark"
                >
                    <template v-slot:prepend>
                        <q-icon name="lock" color="primary" />
                    </template>
                    <template v-slot:append>
                        <q-icon name="content_paste" color="secondary" @click="pasteCode()"/>
                    </template>
                </q-input>
                <div v-if="loading" class="row w100 q-py-sm q-mt-xs justify-center">
                    <q-spinner-ball color="primary" size="lg" />
                    <q-spinner-ball color="primary" size="lg" />
                    <q-spinner-ball color="primary" size="lg" />
                </div>
                <q-btn
                    v-if="!loading"
                    :disabled="isLoginFormInvalid()"
                    @click="login"
                    label="Login"
                    color="primary"
                    glossy
                    icon-right="login"
                    class="full-width q-mt-md q-py-lg"
                />
                <q-btn
                    class="full-width q-mt-sm"
                    label="página inicial"
                    flat
                    color="grey-14"
                    to="/"
                />
            </div>
        </div>
    </div>
</template>

<script setup>
import { useQuasar } from 'quasar';
import { api } from 'src/boot/axios';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const $q = useQuasar()
const router = useRouter()
const loading = ref(false)

const formConfig = ref({
    showPassword: false,
    subhostLoginRouter: '/login_subhost',
})
const subhostCodigo = ref('')

const subhost = ref({
    login: '',
    password: '',
    event: '',
})

function pasteCode() {
    navigator.clipboard.readText().then(text => {
        subhostCodigo.value = text
    })
}

const isLoginFormInvalid = () => {
    if (subhostCodigo.value.trim().length < 10 || subhostCodigo.value.trim() == '') {
        return true
    }
    return false
}

function parseStringToReqObject(inputString) {
    const [login, password, event] = inputString.split('#');
    return {
        login,
        password,
        event,
    };
}

async function login() {
    loading.value = true
    await api.post(formConfig.value.subhostLoginRouter, parseStringToReqObject(subhostCodigo.value))
    .then(response => {
        sessionStorage.setItem('subhostInfo', JSON.stringify(response.data))
        sessionStorage.setItem('isSubhost', true)
        sessionStorage.setItem('evento_andamento', response.data.event.id)
        sessionStorage.setItem('host', JSON.stringify(response.data.event.host))
        $q.notify({
            color: 'dark',
            position: 'top',
            message: 'Bem vindo, '+ response.data.login,
            icon: 'sensor_occupied',
        })
        router.push('/subhost')
    })
    .catch(err => {
        $q.notify({
            color: 'negative',
            position: 'top',
            message: 'Credenciais Inválidas',
            icon: 'report_problem',
        })
        subhost.value.password = ''
    })
    .finally(() => {
        loading.value = false
    })
}

</script>

<style scoped>
#login-user{
    height: 100vh;
}
#login-card{
    width: 40%;
}
@media (max-width: 600px) {
    #login-card{
        width: 90%;
    }
}

</style>