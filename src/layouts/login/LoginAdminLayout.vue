<template>
    <div id="login-user" class="animate__animated animate__fadeIn bg-dark w100 flex flex-center">
        <div id="login-card" class="bg-white animate__animated animate__zoomIn rounded-borders">
            <div id="title-menu" class="text-dark text-center q-mt-md row justify-center items-center">
                <q-icon name="admin_panel_settings" size="md" color="dark" class="q-mr-xs"></q-icon>ADMIN</div>
            <div class="q-pa-md">
                <q-input
                    v-model="admin.login"
                    placeholder="Login*"
                    maxlength="40"
                    type="text"
                    outlined
                    color="dark"
                    @keyup.enter="login"
                />
                <q-input
                    v-model="admin.password"
                    placeholder="Senha*"
                    :type="formConfig.showPassword ? 'text' : 'password'"
                    maxlength="20"
                    outlined
                    color="dark"
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
                    color="dark"
                    glossy
                    icon-right="login"
                    class="full-width q-mt-md q-py-lg"
                />
                <q-btn
                    class="full-width q-mt-sm"
                    icon="home"
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
    adminLoginRouter: '/login_admin',
})

const admin = ref({
    login: '',
    password: '',
})

function isLoginFormValid() {
    return admin.value.login.trim().length < 3 || admin.value.password.trim().length < 3
}

const isLoginFormInvalid = () => {
    if (admin.value.login.trim().length < 3 || admin.value.password.trim().length < 3) {
        return true
    }
    return false
    
}

async function login() {
    loading.value = true
    const req = {
        login: admin.value.login.toLocaleLowerCase(),
        password: admin.value.password.toLocaleLowerCase()
    }
    await api.post(formConfig.value.adminLoginRouter, req)
    .then(response => {
        sessionStorage.setItem('admin', JSON.stringify(response.data))
        sessionStorage.setItem('isAdmin', true)
        $q.notify({
            color: 'dark',
            position: 'top',
            message: 'Bem vindo, '+ response.data.login + '!',
            icon: 'admin_panel_settings'
        })
        router.push('/admidnightickets')
    })
    .catch(err => {
        $q.notify({
            color: 'negative',
            position: 'top',
            message: 'Credenciais Inválidas',
            icon: 'report_problem',
        })
        admin.value.password = ''
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