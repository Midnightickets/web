<template>
    <q-page class=" w100 animate__animated animate__fadeIn relative q-pb-xl">
        <div class="w100">
            <q-btn to='/host' dense class="q-pr-xs" flat icon="keyboard_return" label="eventos"  color="primary" glossy>
            </q-btn>
        </div>
        <div id="title" class="text-primary q-px-sm q-pb-sm text-center">
            Meu Perfil
        </div>
        <div v-if="!editing" class="w100 row justify-center q-mb-md q-gutter-x-md q-gutter-y-md">
            <q-btn @click="editing = !editing" label="Editar Pefil" color="orange-14" glossy
                icon-right="account_circle"></q-btn>
            <q-btn @click="openPerfilPublico()" label="Perfil Público" color="secondary" glossy
                icon-right="public"></q-btn>
        </div>
        <div v-if="host" class="row wrap w100 q-pl-md q-mt-md cards-wrapper justify-center q-gutter-x-md items-start">
            <q-card class="q-mb-md animate__animated animate__fadeInRight" style="border-left: 4px solid #9573f3;">
                <q-card-section class="q-pa-md row justify-center items-center">
                    <q-avatar style="width:110px;height:110px;" class="shadow-2">
                        <img style="border-bottom: 4px solid #9573f3;" v-if="host.img_url" :src="host.img_url" alt="">
                        <q-icon style="border-bottom: 4px solid #9573f3;" v-else name="account_circle" size="100px" color="purple-1" />
                    </q-avatar>
                </q-card-section>
                <q-card-section class="q-pa-md">
                    <div class="text-h6 text-primary">Nome</div>
                    <div class="text-h6">{{ host.name }}</div>
                </q-card-section>
                <q-card-section class="q-pa-md">
                    <div class="text-h6 text-primary">Login</div>
                    <div class="text-h6">{{ host.login }}</div>
                </q-card-section>
                <q-card-section class="q-pa-md">
                    <div class="text-h6 text-primary">Email</div>
                    <div class="text-h6">{{ host.email }}</div>
                </q-card-section>
                <q-card-section class="q-pa-md">
                    <div class="text-h6 text-primary">Senha</div>
                    <div class="text-h6">**********</div>
                </q-card-section>
            </q-card>
            <q-card class="q-mb-md animate__animated animate__fadeInLeft" style="border-right: 4px solid #9573f3;">
                <q-card-section class="q-pa-md">
                    <div class="text-h5 text-primary">Saldo</div>
                    <div class="text-h6 ">R$ {{ host.balance }}</div>
                </q-card-section>
                <q-card-section class="q-pa-md">
                    <div class="text-h6 text-primary">Chave PIX - {{ host.pix_key.type != 'xxx' ?
                        `[${host.pix_key.type}]` : '[Não Cadastrado]' }}</div>
                    <div class="text-bold">{{ host.pix_key.key }}</div>
                </q-card-section>
                <q-card-section class="q-pa-md">
                    <div class="text-h6 text-primary">Solicitação de Saque</div>
                    <div class="text-bold">{{ host.waitingSake ? '🟣 Aguardando Processamento'
                        : '🟢 Disponível para saque' }}</div>
                </q-card-section>
                <q-card-section v-if="!host.waitingSake" class="q-pa-md">
                    <q-btn @click="confirmPassword('request_saque')" class="w100 q-py-md" label="Solicitar Saque"
                        icon-right="paid" glossy color="blue-14"></q-btn>
                </q-card-section>
            </q-card>
        </div>
        <q-dialog v-model="passwordModal" persistent>
            <q-card>
                <q-card-section class="q-pa-md">
                    <div id="title-2" class=" text-primary q-mb-md"><q-icon name="local_activity"
                            class="q-pb-xs q-pr-xs"></q-icon>Confirme sua senha</div>
                    <q-input outlined v-model="passwordOptions.password"
                        :type="passwordOptions.visibility ? 'text' : 'password'" label="Senha">
                        <template v-slot:prepend>
                            <q-icon @click="passwordOptions.visibility = !passwordOptions.visibility" name="lock"
                                color="primary" />
                        </template>
                        <template v-slot:append>
                            <q-icon @click="passwordOptions.visibility = !passwordOptions.visibility"
                                name="visibility" />
                        </template>
                    </q-input>
                </q-card-section>
                <q-card-actions align="right" class="q-pb-md">
                    <q-btn @click="cancelar()" label="Cancelar" flat color="secondary" />
                    <q-btn @click="solicitar()" label="Confirmar" color="primary" />
                </q-card-actions>
            </q-card>

        </q-dialog>
    </q-page>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { api } from 'src/boot/axios';
import { useQuasar } from "quasar";

const editing = ref(false);

const host = JSON.parse(sessionStorage.getItem('host'));
const $q = useQuasar()
const passwordModal = ref(false);
const passwordOptions = ref({
    password: '',
    visibility: false,
    type: ''
})

function confirmPassword(type) {
    passwordModal.value = true;
    passwordOptions.value.type = type;
}

async function solicitar() {
    await updateLogin().then(() => {
        if (passwordOptions.value.type == 'request_saque') {
            api.get('/midnightickets?host=' + host.id )
                .then(response => {
                    $q.notify({
                        color: 'secondary',
                        position: 'top',
                        message: response.data.message,
                        icon: 'currency_exchange'
                    })
                    updateLogin()
                    setTimeout(() => {
                        window.location.reload()
                    }, 2000)
                })
                .catch(err => {
                    $q.notify({
                        color: 'secondary',
                        icon: 'key',
                        position: 'top',
                        message: err.response.data.message,
                    })
                    passwordOptions.value.password = ''
                })
        }
    })

        .catch(err => {
            console.log('UpdateLogin error:\n' + err)
        })
}

function cancelar() {
    editing.value = false
    passwordOptions.value.password = ''
    passwordOptions.value.visibility = false
    passwordOptions.value.type = ''
    passwordModal.value = false
}

function openPerfilPublico() {
    window.open('/' + host.login, '_blank')
}

async function updateLogin() {
    await api.post('/login/host', { login: host.login, password: passwordOptions.value.password.trim() })
        .then(response => {
            sessionStorage.setItem('host', JSON.stringify(response.data))
            sessionStorage.setItem('isHost', true)
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

onMounted(async () => {
    window.scrollTo(0, 0);
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

    .add-subhost {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        width: 100%;
    }

    .add-subhost .q-input,
    .add-subhost .q-btn {
        width: 20vw;
    }
}
</style>