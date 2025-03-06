<template>
    <div id="login-host" class="animate__animated animate__fadeIn bg-grad-3 w100 flex flex-center q-pt-xl">
        <div class="w100 q-py-lg"></div>
        <div style="position: fixed; top: 16px; left: 0;z-index: 9999!important" class="w100 row items-center justify-between  q-px-md" >
            <q-btn to="/" icon="home" color="secondary" glossy></q-btn>
            <div class="q-pl-md text-secondary" id="title-layout">Área do Produtor</div>
        </div>
        <div id="login-card" class="bg-grey-2 animate__animated animate__zoomIn rounded-borders">
            <div id="title-menu" class="text-primary text-center q-mt-md row q-px-md justify-center items-center"><q-icon name="diamond" size="md" color="primary" class="q-mr-xs"></q-icon>{{ editando ? 'CADASTRO' :'LOGIN'}} PRODUTOR(A)</div>
            <div class="q-pa-md">
                <q-input
                    v-if="editando"
                    v-model="host.name"
                    placeholder="Nome Produtor(a)*"
                    maxlength="40"
                    type="text"
                    class="q-mb-md"
                    outlined
                >
                <template v-slot:prepend>
                    <q-icon color="primary" name="person" />
                </template>
                </q-input>
                <q-input
                    v-model="host.login"
                    placeholder="Login*"
                    maxlength="40"
                    type="text"
                    outlined
                >
                    <template v-slot:prepend>
                        <q-icon color="primary" name="account_circle" />
                    </template>
                </q-input>
                <q-input
                    v-if="editando"
                    v-model="host.email"
                    placeholder="Email*"
                    maxlength="40"
                    class="q-mt-md"
                    type="email"
                    outlined
                >
                    <template v-slot:prepend>
                        <q-icon color="primary" name="email" />
                    </template>
                </q-input>
                <q-input
                v-model="host.password"
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
                <q-input
                    v-if="editando"
                    class="q-mt-md"
                    v-model="host.cpf_cnpj"
                    maxlength="20"
                    placeholder="CPF ou CNPJ*"
                    type="text"
                    mask="####################"
                    outlined
                >
                    <template v-slot:prepend>
                        <q-icon name="fingerprint" color="primary" />
                    </template>
                </q-input>
                <q-input
                    v-if="editando"
                    class="q-mt-md"
                    v-model="host.phone"
                    placeholder="Telefone*"
                    type="text"
                    mask="(##) #####-####"
                    outlined
                >
                    <template v-slot:prepend>
                        <q-icon name="phone" color="primary" />
                    </template>
                </q-input>
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
                <q-checkbox
                    v-if="editando"
                    label="Li e Concordo com os Termos de Uso*"
                    v-model="termosUso"
                    class="q-mt-sm"
                    />
                <q-btn
                    v-if="!loading && editando"
                    :disabled="isRegisterFormInvalid()"
                    @click="registrar"
                    label="Registrar"
                    color="green"
                    glossy
                    icon-right="person_add"
                    class="full-width q-mt-md q-py-lg"
                />
                <q-btn
                    v-if="!loading"
                    @click="editando = !editando"
                    :label="editando ? 'Voltar' : 'Registre-se'"
                    color="primary"
                    class="full-width q-mt-md q-py-xs"
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
                <q-btn label="Manual do Produtor" class="text-grey-5" flat @click="openManualProdutor()"></q-btn>
                <q-btn label="termos de uso" to="/termos-de-uso" class="text-grey-5" flat></q-btn>
                <q-btn label="desenvolvedor" @click="goTo('https://samuelvictorol.github.io/portfolio')" class="text-grey-5" flat></q-btn>
            </div>
            <div class="w100 q-pt-xs bg-secondary rounded-borders"></div>
            <div class="column q-py-md items-center">
                <q-btn label="Área do Usuário" to="/login" class="text-grey-5" flat></q-btn>
                <q-btn label="Área do Colaborador" to="/login-subhost" class="text-grey-5" flat></q-btn>
                <q-btn label="Encontre eventos" to="/" class="text-grey-5" flat></q-btn>
                <q-btn label="Compre ingressos" to="/login" class="text-grey-5" flat></q-btn>
                <q-btn label="Email" @click="alertar('midnightickets@gmail.com')" class="text-grey-5" flat></q-btn>
                <q-btn label="Instagram" @click="goTo('https://www.instagram.com/midnightickets')" class="text-grey-5" flat></q-btn>
            </div>
            <div class="w100 row q-pt-xl items-center justify-start text-secondary" id="title-layout">
                Midnight Tickets 
            </div>
        </footer>
    </div>
</template>

<script setup>
import { useQuasar } from 'quasar';
import { api } from 'src/boot/axios';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import EsqueciSenhaModal from 'src/components/EsqueciSenhaModal.vue';

const $q = useQuasar()
const router = useRouter()
const editando = ref(false)
const loading = ref(false)
const modalEsqueciSenha = ref(false)
const termosUso = ref(false)
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

function goTo(url) {
    window.open(url, '_blank')
}

function isLoginFormValid() {
    return host.value.login.trim().length < 3 || host.value.password.trim().length < 6
}

function alertar(msg) {
    alert(msg)
}

function openManualProdutor() {
    window.open('Manual-do-Produtor.pdf', '_blank');
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
            message: 'Bem vindo, '+ response.data.login,
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
    if (host.value.login.trim().length < 3 || host.value.password.trim().length < 6 || host.value.name.trim() == '' || 
    host.value.email.trim() ==  '' || host.value.cpf_cnpj.trim() == '' || host.value.phone.trim() == '' || !termosUso.value) {
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
        router.push('/host/me')
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

.bg-grad-dark-purple{
    background: linear-gradient(90deg, #1a1a1a 0%, #2d0037 100%);
}

@media (max-width: 600px) {
    #login-card{
        width: 90%;
    }
}

</style>