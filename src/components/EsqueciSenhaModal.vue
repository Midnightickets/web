<template>
    <q-dialog>
        <q-card class="rounded-borders border-left-roxo q-pb-md q-pr-md" v-if="notSended">
            <q-card-section>
                <q-card-title id="title-2" class="w100 text-primary">
                    Esqueci minha senha<br>
                </q-card-title>
                <q-card-section class="w100 text-center" style="font-size:1rem">
                    {{ isHost ? 'Produtor(a)' : 'Usuário'}}, insira seu {{ isHost ? 'CNPJ ou CPF' : 'CPF' }} para recuperar sua senha
                </q-card-section>
            </q-card-section>
            <div class="w100 q-pl-md row">
                <q-radio color="primary" class="q-mb-md" v-model="isHost"  :val="false" label="Sou Usuário" />
                <q-radio color="primary" class="q-mb-md q-ml-md" v-model="isHost" :val="true" label="Sou Produtor" />
            </div>
            <q-card-section>
                <q-input
                    v-model="identity"
                    filled
                    :placeholder="isHost ? 'CNPJ ou CPF do produtor' : 'CPF do usuário'"
                    :mask="!isHost ? '###.###.###-##' : ''"
                    maxlength="18"
                >
                    <template v-slot:prepend>
                        <q-icon name="fingerprint" color="primary" />
                    </template>
                </q-input>
            </q-card-section>
            <q-card-actions align="right">
                <q-btn
                v-if="!loading"
                    label="Recuperar Senha"
                    color="primary"
                    @click="sendEmail()"
                />
                <div v-else class="row w100 q-py-sm q-mt-xs justify-center">
                    <q-spinner-ball color="secondary" size="lg" />
                    <q-spinner-ball color="secondary" size="lg" />
                    <q-spinner-ball color="secondary" size="lg" />
                </div>
            </q-card-actions>
        </q-card>
        <q-card v-if="!notSended" class="q-pb-md  border-left-roxo">
            <q-card-section>
                <q-card-section id="title" class="text-center text-primary">
                    Recuperar Senha<br>
                </q-card-section>
                <q-card-subtitle style="font-size: 1rem;" class="text-secondary text-bold">
                    {{ postEmailMessage }}
                </q-card-subtitle>
            </q-card-section>
            <q-card-section style="font-size: 1rem;" class="text-bold text-grey-14 text-shadow">
                    Verifique sua caixa de entrada e siga as instruções para recuperar sua senha.<br><br><strong class="text-blue-14">Caso não encontre o e-mail, verifique a caixa de spam ou lixo eletrônico</strong>
                </q-card-section>
            <q-card-section class="mid-opacity ">
                    midnightickets@gmail.com
                </q-card-section>
        </q-card>
    </q-dialog>
</template>

<script setup>
import { useQuasar } from 'quasar';
import { api } from 'src/boot/axios';
import { ref } from 'vue';

const isHost = ref(false);
const notSended = ref(true);
const identity = ref('')
const loading = ref(false)
const postEmailMessage = ref('')
const $q = useQuasar()
async function sendEmail() {
    loading.value = true
    await api.post('/redefinir-senha', {
        identity: identity.value,
        type: isHost.value ? 'host' : 'user'
    }).then((response) => {
        postEmailMessage.value = response.data.message
        notSended.value = false
    }).catch((error) => 
    {
        $q.notify({
            message: error.response.data.error,
            color: 'secondary',
            icon: 'account_circle',
            position: 'top',
            timeout: 3000
        })
       
    }).finally(() => {
        loading.value = false
    })
}

</script>

<style scoped>

</style>