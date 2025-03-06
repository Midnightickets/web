<template>
    <q-layout>
        <q-page-container>
            <q-page id="login-user" class="animate__animated animate__fadeIn bg-grad-2 w100  q-pt-xl column justify-center items-center">
        <div class="w100 q-py-md"></div>
                <div style="position: fixed; top: 16px; left: 0;z-index: 9999!important" class="w100 row no-wrap justify-between q-px-md" >
                    <div class="row q-gutter-sm">
                        <q-btn @click="goBack()" class="q-mr-sm" icon="keyboard_return" color="secondary" glossy></q-btn>
                        <q-btn to="/" icon="home" color="secondary" glossy></q-btn>
                    </div>
                    <q-btn class="q-ml-sm" flat label="Área do Usuário" color="purple-2"></q-btn>
                </div>
                <div id="login-card" class="bg-white q-my-lg animate__animated animate__zoomIn rounded-borders">
                    <div id="title-menu" class="text-primary text-center q-mt-md row justify-center items-center"><q-icon :name="editing ? 'person_add' : 'account_circle'" size="md" color="primary" class="q-mr-md"></q-icon>{{ editing ? 'NOVO USUÁRIO' : 'INICIAR SESSÃO'}}</div>
                    <div class="q-pa-md column q-gutter-y-md">
                        <q-checkbox v-if="!editing" v-model="loginByCpf">
                            <span class="text-primary">Entrar com CPF</span>
                        </q-checkbox>
                    <q-input
                        v-if="loginByCpf && !editing"
                        v-model="user.login"
                        placeholder="CPF*"
                        mask="###.###.###-##"
                        type="text"
                        outlined
                    >
                        <template v-slot:prepend>
                            <q-icon name="fingerprint" color="primary"/>
                        </template>
                    </q-input>
                    <q-input
                    v-if="!editing && !loginByCpf"
                    v-model="user.login"
                    placeholder="Login*"
                    maxlength="20"
                    type="text"
                    outlined
                >
                    <template v-slot:prepend>
                        <q-icon name="account_circle" color="primary"/>
                    </template>
                </q-input>
                        <q-input
                            v-if="editing"
                            v-model="user.cpf"
                            placeholder="CPF*"
                            mask="###.###.###-##"
                            reverse-fill-mask
                            maxlength="14"
                            type="text"
                            outlined
                        >
                            <template v-slot:prepend>
                                <q-icon name="fingerprint" color="primary"/>
                            </template>
                        </q-input>
                        <q-input
                        v-if="editing"
                        v-model="user.name"
                            placeholder="Nome Completo*"
                            maxlength="80"
                            type="text"
                            outlined
                            >
                            <template v-slot:prepend>
                                <q-icon name="person" color="primary"/>
                            </template>
                        </q-input>
                            <q-input
                            v-if="editing"
                            v-model="user.login"
                            placeholder="Login*"
                            maxlength="20"
                            type="text"
                            outlined
                        >
                            <template v-slot:prepend>
                                <q-icon name="account_circle" color="primary"/>
                            </template>
                        </q-input>
                        <q-input
                        v-if="editing"
                        v-model="user.birthday"
                        placeholder="Data de nascimento*"
                        mask="##/##/####"
                        outlined
                    >
                        <template v-slot:prepend>
                            <q-icon name="today" color="primary"/>
                        </template>
                    </q-input>
                        <!-- <div v-if="editing" class="w100 row justify-center">
                            <q-date id="date-picker" class="w100 row" v-model="user.birthday" mask="DD-MM-YYYY" color="primary" />
                        </div> -->
                        <q-input
                            v-if="editing"
                            v-model="user.phone"
                            placeholder="Telefone*"
                            mask="(##) #####-####"
                            type="text"
                            outlined
                        >
                            <template v-slot:prepend>
                                <q-icon name="phone" color="primary"/>
                            </template>
                        </q-input>
                        <q-input
                            v-if="editing"
                            v-model="user.email"
                            placeholder="E-mail*"
                            maxlength="100"
                            type="email"
                            outlined
                        >
                            <template v-slot:prepend>
                                <q-icon name="email" color="primary"/>
                            </template>
                        </q-input>
                        <q-input
                        v-model="user.password"
                            placeholder="Senha*"
                            :type="formConfig.showPassword ? 'text' : 'password'"
                            maxlength="20"
                            outlined
                            class="q-mt-md"
                        >
                        <template v-slot:prepend>
                            <q-icon color="primary"
                                name="lock"
                            />
                        </template>
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
                            label="Entrar"
                            glossy
                            icon-right="login"
                            class="full-width q-mt-md q-py-lg"
                        />
                        <q-checkbox
                            v-if="editing"
                            label="Li e Concordo com os Termos de Uso*"
                            v-model="termosUso"
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
                            :label="editing ? 'já possui uma conta ?' : 'Crie uma conta'"
                            @click="editing = !editing"
                            color="primary"
                            :icon-right="editing ? 'login' : 'person_add'"
                            glossy
                            class="full-width q-mt-md q-py-sm"
                        />
                        <q-btn
                        v-if="!editando && !loading"
                        label="Esqueci minha senha"
                        glossy
                        @click="modalEsqueciSenha = true"
                        color="blue-14"
                        class="full-width q-mt-md q-py-xs"
                    />
                    </div>
                    <EsqueciSenhaModal v-model="modalEsqueciSenha" />
                </div>
                <footer class="w100 row wrap justify-center q-mt-xl items-center q-py-xl bg-primary q-px-xl">
                    <div class=" column q-py-md">
                        <q-btn label="Manual do Usuário" @click="goTo('/Manual-do-Usuario.pdf')" class="text-grey-5" flat></q-btn>
                        <q-btn label="termos de uso" to="/termos-de-uso" class="text-grey-5" flat></q-btn>
                        <q-btn label="Crie seu evento" to="/login-host" class="text-grey-5" flat></q-btn>
                        <q-btn label="Encontre eventos" to="/" class="text-grey-5" flat></q-btn>
                    </div>
                    <div class="w100 q-pt-xs bg-secondary rounded-borders"></div>
                    <div class="column q-py-md items-center">
                        <q-btn label="Área do Produtor" to="/login-host" class="text-grey-5" flat></q-btn>
                        <q-btn label="instagram" @click="goTo('https://www.instagram.com/midnightickets')" class="text-grey-5" flat></q-btn>
                        <q-btn label="email" @click="alertar('midnightickets@gmail.com')" class="text-grey-5" flat></q-btn>
                        <q-btn label="desenvolvedor" @click="goTo('https://samuelvictorol.github.io/portfolio')" class="text-grey-5" flat></q-btn>
                    </div>
                    <div class="w100 row q-pt-xl items-center justify-start text-secondary" id="title-layout">
                        Midnight Tickets 
                    </div>
                </footer>
            </q-page>
        </q-page-container>
    </q-layout>
