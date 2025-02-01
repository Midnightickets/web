<template>
  <q-page class="text-white bg-grey-3 q-pb-xl">
    <div id="title" class="q-pt-sm w100 text-primary text-center">
        Buscar Logs
    </div>
    <div style="border-left: 4px solid #9573f3;" class="shadow-2 bg-grey-4 row q-gutter-x-md q-gutter-y-md q-mx-md rounded-borders justify-start items-center q-pa-md q-mt-md">
    <q-select
        class="w100"
        v-model="filter.type"
        label="Tipo"
        outlined
        :options="typeOptions"
    >
        <template v-slot:prepend>
            <q-icon name="settings" :color="filter.type != null ? 'primary' : 'grey'"/>
        </template>
        <template v-slot:append>
            <q-btn icon="close" flat color="grey-14" @click="filter.type = null"></q-btn>
        </template>
    </q-select>
        <q-select
        class="w100"
        v-model="filter.sake_status"
        label="Status de Saque"
        outlined
        :options="sakeStatusOptions"
    >
        <template v-slot:prepend>
            <q-icon name="toggle_on" :color="filter.sake_status != null ? 'primary' : 'grey'"/>
        </template>
        <template v-slot:append>
            <q-btn icon="close" flat color="grey-14" @click="filter.sake_status = null"></q-btn>
        </template>
    </q-select>
        <q-input label="Log ID" maxlength="100" outlined v-model="filter._id">
            <template v-slot:prepend>
                <q-icon @click="colar('log')" name="description" :color="filter._id.trim() !== '' ? 'primary' : 'grey'"/>
            </template>
            <template v-slot:append>
                <q-btn icon="close" flat color="grey-14" @click="filter._id = ''"></q-btn>
            </template>
        </q-input>
        <q-input label="Host ID" maxlength="100" outlined v-model="filter.host">
            <template v-slot:prepend>
                <q-icon @click="colar('host')" name="diamond" :color="filter.host.trim() !== '' ? 'primary' : 'grey'"/>
            </template>
            <template v-slot:append>
                <q-btn icon="close" flat color="grey-14" @click="filter.host = ''"></q-btn>
            </template>
        </q-input>
        <q-input label="User ID" maxlength="100" outlined v-model="filter.user">
            <template v-slot:prepend>
                <q-icon @click="colar('user')" name="person" :color="filter.user.trim() !== '' ? 'primary' : 'grey'"/>
            </template>
            <template v-slot:append>
                <q-btn icon="close" flat color="grey-14" @click="filter.user = ''"></q-btn>
            </template>
        </q-input>
        <q-input label="Event ID" maxlength="100" outlined v-model="filter.event">
            <template v-slot:prepend>
                <q-icon @click="colar('event')" name="event" :color="filter.event.trim() !== '' ? 'primary' : 'grey'"/>
            </template>
            <template v-slot:append>
                <q-btn icon="close" flat color="grey-14" @click="filter.event = ''"></q-btn>
            </template>
        </q-input>
        <q-input label="Payment ID" maxlength="100" outlined v-model="filter.payment">
            <template v-slot:prepend>
                <q-icon @click="colar('payment')" name="payments" :color="filter.payment.trim() !== '' ? 'primary' : 'grey'"/>
            </template>
            <template v-slot:append>
                <q-btn icon="close" flat color="grey-14" @click="filter.payment = null"></q-btn>
            </template>
        </q-input>
        <div class="q-mb-md w100 row no-wrap justify-between items-center">
            <q-btn @click="cleanLogs()" :disabled="disableSearch()" class="w80 q-py-md" label="Limpar" color="orange-14" glossy></q-btn>
            <q-btn @click="buscarLogs()" :disabled="disableSearch()" class="w80 q-ml-md q-py-md" icon-right="search" label="Buscar" color="blue-14" glossy></q-btn>
        </div>
    </div>
    <div id="logs" v-if="logs.length > 0" class="w100 q-px-md q-mt-md rounded-borders">
        <q-list  class="row justify-center items-center q-gutter-md">
            <div id="title-layout" class="w100 text-primary justify-center items-center">
                {{ logs.length }} logs encontrado(s)
            </div>
            <q-card style="border-left: 6px solid #1D1D1D;" v-for="(log, index) in logs" :key="index" class="bg-grey-4 rounded-borders text-bold">
                <q-card-section>
                    <q-item-label id="title-2" class="row justify-center items-center text-dark">
                        <q-icon color="dark" :name="getIconByLogType(log.type)" class="q-mr-sm">
                        </q-icon> {{ log.type }}
                    </q-item-label>
                </q-card-section>
                <q-card-section v-if="log.host" class="w100 bg-grey-6">
                    [host] {{ log.host }}<br><br>
                    <div  v-if="log.type.includes('Saque')">
                        {{ log.content.price ? 'Saldo Saque: R$ ' + Utils.formatCurrency(log.content.price) : null }}<br>{{ log.content.final_price ? 'Saque Final: R$ ' + Utils.formatCurrency(log.content.final_price) : null }}
                    </div>
                </q-card-section>
                <q-card-section v-if="log.event" class="w100 bg-grey-6">
                    [evento] {{ log.event }}
                </q-card-section>
                <q-card-section v-if="log.ingresso" class="w100 bg-grey-6">
                    [ingresso] {{ log.ingresso }}
                </q-card-section>
                <q-card-section v-if="log.landing" class="w100 bg-grey-6">
                    [landing] {{ log.landing }}
                </q-card-section>
                <q-card-section v-if="log.payment" class="w100 bg-grey-6">
                    [pagamento] {{ log.payment }}
                </q-card-section>
                <q-card-section v-if="log.user" class="w100 bg-grey-6">
                    [usuário] {{ log.user }}
                </q-card-section>
                <q-card-section v-if="log.sake_status" class="w100 bg-grey-6" :class="log.sake_status.includes('Aguardando') ? 'text-orange-2' : 'text-green-2'">
                    {{ log.sake_status.includes('Aguardando') ? '🟡 ' + log.sake_status : '🟢 ' + log.sake_status }}<br>
                </q-card-section>
                <q-card-section  class="w100 bg-dark text-right">
                     {{ log.created_at }}
                </q-card-section>
                <q-card-section class="w100">
                    <q-btn @click="showLogJson(log)" label="ver log" color="primary" glossy class="w100" icon-right="visibility"></q-btn>
                    <q-btn v-if="log.type.includes('Saque')" @click="abrirSaqueDialog(log)" label="saque" color="green" glossy class="w100 q-mt-md" icon-right="attach_money"></q-btn>
                </q-card-section>
            </q-card>
        </q-list>
    </div>
    <q-dialog v-model="saqueDialog" persistent>
        <q-card class="bg-grey-4 text-white">
            <q-card-section>
                <q-item-label class="text-h6 text-primary text-bold">
                    💸 Efetivar Saque de {{ logHandler.host }}
                </q-item-label>
                <q-item-label class="text-dark q-py-md text-bold text-center">
                    Deseja efetivar o saque no valor<br>de<strong class="text-primary"> R$ {{ Utils.formatCurrency(logHandler.content.final_price) }}?</strong>
                </q-item-label>
                <q-file v-if="logHandler.content.comprovante_img_url === 'xxx'" outlined class="bg-grey-2" v-model="file" label="Comprovante Saque"
                                    @input="uploadImage" accept="image/*">
                                    <template v-slot:prepend>
                                        <q-icon name="image" color="primary" />
                                    </template>
                                    <template v-slot:append>
                                        <q-icon name="upload" color="primary" />
                                    </template>
                                </q-file>
            </q-card-section>
            <div v-if="logHandler.content && logHandler.content.comprovante_img_url" class="w100 row justify-center">
                <q-img v-if="logHandler.content.comprovante_img_url != 'xxx'" :src="logHandler.content.comprovante_img_url" style="width: 90%; height: 100%"  class="rounded-borders shadow-1"/>
                <div  v-if="logHandler.content.comprovante_img_url === 'xxx'" class="w100 row justify-center q-my-md rounded-borders">
                    <q-input label="Confirmar" v-model="confirmar" type="password" outlined class="q-mx-md rounded-borders bg-grey-2" color="primary">
                        <template v-slot:prepend>
                            <q-icon name="check" color="primary" />
                        </template>
                    </q-input>
                </div>
            </div>
            <q-card-actions align="right">
                <q-btn @click="saqueDialog = false" label="voltar" color="grey-14" flat></q-btn>
                <q-btn @click="uploadImage" v-if="logHandler.content.comprovante_img_url === 'xxx'" :disabled="confirmar.toLowerCase() != CONFIRM_ADMIN || logHandler.content.comprovante_img_url != 'xxx'" label="Efetivar" color="primary" glossy icon-right="currency_exchange"></q-btn>
            </q-card-actions>
        </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { useQuasar } from 'quasar';
