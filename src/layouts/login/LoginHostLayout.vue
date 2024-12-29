<template>
    <div id="login-host" class="animate__animated animate__fadeIn bg-grad-3 w100 flex flex-center q-pt-md q-pb-xl">
        <div id="login-card" class="bg-white animate__animated animate__zoomIn rounded-borders">
            <div id="title-menu" class="text-primary text-center q-mt-md row q-px-md justify-center items-center"><q-icon name="diamond" size="md" color="primary" class="q-mr-xs"></q-icon>{{ editando ? 'CADASTRO' :'LOGIN'}} PRODUTOR(A)</div>
            <div class="q-pa-md">
                <q-input
                    v-if="editando"
                    v-model="host.name"
                    placeholder="Nome*"
                    maxlength="40"
                    type="text"
                    class="q-mb-md"
                    outlined
                />
                <q-input
                    v-model="host.login"
                    placeholder="Login*"
                    maxlength="40"
                    type="text"
                    outlined
                />
                <q-input
                    v-if="editando"
                    v-model="host.email"
                    placeholder="Email*"
                    maxlength="40"
                    class="q-mt-md"
                    type="email"
                    outlined
                />
                <q-input
                v-model="host.password"
                    placeholder="Senha*"
                    :type="formConfig.showPassword ? 'text' : 'password'"
                    maxlength="20"
                    outlined
                    class="q-mt-md"
                >
                    <template v-slot:append>
                        <q-icon
                            :name="formConfig.showPassword ? 'visibility' : 'visibility_off'"
                            class="cursor-pointer"
                            @click="formConfig.showPassword = !formConfig.showPassword"
                        />
                    </template>
                </q-input>
                <q-input
                    v-if="editando"
                    class="q-mt-md"
                    v-model="host.cpf_cnpj"
                    maxlength="20"
                    placeholder="CPF/CNPJ*"
                    type="text"
                    mask="####################"
                    outlined
                />
                <q-input
                    v-if="editando"
                    class="q-mt-md"
                    v-model="host.phone"
                    placeholder="Telefone*"
                    type="text"
                    mask="(##) #####-####"
                    outlined
                />
                <div v-if="loading" class="row w100 q-py-sm q-mt-xs justify-center">
                    <q-spinner-ball color="secondary" size="lg" />
                    <q-spinner-ball color="secondary" size="lg" />
                    <q-spinner-ball color="secondary" size="lg" />
                </div>
                <q-btn
                    v-if="!loading && !editando"
                    :disabled="isLoginFormInvalid()"
                    @click="login"
                    label="Login"
                    :color="isLoginFormInvalid() ? 'secondary' : 'green-14'"
                    glossy
                    icon-right="login"
                    class="full-width q-mt-md q-py-lg"
                />
                <q-btn
                    v-if="!loading && editando"
                    :disabled="isRegisterFormInvalid()"
                    @click="registrar"
                    label="Registrar"
                    color="green"
                    glossy
                    icon-right="person_add"
                    class="full-width q-mt-md q-py-md"
                />
                <q-btn
                    v-if="!loading"
                    @click="editando = !editando"
                    :label="editando ? 'Voltar' : 'Registre-se'"
                    color="primary"
                    class="full-width q-mt-md q-py-xs"
                />
                <q-btn class="full-width q-mt-md" color="secondary" flat v-if="!editando && !loading" to="/" label="página inicial" ></q-btn>
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
const editando = ref(false)
const loading = ref(false)

const formConfig = ref({
    showPassword: false,
    hostLoginRoute: '/login/host',
})

const host = ref({
    login: '',
    password: '',
    name: '',
    email: '',
    cpf_cnpj: '',
    phone: '',
})

function isLoginFormValid() {
    return host.value.login.trim().length < 3 || host.value.password.trim().length < 6
}

const makeReqObject = () => {
    const req = {
        login: host.value.login.trim().toLowerCase(),
        password: host.value.password.trim().toLowerCase(),
    }
    return req
}

const isLoginFormInvalid = () => {
    if (host.value.login.trim().length < 3 || host.value.password.trim().length < 6) {
        return true
    }
    return false
    
}
onMounted(() => {
    sessionStorage.clear()
})
async function login() {
    loading.value = true
    await api.post(formConfig.value.hostLoginRoute, makeReqObject())
    .then(response => {
        sessionStorage.setItem('host', JSON.stringify(response.data))
        sessionStorage.setItem('isHost', true)
        $q.notify({
            color: 'dark',
            position: 'top',
            message: 'Bem vindo, '+ response.data.login + '!',
            icon: 'diamond'
        })
        router.push('/host')
    })
    .catch(err => {
        $q.notify({
            color: 'negative',
            position: 'top',
            message: err.response.data.error,
            icon: 'report_problem',
        })
        host.value.password = ''
    })
    .finally(() => {
        loading.value = false
    })
}

function isRegisterFormInvalid() {
    if (host.value.login.trim().length < 3 || host.value.password.trim().length < 6 || host.value.name.trim() == '' || host.value.email.trim() ==  '' || host.value.cpf_cnpj.trim() == '' || host.value.phone.trim() == '') {
        return true
    }
    return false
}

async function registrar(){
    loading.value = true
    await api.post('/create_host', host.value)
    .then(response => {
        $q.notify({
            color: 'secondary',
            position: 'top',
            message: 'Cadastro realizado com sucesso!',
            icon: 'diamond'
        })
        sessionStorage.setItem('host', JSON.stringify(response.data))
        sessionStorage.setItem('isHost', true)
        router.push('/host')
    })
    .catch(err => {
        $q.notify({
            color: 'orange-14',
            position: 'top',
            message: err.response.data.error,
            icon: 'report_problem',
        })
    })
    .finally(() => {
        loading.value = false
    })
}

</script>

<style scoped>
#login-host{
    min-height: 100vh;
}

@media (max-width: 600px) {
    #login-card{
        width: 90%;
    }
}

</style>