</template>

<script setup>
import { useQuasar } from 'quasar';
import { api } from 'src/boot/axios';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import EsqueciSenhaModal from 'src/components/EsqueciSenhaModal.vue';

const $q = useQuasar()
const router = useRouter()
const loading = ref(false)
const loginByCpf = ref(false)
const editing = ref(false)
const modalEsqueciSenha = ref(false)
const termosUso = ref(false)

const formConfig = ref({
    showPassword: false,
    userLoginRoute: '/login_user',
    userCreateRoute: '/create_user',
})

function goTo(url) {
    window.open(url, '_blank')
}

function alertar(msg) {
    alert(msg)
}

const user = ref({
    login: '',
    password: '',
    cpf: '',
    name: '',
    phone: '',
    email: '',
    birthday: '',
})

const isLoginFormInvalid = () => {
    if (user.value.login.trim().length < 3 || user.value.password.trim().length < 6) {
        return true
    }
    return false
}

const isRegisterFormInvalid = () => {
    if (user.value.login.trim().length < 3 || user.value.password.trim().length < 6 || user.value.cpf.trim().length < 14
        || user.value.name.trim().length < 3 || user.value.phone.trim().length < 15 || user.value.email.trim().length < 3
        || user.value.birthday.trim().length < 10 || !termosUso.value
    ) {
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
    else window.history.back()
}

async function registrar () {
    loading.value = true
    const req = {
        login: user.value.login.toLocaleLowerCase(),
        password: user.value.password.toLocaleLowerCase(),
        cpf: user.value.cpf,
        name: user.value.name,
        phone: user.value.phone,
        email: user.value.email,
        birthday: user.value.birthday
    }
    await api.post(formConfig.value.userCreateRoute, req)
    .then(response => {
        sessionStorage.setItem('user', JSON.stringify(response.data))
        sessionStorage.setItem('isUser', true)
        $q.notify({
            color: 'secondary',
            position: 'top',
            message: 'Bem vindo, '+ response.data.login,
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
            message: 'Bem vindo, '+ response.data.login,
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
    min-height: 90vh;
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