import { api } from 'src/boot/axios';
import { Utils } from 'src/utils/Utils';
import { onBeforeMount, ref } from 'vue';

const confirmar = ref('')

const filter = ref({
    _id: '',
    payment: '',
    event: '',
    user: '',
    host: '',
    sake_status: null,
    type: null,
})
const CONFIRM_ADMIN =  ref('samuel')
const admin = JSON.parse(sessionStorage.getItem('admin'))
const $q = useQuasar()
const saqueDialog = ref(false)
const file = ref(null)
const typeOptions = [
    {value: 1, label: 'Novo Host Criado', icon: 'diamond'},
    {value: 2, label: 'Novo Evento Criado', icon: 'event'},
    {value: 3, label: 'Novo Usuário Criado', icon: 'person'},
    {value: 4, label: 'Ingressos Atualizados', icon: 'confirmation_number'},
    {value: 5, label: 'Solicitação de Saque', icon: 'attach_money'},
    {value: 7, label: 'Pagamento de Ingresso Bem Sucedido', icon: 'payments'},
    {value: 8, label: 'Ingresso Gerado com Sucesso', icon: 'confirmation_number'},
    {value: 9, label: 'Formulário de Landing Criado', icon: 'description'},
    {value: 10, label: 'Informações de Evento Atualizadas', icon: 'event'},
    {value: 11, label: 'Evento Finalizado', icon: 'event'},
    {value: 12, label: 'Evento Cancelado', icon: 'event'},
    {value: 13, label: 'Nova Cortesia Criada', icon: 'confirmation_number'},
    {value: 14, label: 'Check-in Realizado', icon: 'qr_code_scanner'},
]

