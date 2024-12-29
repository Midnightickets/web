<template>
    <q-layout>
        <q-page-container>
            <q-page id="login-user" class="animate__animated animate__fadeIn bg-grad-2 w100 q-pt-md q-pb-xl flex flex-center">
                <div id="login-card" class="bg-white animate__animated animate__zoomIn rounded-borders">
                    <div id="title-menu" class="text-primary text-center q-mt-md row justify-center items-center"><q-icon name="account_circle" size="md" color="primary" class="q-mr-xs"></q-icon>INICIAR SESSÃO</div>
                    <div class="q-pa-md column q-gutter-y-md">
                        <q-input
                            v-if="editing"
                            v-model="user.cpf"
                            placeholder="CPF*"
                            mask="###.###.###-##"
                            reverse-fill-mask
                            type="text"
                            outlined
                        />
                        <q-input
                        v-if="editing"
                        v-model="user.name"
                            placeholder="Nome Completo*"
                            maxlength="100"
                            type="text"
                            outlined
                            />
                            <q-input
                            v-model="user.login"
                            placeholder="Login*"
                            maxlength="40"
                            type="text"
                            outlined
                        />
                        <q-input
                            v-if="editing"
                            v-model="user.phone"
                            placeholder="Telefone*"
                            mask="(##) #####-####"
                            type="text"
                            outlined
                        />
                        <q-input
                            v-if="editing"
                            v-model="user.email"
                            placeholder="E-mail*"
                            maxlength="100"
                            type="email"
                            outlined
                        />
                        <q-input
                        v-model="user.password"
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
                        <div v-if="loading" class="row w100 q-py-sm q-mt-xs justify-center">
                            <q-spinner-ball color="primary" size="lg" />
                            <q-spinner-ball color="primary" size="lg" />
                            <q-spinner-ball color="primary" size="lg" />
                        </div>
                        <q-btn
                            v-if="!loading && !editing"
                            :color="isLoginFormInvalid() ? 'primary' : 'green-14'"
                            :disabled="isLoginFormInvalid()"
                            @click="login"
                            label="Fazer login"
                            glossy
                            icon-right="login"
                            class="full-width q-mt-md q-py-lg"
                        />
                        <q-btn
                            v-if="!loading && editing"
                            :color="isRegisterFormInvalid() ? 'primary' : 'green-14'"
                            :disabled="isRegisterFormInvalid()"
                            @click="registrar"
                            label="Registre-se"
                            glossy
                            icon-right="person_add"
                            class="full-width q-mt-md q-py-lg"
                        />
                        <q-btn
                            v-if="!loading"
                            :label="editing ? 'fazer login' : 'Registre-se'"
                            @click="editing = !editing"
                            color="primary"
                            glossy
                            class="full-width q-mt-md q-py-sm"
                        />
                        <q-btn
                            v-if="!loading"
                            class="full-width q-mt-sm"
                            label="Voltar"
                            color="secondary"
                            flat
                            @click="goBack()"
                        />
                    </div>
                </div>
            </q-page>
        </q-page-container>
    </q-layout>
</template>

<script setup>
import { useQuasar } from 'quasar';
import { api } from 'src/boot/axios';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const $q = useQuasar()
const router = useRouter()
const loading = ref(false)
const editing = ref(false)

const formConfig = ref({
    showPassword: false,
    userLoginRoute: '/login_user',
    userCreateRoute: '/create_user',
})

const user = ref({
    login: '',
    password: '',
    cpf: '',
    name: '',
    phone: '',
    email: '',
})

function isLoginFormValid() {
    return user.value.login.trim().length < 3 || user.value.password.trim().length < 3
}

const isLoginFormInvalid = () => {
    if (user.value.login.trim().length < 3 || user.value.password.trim().length < 3) {
        return true
    }
    return false
}

const isRegisterFormInvalid = () => {
    if (user.value.login.trim().length < 3 || user.value.password.trim().length < 3 || user.value.cpf.trim().length < 14 || user.value.name.trim().length < 3 || user.value.phone.trim().length < 15 || user.value.email.trim().length < 3) {
        return true
    }
    return false
}
onMounted(() => {
    sessionStorage.getItem('user') ? router.push('/me') : sessionStorage.removeItem('host')
})

function goBack(){
    if(sessionStorage.getItem('comeFromTicketIntention')) {
            const rota = sessionStorage.getItem('comeFromTicketIntention')
            sessionStorage.removeItem('comeFromTicketIntention')
            router.push('/events/' + rota)
        }
    else router.push('/')
}

async function registrar () {
    loading.value = true
    const req = {
        login: user.value.login.toLocaleLowerCase(),
        password: user.value.password.toLocaleLowerCase(),
        cpf: user.value.cpf,
        name: user.value.name,
        phone: user.value.phone,
        email: user.value.email
    }
    await api.post(formConfig.value.userCreateRoute, req)
    .then(response => {
        sessionStorage.setItem('user', JSON.stringify(response.data))
        sessionStorage.setItem('isUser', true)
        $q.notify({
            color: 'secondary',
            position: 'top',
            message: 'Bem vindo, '+ response.data.login + '!',
            icon: 'local_activity'
        })
        if(sessionStorage.getItem('comeFromTicketIntention')) {
            const rota = sessionStorage.getItem('comeFromTicketIntention')
            sessionStorage.removeItem('comeFromTicketIntention')
            router.push('/events/' + rota)
        }
        else router.push('/me')
    })
    .catch(err => {
        $q.notify({
            color: 'negative',
            position: 'top',
            message: err.response.data.error,
            icon: 'report_problem',
        })
        user.value.password = ''
    })
    .finally(() => {
        loading.value = false
    })
}

async function login() {
    loading.value = true
    const req = {
        login: user.value.login.toLocaleLowerCase(),
        password: user.value.password.toLocaleLowerCase()
    }
    await api.post(formConfig.value.userLoginRoute, req)
    .then(response => {
        sessionStorage.setItem('user', JSON.stringify(response.data))
        sessionStorage.setItem('isUser', true)
        $q.notify({
            color: 'secondary',
            position: 'top',
            message: 'Bem vindo, '+ response.data.login + '!',
            icon: 'local_activity'
        })
        if(sessionStorage.getItem('comeFromTicketIntention')) {
            const rota = sessionStorage.getItem('comeFromTicketIntention')
            sessionStorage.removeItem('comeFromTicketIntention')
            router.push('/events/' + rota)
        }
        else router.push('/me')
    })
    .catch(err => {
        $q.notify({
            color: 'negative',
            position: 'top',
            message: err.response.data.error,
            icon: 'report_problem',
        })
        user.value.password = ''
    })
    .finally(() => {
        loading.value = false
    })
}

</script>

<style scoped>
#login-user{
    min-height: 100vh;
}
#login-card{
    width: 45vw
}

@media (max-width: 600px) {
    #login-card{
        width: 90%;
    }
}

</style>