<template>
    <q-page class=" w100 animate__animated animate__fadeIn relative q-pb-xl">
        <div class="w100">
            <q-btn to='/host' dense class="q-pr-xs" flat icon="keyboard_return" label="eventos"  color="primary" glossy>
            </q-btn>
        </div>
        <div id="title" class="text-primary q-px-sm q-pb-sm text-center">
            Meu Perfil
        </div>
        <div class="w100 row justify-center items-start relative q-mb-md">
            <q-avatar style="width:160px;height:160px;" class="shadow-2">
                <img style="border-bottom: 4px solid #9573f3;" v-if="host.img_url" :src="host.img_url" alt="">
                <q-icon style="border-bottom: 4px solid #9573f3;" v-else name="account_circle" size="200px" color="purple-1" />
            </q-avatar>
        </div>
        <div class="w100 row justify-center q-mb-md q-gutter-x-md q-gutter-y-md">
            <q-btn v-if="!editando" @click="editando = !editando" label="Editar Pefil" color="orange-14" glossy
                icon-right="account_circle"></q-btn>
            <q-btn @click="openPerfilPublico()" v-if="!editando" label="Perfil Público" color="primary" glossy
                icon-right="public"></q-btn>
            <q-btn v-if="editando" @click="modalUploadImagem = true" label="Alterar Foto" class="q-mb-md" color="blue-14" glossy
                icon-right="upload"></q-btn>
        </div>
        <div v-if="host" class="row wrap w100 q-pl-md q-mt-md cards-wrapper justify-center q-gutter-x-md items-start">
            <q-card v-if="!editando" class="q-mb-md animate__animated animate__fadeInRight" style="border-left: 4px solid #9573f3;">
                
                <q-card-section class="q-pa-md">
                    <div class="text-h6 text-primary">Nome</div>
                    <div class="text-h6">{{ Utils.toCamelCase(host.name) }}</div>
                </q-card-section>
                <q-card-section class="q-pa-md">
                    <div class="text-h6 text-primary">Login</div>
                    <div class="text-h6">{{ host.login }}</div>
                </q-card-section>
                <q-card-section class="q-pa-md">
                    <div class="text-h6 text-primary">Email</div>
                    <div class="text-h6">{{ host.email }}</div>
                </q-card-section>
            </q-card>
            <q-card v-else class="q-mb-md animate__animated animate__fadeInRight" style="border-left: 4px solid orange;">
                <div id="" class="text-h6 text-orange-14 text-bold q-px-md  q-mt-md row justify-start items-center">
                    Editando Perfil
                </div>
                <div class="w100 q-px-md column justify-center items-center">
                    <q-btn @click="editando = !editando" class="q-mt-md" label="Cancelar" flat color="primary"></q-btn>
                </div>
                <q-card-section class="q-pa-md">
                    <q-input v-model="host.name" outlined label="Nome">
                        <template v-slot:prepend>
                            <q-icon name="person"  color="orange-14"/>
                        </template>
                    </q-input>
                </q-card-section>
                <q-card-section class="q-pa-md">
                    <q-input v-model="host.login" outlined label="Login">
                        <template v-slot:prepend>
                            <q-icon name="account_circle"  color="orange-14"/>
                        </template>
                    </q-input>
                </q-card-section>
                <q-card-section class="q-pa-md">
                    <q-input v-model="host.cpf_cnpj" outlined label="CPF ou CNPJ" type="number">
                        <template v-slot:prepend>
                            <q-icon name="fingerprint"  color="orange-14"/>
                        </template>
                    </q-input>
                </q-card-section>
                <q-card-section class="q-pa-md">
                    <q-input v-model="host.email" outlined label="Email">
                        <template v-slot:prepend>
                            <q-icon name="email"  color="orange-14"/>
                        </template>
                    </q-input>
                </q-card-section>
                <q-card-section class="q-pa-md">
                    <q-input v-model="host.newPassword" outlined label="Nova Senha">
                        <template v-slot:prepend>
                            <q-icon name="lock"  color="orange-14"/>
                        </template>
                    </q-input>
                </q-card-section>
                <!-- telefone -->
                <q-card-section class="q-pa-md">
                    <q-input v-model="host.phone" outlined label="Telefone" mask="(##) #####-####" type="tel">
                        <template v-slot:prepend>
                            <q-icon name="phone"  color="orange-14"/>
                        </template>
                    </q-input>
                </q-card-section>
                <q-card-section class="q-pa-md">
                    <q-select v-model="host.pix_key.type" class="q-mb-md" outlined label="Tipo de Chave Pix" :options="['CPF', 'CNPJ', 'Telefone', 'Email', 'Aleatório']">
                        <template v-slot:prepend>
                            <q-icon name="account_balance"  color="orange-14"/>
                        </template>
                    </q-select>
                    <q-input v-model="host.pix_key.key" outlined label="Chave Pix">
                        <template v-slot:prepend>
                            <q-icon name="paid"  color="orange-14"/>
                        </template>
                        <template v-slot:append>
                            <q-icon name="content_paste" @click="pasteCode()" color="orange-14"/>
                        </template>
                    </q-input>
                </q-card-section>
                <q-card-section class="w100 row justify-between">
                    <q-btn @click="editando = !editando" label="Cancelar" flat color="primary"></q-btn>
                    <q-btn @click="salvarEdicao()" :disabled="!host.email.includes('@') || !host.email.includes('.')" label="Salvar" class="q-pa-md" icon-right="save" color="orange-14" glossy></q-btn>
                </q-card-section>
            </q-card>
            <q-card v-if="!editando" class="q-mb-md animate__animated animate__fadeInLeft" style="border-right: 4px solid #9573f3;">
                <q-card-section class="q-pa-md">
                    <div class="text-h5 text-primary">Saldo</div>
                    <div class="text-h6 ">R$ {{ Utils.formatCurrency(host.balance) }}</div>
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
        <q-dialog v-model="modalUploadImagem">
            <div class="bg-white column">
                <q-card>
                    <div id="title-2" class="text-primary q-pt-md q-pl-md">
                        Foto do Perfil
                    </div>
                    <q-card-section>
                        <q-file outlined class="bg-grey-2" v-model="file" label="Selecione uma imagem"
                            @update:model-value="uploadImage" accept="image/*">
                            <template v-slot:prepend>
                                <q-icon name="image" color="primary" />
                            </template>
                            <template v-slot:append>
                                <q-icon name="upload" color="primary" />
                            </template>
                        </q-file>
                    </q-card-section>
                    <q-card-section>
                        <q-img :src="host.img_url" />
                    </q-card-section>
                    <q-card-actions align="right">
                        <q-btn @click="modalUploadImagem = false" flat label="ok" color="primary" />
                    </q-card-actions>
                </q-card>
            </div>
        </q-dialog>
    </q-page>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { api } from 'src/boot/axios';