const sakeStatusOptions = [
    {value: 1, label: 'Aguardando Saque', index_enum: 'SAKE_STATUS_REQUESTED'},
    {value: 2, label: 'Saque Realizado', index_enum: 'SAKE_STATUS_DONE'},
]

function cleanLogs() {
    logs.value = []
    filter.value = {
        _id: '',
        payment: '',
        event: '',
        user: '',
        host: '',
        sake_status: null,
        type: null,
    }
}

const logHandler = ref(null)
function abrirSaqueDialog(log) {
    logHandler.value = log
    saqueDialog.value = true
}

async function uploadImage() {
    if (!file.value) return;

    const formData = new FormData();
    formData.append("file", file.value);
    formData.append(
        "admin",
        JSON.stringify({ id: admin.id, token: admin.token }) // Serializa o log como JSON
    );
    formData.append("log", logHandler.value.id); // Adiciona o ID do evento ao FormData

    try {
        const response = await api.post("/saque/upload_image", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });

        $q.notify({
            color: "primary",
            textColor: "white",
            icon: "cloud_upload",
            position: "top",
            message: "Imagem enviada com sucesso",
        });

        logHandler.value.content.comprovante_img_url = response.data.imageUrl; // URL retornada do backend
        console.log("Imagem enviada:", response.data);
    } catch (error) {
        console.error("Erro ao enviar a imagem:", error);
    } finally {
        file.value = null;
        saqueDialog.value = false;
    }
}

