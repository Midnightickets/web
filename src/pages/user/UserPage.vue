<template>
    <q-page v-if="user != null" class="bg-grad-2 text-white q-px-md animate__animated animate__fadeIn q-pb-xl">
        <div class="w100 row no-wrap justify-between q-pt-md" >
            <q-btn to="/" icon="home" color="secondary" class="q-mr-sm" glossy>
                <q-tooltip anchor="top" self="bottom">
                    <div>Encontrar Eventos</div>
                </q-tooltip>
            </q-btn>
            <div>
                <!-- <q-btn to="/"  icon-right="travel_explore" color="secondary" glossy>
                    <q-tooltip anchor="top" self="bottom">
                        <div>Encontrar Eventos</div>
                    </q-tooltip>
                </q-btn> -->
                <q-btn to="/me"  icon-right="confirmation_number" class="q-ml-sm" color="secondary" glossy>
                    <q-tooltip anchor="top" self="bottom">
                        <div>Meus Ingressos</div>
                    </q-tooltip>
                </q-btn>
            </div>
        </div>
        <div class="q-mt-md text-h6">Olá, {{ Utils.toCamelCase(user.name) }}</div>
        <q-card class="q-mt-md rounded-borders" style="border-left: 4px solid #6310e1;">
            <q-card-section>
                <div id="title-2" class="text-primary row no wrap items-center justify-between">
                    <div class="" id="title-2">Dados</div>
                    <q-btn @click="editing = !editing" :icon-right="!editing ? 'edit' : 'cancel'" :label="!editing ? 'editar' : 'cancelar'" :flat="editing ? true : false" color="orange-14" class=""></q-btn>
                </div>
                <div v-if="!editing" class="q-mt-md text-black">
                    <div class="text-h6 q-pb-md">Nome<br>{{ Utils.toCamelCase(user.name) }}</div>
                    <div class="text-h6 q-pb-md">Email<br>{{ user.email }}</div>
                    <div class="text-h6 q-pb-md">CPF<br>{{ user.cpf }}</div>
                    <div class="text-h6 q-pb-md">Telefone<br>{{ user.phone }}</div>
                </div>
                <div v-else>
                    <div class="q-mt-md">
                        <q-input v-model="user.name" label="Nome" outlined dense>
                            <template v-slot:prepend>
                                <q-icon name="person" color="primary"/>
                            </template>
                        </q-input>
                    </div>
                    <div class="q-mt-md">
                        <q-input v-model="user.login" label="login" outlined dense>
                            <template v-slot:prepend>
                                <q-icon name="account_circle" color="primary"/>
                            </template>
                        </q-input>
                    </div>
                    <div class="q-mt-md">
                        <q-input v-model="user.email" label="Email" outlined dense>
                            <template v-slot:prepend>
                                <q-icon name="email" color="primary"/>
                            </template>
                        </q-input>
                    </div>
                    <div class="q-mt-md">
                        <q-input v-model="user.cpf" label="CPF" outlined dense>
                            <template v-slot:prepend>
                                <q-icon name="fingerprint" color="primary"/>
                            </template>
                        </q-input>
                    </div>
                    <div class="q-mt-md">
                        <q-input v-model="user.phone" label="Telefone" outlined dense>
                            <template v-slot:prepend>
                                <q-icon name="phone" color="primary"/>
                            </template>
                        </q-input>
                    </div>
                    <div class="q-mt-md">
                        <q-input v-model="user.newPassword" label="Nova Senha" outlined dense>
                            <template v-slot:prepend>
                                <q-icon name="lock" color="primary"/>
                            </template>
                        </q-input>
                    </div>
                    <div class="q-mt-md w100">
                        <q-btn v-if="!loading" @click="salvarEdicao()"  label="salvar alterações" icon-right="save" color="primary" class="w100 q-pa-md" glossy></q-btn>
                        <div v-else class="row w100 q-pt-xl justify-center">
                            <q-spinner-ball color="secondary" size="lg" />
                            <q-spinner-ball color="secondary" size="lg" />
                            <q-spinner-ball color="secondary" size="lg" />
                        </div>
                    </div>
                </div>
            </q-card-section>
        </q-card>
    </q-page>
</template>
<script setup>
import { ref } from "vue";
import { Utils } from 'src/utils/Utils';
import { api } from 'src/boot/axios';
import { useQuasar } from "quasar";

const user = ref(JSON.parse(sessionStorage.getItem("user")) || null);
// cópia do objeto user para comparar edicao
const userCopy = JSON.parse(JSON.stringify(user.value));
const editing = ref(false);
const loading = ref(false);

function retornar() {
    window.location.back();
}
const $q = useQuasar()

async function salvarEdicao() {
    loading.value = true
    await api.put('/user/edit', user.value)
        .then(response => {
            sessionStorage.setItem('user', JSON.stringify(response.data))
            $q.notify({
                color: 'primary',
                position: 'top',
                message: 'Perfil atualizado com sucesso',
                icon: 'edit'
            })
            editing.value = false
        })
        .catch(err => {
            $q.notify({
                color: 'secondary',
                position: 'top',
                message: err.response.data.error,
                icon: 'error',
            })
        })
        .finally(() => {
            loading.value = false
        })
}

</script>

<style scoped>

</style>