import { useQuasar } from "quasar";
import { Utils } from "src/utils/Utils";

const editando = ref(false);

const host = ref(JSON.parse(sessionStorage.getItem('host')) || null);
const $q = useQuasar()
const passwordModal = ref(false);
const modalUploadImagem = ref(false);
const passwordOptions = ref({
    password: '',
    visibility: false,
    type: ''
})

function confirmPassword(type) {
    passwordModal.value = true;
    passwordOptions.value.type = type;
}

async function salvarEdicao() {
    await api.put('/host/edit', host.value)
        .then(response => {
            sessionStorage.setItem('host', JSON.stringify(response.data))
            $q.notify({
                color: 'positive',
                position: 'top',
                message: 'Perfil atualizado com sucesso',
                icon: 'check_circle'
            })
            editando.value = false
            setTimeout(() => {
                window.location.reload()
            }, 500)
        })
        .catch(err => {
            $q.notify({
                color: 'negative',
                position: 'top',
                message: err.response.data.error,
                icon: 'report_problem',
            })
        })
}

const file = ref(null);
async function uploadImage() {
    if (!file.value) return;

    const formData = new FormData();
    formData.append("file", file.value);
    formData.append(
        "host",
        JSON.stringify({ id: host.value.id, token: host.value.token }) // Serializa o host como JSON
    );
    formData.append("hostId", host.value.id); // Adiciona o ID do host ao FormData

    try {
        const response = await api.post("/host/upload_image", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });

        $q.notify({
            color: "primary",
            textColor: "white",
            icon: "cloud_upload",
            position: "top",
            message: "Imagem enviada com sucesso",
        });
        host.value.img_url = response.data.imageUrl; // URL retornada do backend
        sessionStorage.setItem('host', JSON.stringify(host.value))
        console.log("Imagem enviada:", response.data);
    } catch (error) {
        console.error("Erro ao enviar a imagem:", error);
    }
}


async function solicitar() {
    await updateLogin().then(() => {
        if (passwordOptions.value.type == 'request_saque') {
            api.get('/midnightickets?host=' + host.value.id )
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

function pasteCode() {
    navigator.clipboard.readText().then(text => {
        host.value.pix_key.key = text
    })
}

function cancelar() {
    editando.value = false
    passwordOptions.value.password = ''
    passwordOptions.value.visibility = false
    passwordOptions.value.type = ''
    passwordModal.value = false
}

function openPerfilPublico() {
    window.open('/' + host.value.login, '_blank')
}

async function updateLogin() {
    await api.post('/login/host', { login: host.value.login, password: passwordOptions.value.password.trim() })
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