async function showLogJson(log) {
    await api.post('/admin/log', { id: log.id, admin: { login: admin.login, token: admin.token } }).then((response) => {
        const formattedJson = JSON.stringify(response.data, null, 2);
        $q.dialog({
            title: 'Log',
            color: 'secondary',
            message: `<pre style="font-family: monospace; white-space: pre-wrap; text-align: left;">${formattedJson}</pre>`,
            html: true,
            ok: 'Fechar',
        })
    }).catch((error) => {
        $q.notify({
            color: 'orange-14',
            message: error.response.data.message,
            position: 'top',
            timeout: 2500,
        })
    })
}

const logs = ref([])

// const LogEnum = {
//     HOST_CREATED: 'Novo Host Criado',
//     NEW_EVENT: 'Novo Evento Criado',
//     NEW_USER: 'Novo Usuário Criado',
//     UPDATE_TICKET_TYPES: 'Ingressos Atualizados',
//     REQUEST_SAKE: 'Solicitação de Saque',
//     SAKE_STATUS_REQUESTED: 'Aguardando Saque',
//     INGRESSO_PAYMENT_SUCESSFULLY: 'Pagamento de Ingresso Bem Sucedido',
//     INGRESSO_GENERATED_SUCESSFULLY: 'Ingresso Gerado com Sucesso',
//     LANDING_FORM_CREATED: 'Formulário de Landing Criado',
//     UPDATE_EVENT: 'Informações de Evento Atualizadas',
//     UPDATE_EVENT_FINISHED: 'Evento Finalizado',
//     UPDATE_EVENT_CANCELED: 'Evento Cancelado',
//     NEW_CORTESIA: 'Nova Cortesia Criada',
//     EVENT_CHECKIN: 'Check-in Realizado',

// }


async function colar(params) {
    try {
        const text = await navigator.clipboard.readText();
        switch(params) {
            case 'log':
                filter.value._id = text
                break
            case 'user':
                filter.value.user = text
                break
            case 'host':
                filter.value.host = text
                break
            case 'event':
                filter.value.event = text
                break
            case 'payment':
                filter.value.payment = text
                break
        }
    } catch (err) {
        $q.notify({
            color: 'secondary',
            message: 'Erro ao colar',
            position: 'top',
            timeout: 500,
        })
    }
}

const buscarLogs = async () => {
    const admin = JSON.parse(sessionStorage.getItem('admin'))
    let req = {
        admin: {
            token: admin.token,
            login: admin.login,
        }
    }
    if(filter.value._id.trim() !== '') req._id = filter.value._id.trim()
    if(filter.value.payment.trim() !== '') req.payment = filter.value.payment.trim()
    if(filter.value.event.trim() !== '') req.event = filter.value.event.trim()
    if(filter.value.user.trim() !== '') req.user = filter.value.user.trim()
    if(filter.value.host.trim() !== '') req.host = filter.value.host.trim()
    if(filter.value.sake_status !== null) req.sake_status = filter.value.sake_status.label
    if(filter.value.type !== null) req.type = filter.value.type.label
    await api.post('/admin/logs', req).then((response) => {
        if(response.data.length === 0) {
            $q.notify({
                color: 'secondary',
                icon: 'info',
                message: 'Nenhum log encontrado',
                position: 'top',
                timeout: 2500,
            })
            return
        }
        logs.value = response.data.reverse()
    }).catch((error) => {
        $q.notify({
            color: 'orange-14',
            message: error.response.data.message,
            position: 'top',
            timeout: 2500,
        })
    })
}

function disableSearch() {
    return filter.value.payment.trim() === '' && filter.value.event.trim() === '' && filter.value.user.trim() === '' && filter.value.host.trim() === '' && filter.value.sake_status === null && filter.value.type === null && filter.value._id.trim() === ''
}

function getIconByLogType(type) {
    const log = typeOptions.find((option) => option.label === type)
    return log.icon
}

</script>

<style scoped>
.q-input, .q-select {
    width: 80vw;
}
@media (min-width: 800px) {
    .q-input {
        width: 24vw;
    }
    .q-select {
        width: 35vw;
    }
}

</style>