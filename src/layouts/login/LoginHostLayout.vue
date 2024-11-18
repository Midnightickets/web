<template>
    <div id="login-host" class="animate__animated animate__fadeIn bg-grad-7 w100 flex flex-center">
        <div id="login-card" class="bg-white animate__animated animate__zoomIn">
            <div id="title-menu" class="text-primary text-center q-mt-md"><q-icon name="diamond" size="md" color="primary" class="q-mr-xs q-mb-xs"></q-icon>HOST LOGIN</div>
            <div class="q-pa-md">
                <q-input
                    v-model="host.login"
                    filled
                    placeholder="Login"
                    maxlength="40"
                    type="text"
                    outlined
                    @keyup.enter="login"
                />
                <q-input
                    v-model="host.password"
                    filled
                    placeholder="Password"
                    :type="formConfig.showPassword ? 'text' : 'password'"
                    maxlength="20"
                    outlined
                    class="q-mt-md"
                    @keyup.enter="login"
                >
                    <template v-slot:append>
                        <q-icon
                            :name="formConfig.showPassword ? 'visibility' : 'visibility_off'"
                            class="cursor-pointer"
                            @click="formConfig.showPassword = !formConfig.showPassword"
                        />
                    </template>
                </q-input>
                <q-btn
                    :disabled="isLoginFormInvalid()"
                    @click="login"
                    label="Login"
                    color="primary"
                    glossy
                    icon-right="login"
                    class="full-width q-mt-md q-py-md"
                />
                <q-btn
                    class="full-width q-mt-sm"
                    label="Voltar"
                    color="primary"
                    flat
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

const formConfig = ref({
    showPassword: false,
    hostLoginRoute: '/login/host',
})

const host = ref({
    login: '',
    password: '',
})

function isLoginFormValid() {
    return host.value.login.trim().length < 3 || host.value.password.trim().length < 3
}

const makeReqObject = () => {
    const req = {
        login: host.value.login.trim().toLowerCase(),
        password: host.value.password.trim().toLowerCase(),
    }
    return req
}

const isLoginFormInvalid = () => {
    if (host.value.login.trim().length < 3 || host.value.password.trim().length < 3) {
        return true
    }
    return false
    
}
onMounted(() => {
    sessionStorage.clear()
})
async function login() {
    await api.post(formConfig.value.hostLoginRoute, makeReqObject())
    .then(response => {
        sessionStorage.setItem('host', JSON.stringify(response.data))
        sessionStorage.setItem('isHost', true)
        $q.notify({
            color: 'secondary',
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
}

</script>

<style scoped>
#login-host{
    height: 100vh;
}

@media (max-width: 600px) {
    #login-card{
        width: 90%;
    }
}

</style>