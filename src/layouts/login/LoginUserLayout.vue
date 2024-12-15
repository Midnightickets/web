<template>
    <div id="login-user" class="animate__animated animate__fadeIn bg-grad-7 w100 flex flex-center">
        <div id="login-card" class="bg-white animate__animated animate__zoomIn">
            <div id="title-menu" class="text-primary text-center q-mt-md row justify-center items-center"><q-icon name="account_circle" size="md" color="primary" class="q-mr-xs"></q-icon>LOGIN</div>
            <div class="q-pa-md">
                <q-input
                    v-model="user.login"
                    filled
                    placeholder="Login*"
                    maxlength="40"
                    type="text"
                    outlined
                    @keyup.enter="login"
                />
                <q-input
                    v-model="user.password"
                    filled
                    placeholder="Senha*"
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
                <div v-if="loading" class="row w100 q-py-sm justify-center">
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
                    v-if="!loading"
                    label="Registre-se"
                    color="blue-14"
                    glossy
                    icon-right="person_add"
                    class="full-width q-mt-md q-py-sm"
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
const loading = ref(false)

const formConfig = ref({
    showPassword: false,
    userLoginRoute: '/login_user',
})

const user = ref({
    login: '',
    password: '',
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
onMounted(() => {
    sessionStorage.clear()
})
async function login() {
    loading.value = true
    const req = {
        login: user.value.login,
        password: user.value.password
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
        router.push('/me')
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
    height: 100vh;
}

@media (max-width: 600px) {
    #login-card{
        width: 90%;
    }
}

</style>