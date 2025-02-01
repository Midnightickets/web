<template>
    <q-page class="q-pb-xl bg-grey-4 animate__animated animate__fadeIn">
        <div v-if="evento != null" class="text-secondary">
            <div class="w100 no-wrap row justify-between q-pt-sm q-mb-sm">
                <q-btn @click="goTo('/host')" dense glossy flat icon="keyboard_return" class="shadow-1 q-pa-sm q-ml-sm"
                    color="primary">
                </q-btn>
                <div>
                    <q-btn 
                      @click="goToSetting('/vendas-evento')" 
                      class="q-pa-sm rounded-borders shadow-1"
                      dense 
                      glossy 
                      flat 
                      icon="payments" 
                      color="primary"
                    >
                      <q-tooltip anchor="top" self="bottom">Vendas do Evento</q-tooltip>
                    </q-btn>
                    <q-btn 
                      @click="goToSetting('/andamento-evento')" 
                      class="q-pa-sm rounded-borders shadow-1 q-ml-sm"
                      dense 
                      glossy 
                      flat 
                      icon="sensor_occupied" 
                      color="primary"
                    >
                      <q-tooltip anchor="top" self="bottom">Andamento do Evento</q-tooltip>
                    </q-btn>
                    <q-btn 
                      @click="shareEvent(evento.event_url)" 
                      class="q-pa-sm rounded-borders shadow-1 q-mx-sm"
                      dense 
                      glossy 
                      flat 
                      icon="share" 
                      color="primary"
                    >
                      <q-tooltip anchor="top" self="bottom">Compartilhar Evento</q-tooltip>
                    </q-btn>
                  </div>
                  
            </div>
            <div id="title" class="text-primary q-pl-md">{{ evento.title }}</div>
            <div class="text-primary text-bold q-pb-sm q-pl-md">{{ evento.status }}</div>
            <div class="text-primary text-bold q-pl-md">🕑 {{ evento.date.replaceAll("-", "/") }} {{
                (evento.initial_time ? ' às ' +
                    evento.initial_time : '') +
                (evento.final_time ? (' - ' + evento.final_time) : '' ) }}</div>
            <q-btn @click="openImgDialog()" label="Banner do Evento"
                glossy icon-right="image" class="q-pa-md q-ml-md q-mt-md" dense :color="evento.img_url ? 'green' : 'grey'"></q-btn>
            <q-btn v-if="evento.status.includes('andamento')" @click="previewPublicEvent(evento.event_url)"
                label="Evento Preview" glossy icon-right="event" class="q-pa-md q-ml-md q-mt-md" dense
                color="primary"></q-btn>
            <div v-if="!loading" class="q-card-wrapper row justify-center ">
                <q-card class="w100 q-mt-md" :class="editando ? 'bg-orangy' : ''">
                    <div id="title-menu" class="text-primary w100 q-pt-md text-center">
                        {{ editando ? 'Editando Informações' : 'Informações' }}
                    </div>
                    <div class="w100 row justify-between q-px-md">
                        <q-btn v-if="evento.status.includes('andamento') && editando" class="w100 q-pa-md q-mt-md" label="salvar alterações"
                        :disabled="checkEdit()" @click="updateEventInfo()"
                        icon-right="save" color="orange-14" glossy></q-btn>
                        <q-btn v-if="evento.status.includes('andamento')" @click="alternarEdicao()"
                            :label="!editando ? 'Editar Evento' : 'cancelar'"
                            :icon-right="!editando ? 'edit' : 'cancel'" :flat="editando" class="q-mt-md q-px-md " dense
                            :color="!editando ? 'orange-14' : 'primary'" glossy></q-btn>
                    </div>
                    <q-dialog v-model="dialogImg">
                        <q-card>
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
                            <q-card-section >
                                <img :src="evento.img_url" class="w100 rounded-borders shadow-2" alt="Banner do Evento">
                            </q-card-section>
                            <q-card-section v-if="imgLoading">
                                <div class="row w100 q-pt-xl justify-center">
                                    <q-spinner-ball color="secondary" size="lg" />
                                    <q-spinner-ball color="secondary" size="lg" />
                                    <q-spinner-ball color="secondary" size="lg" />
                                </div>    
                            </q-card-section>
                            <q-card-actions align="right">
                                <q-btn flat label="ok" color="primary" v-close-popup />
                                <!-- <q-btn @click="uploadImage" label="Salvar Imagem" color="primary" glossy icon-right="cloud_upload"
                                class="q-pa-md" :disabled="!file"></q-btn> -->
                            </q-card-actions>
                        </q-card>
                    </q-dialog>
                    <q-card-section v-if="!editando">
                        <div class="text-h6 text-primary row items-center">
                            <q-icon class="q-pr-xs" color="primary" name="description" size="sm" />
                            Descrição
                        </div>
                        <div class="text-grey-7 text-bold" style="font-size: 16px;white-space: pre-wrap">{{ evento.desc
                            }}</div>
                    </q-card-section>
                    <q-card-section v-if="!editando">
                        <div class="text-h6 text-primary row items-center">
                            <q-icon class="q-pr-xs" color="primary" name="location_city" size="sm" />
                            Endereço
                        </div>
                        <div class="text-grey-7 text-bold" style="font-size: 16px;white-space: pre-wrap">{{
                            evento.address }}</div>
                    </q-card-section>
                    <q-card-section v-if="!editando">
                        <div class="text-h6 text-primary row items-center">
                            <q-icon class="q-pr-xs" color="primary" name="phone" size="sm" />
                            Contato
                        </div>
                        <div class="text-grey-7 text-bold" style="font-size: 16px;white-space: pre-wrap">{{
                            evento.contact }}</div>
                    </q-card-section>
                    <q-card-section v-if="evento.maps_loc && !editando">
                        <div class="text-h6 text-primary q-mb-sm row items-center">
                            <q-icon class="q-pr-xs" color="primary" name="location_on" size="sm" />
                            Localização
                        </div>
                        <iframe :src="evento.maps_loc" class="w100 rounded-borders shadow-1" height="450" style="border:0;" loading="lazy"
                            referrerpolicy="no-referrer-when-downgrade"></iframe>
                    </q-card-section>
                    <!-- MODO EDITANDO -->
                    <div v-if="editando" class="editando w100 q-py-md q-px-md q-gutter-y-md">
                        <q-input class="bg-grey-2" :inputStyle="{ fontWeight: 'bold' }" outlined v-model="evento.title"
                            label="Título*" color="primary">
                            <template v-slot:append>
                                <q-icon name="title" color="primary" size="xs" />
                            </template>
                        </q-input>
                        <q-input class="bg-grey-2" :inputStyle="{ fontWeight: 'bold' }" type="textarea" outlined
                            v-model="evento.desc" label="Descrição" color="primary">
                            <template v-slot:append>
                                <q-icon name="description" color="primary" size="xs" />
                            </template>
                        </q-input>
                        <q-input class="bg-grey-2" :inputStyle="{ fontWeight: 'bold' }" type="textarea" outlined
                            v-model="evento.address" label="Endereço*" color="primary">
                            <template v-slot:append>
                                <q-icon name="location_city" color="primary" size="xs" />
                            </template>
                        </q-input>
                        <q-input class="bg-grey-2" :inputStyle="{ fontWeight: 'bold' }" type="textarea" outlined
                            v-model="evento.contact" label="Contato*" color="primary">
                            <template v-slot:append>
                                <q-icon name="phone" color="primary" size="xs" />
                            </template>
                        </q-input>
                        <div class="text-secondary" id="title-layout">Data do Evento é Obrigatória*</div>
                        <q-date id="date-picker" class="w100" v-model="evento.date" mask="DD-MM-YYYY" :options="(date) => {
                            const today = new Date();
                            const yesterday = new Date(today);
                            yesterday.setDate(today.getDate());
                            const minDate = yesterday.toISOString().split('T')[0];
                            const mydate = new Date(date);
                            return mydate >= new Date(minDate);
                        }" color="primary" />
                        <div class="w100 row no-wrap q-gutter-x-sm bg justify-center items-center">
                            <q-input id="times" label="Início" class="bg-grey-2" outlined v-model="evento.initial_time"
                                mask="time" :rules="['time']">
                                <template v-slot:append>
                                    <q-icon name="access_time" color="primary" class="cursor-pointer">
                                        <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                                            <q-time v-model="evento.initial_time">
                                                <div class="row items-center justify-end">
                                                    <q-btn v-close-popup label="Fechar" color="primary" flat />
                                                </div>
                                            </q-time>
                                        </q-popup-proxy>
                                    </q-icon>
                                </template>
                            </q-input>
                            <q-input label="Final" class="bg-grey-2" outlined v-model="evento.final_time" mask="time"
                                :rules="['time']">
                                <template v-slot:append>
                                    <q-icon name="access_time" color="primary" class="cursor-pointer">
                                        <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                                            <q-time v-model="evento.final_time">
                                                <div class="row items-center justify-end">
                                                    <q-btn v-close-popup label="Fechar" color="primary" flat />
                                                </div>
                                            </q-time>
                                        </q-popup-proxy>
                                    </q-icon>
                                </template>
                            </q-input>
                        </div>
                        <q-input :inputStyle="{ fontWeight: 'bold' }" outlined class="bg-grey-2"
                            v-model="evento.maps_loc" label="Localização Google Maps" color="primary">
                            <template v-slot:append>
                                <q-icon name="location_on" color="primary" size="xs" />
                            </template>
                        </q-input>
                        <q-btn :disabled="checkEdit()" @click="updateEventInfo()" label="salvar alterações" color="orange-14"
                             icon-right="save" class="w100 q-py-md" glossy></q-btn>
                    </div>

                </q-card>
                <q-card class="w100 q-mx-md q-mt-md">
                    <div id="title-menu" class="text-primary w100 q-pt-md text-center">
                        Ingressos
                    </div>
                    <div class="w100 q-ml-md q-mt-md" v-if="evento.status.includes('andamento')">
                        <q-btn @click="modalPackage = !modalPackage" label="Adicionar Ingressos" glossy
                            icon-right="add_circle" color="primary"></q-btn>
                    </div>
                    <q-card-section>
                        <div v-for="ticket in evento.ticket_types" :key="ticket.id"
                            :class="ticket.status ? 'bg-blue-1' : 'bg-grey-3'" class="q-pa-sm">
                            <div class="text-bold text-primary" :class="ticket.status ? '' : 'mid-opacity'"><q-icon
                                    name="local_activity" color="primary" size="xs"></q-icon> {{ ticket.title }}</div>
                            <div class="text-bold text-secondary" :class="ticket.status ? '' : 'mid-opacity'"><q-icon
                                    name="confirmation_number" color="secondary" size="xs"></q-icon> {{ ticket.sales ?
                                ticket.sales : 0
                                }} vendidos</div>
                            <div class="row items-center justify-between q-mt-sm">
                                <div :class="ticket.status ? '' : 'mid-opacity'"
                                    class="text-bold bg-secondary q-pa-xs rounded-borders text-white">{{ 'R$ ' +
                                    Utils.formatCurrency(ticket.price) }}</div>
                                <q-toggle v-if="evento.status.includes('andamento')"
                                    :class="ticket.status ? 'text-green' : 'text-orange-14'" class="text-bold"
                                    v-model="ticket.status" @update:model-value="updateStatusTickets()" left-label
                                    :label="ticket.status ? 'Ativo' : 'Inativo'" color="green"></q-toggle>
                            </div>
                            <div class="w100 bg-secondary q-pt-xs q-my-sm rounded-borders"></div>
                        </div>
                    </q-card-section>
                </q-card>
                <q-card class="w100 q-mx-md q-mt-md">
                    <div id="title-menu" class="text-primary w100 q-pt-md text-center">
                        Acesso
                    </div>
                    <q-btn v-if="evento.status.includes('andamento')" @click="openSubhostModal()"
                        label="Adicionar permissão" icon-right="person_add" color="primary" glossy
                        class="q-mt-md q-ml-md"></q-btn>
                    <q-card-section>
                        <div v-if="evento.subhosts.length > 0" class="text-h6 text-primary">Subhosts Cadastrados: {{
                            evento.subhosts.length }}</div>
                        <div id="evento-subhosts" class="relative">
                            <div v-for="subhost in evento.subhosts" :key="subhost" id="subhost"
                                class="relative rounded-borders shadow-2 q-mt-md">
                                <div class="text-bold text-primary">{{ subhost.name }}</div>
                                <div class="text-bold text-secondary">{{ subhost.login.toLowerCase() }}</div>
                                <q-dialog v-model="showSubhostsPassword" class="text-bold  text-primary">
                                    <div class="w100 bg-white q-pa-xl">
                                        {{subhost.login}}#{{subhost.password}}#{{evento.id}}
                                    </div>
                                    <q-btn label="ok" glossy @click="showSubhostsPassword = false" color="primary"></q-btn>
                                </q-dialog>
                                <div class="w100 row q-gutter-x-sm" v-if="evento.status.includes('andamento')">
                                    <q-btn @click="copyCredentials(subhost)" icon="file_copy" icon-right="key"
                                        label="Copiar Credenciais" color="blue-14" glossy class=" q-mt-sm"></q-btn>
                                </div>
                                <q-btn v-if="evento.status.includes('andamento')" color="secondary" flat
                                    @click="removeSubhost(subhost)" icon-right="delete"
                                    class="q-mt-md absolute-top-right"></q-btn>
                            </div>
                        </div>
                    </q-card-section>
                </q-card>
            </div>
            <div class="w100 q-mt-xl q-px-sm" v-if="!loading">
                <q-btn class="w100 q-py-xl" to="/host/andamento-evento"
                    :label="evento.status.includes('andamento') ? 'Andamento do Evento' : 'Histórico do Evento'"
                    color="primary" glossy
                    :icon-right="evento.status.includes('andamento') ? 'visibility' : 'history'"></q-btn>
                <q-btn class="w100 q-py-xl q-mt-md" @click="goToVendas()" label="Painel de Vendas" color="green" glossy
                    icon-right="payments"></q-btn>
                <q-btn v-if="evento.status.includes('andamento')" class="w100 q-py-md q-mt-md" label="Finalizar Evento"
                    @click="confirmChangeStatusEvento('FINALIZADO')" color="blue-14" glossy
                    icon-right="event_available"></q-btn>
                <!-- <q-btn v-if="evento.status.includes('andamento')" class="w100 q-py-md q-mt-sm" label="Cancelar Evento" @click="confirmChangeStatusEvento('CANCELADO')" color="red-4" flat></q-btn> -->
            </div>
            <q-dialog v-model="modalPackage">
                <q-card>
                    <q-card-section class="q-gutter-y-sm">
                        <div id="title-menu" class="text-primary">Adicionar Ingressos</div>
                        <q-input :inputStyle="{ fontWeight: 'bold' }" outlined maxlength="40"
                            v-model="packageHandler.title" label="Título do Ingresso*" color="primary">
                            <template v-slot:append>
                                <q-icon name="local_activity" color="primary" size="xs" />
                            </template>
                        </q-input>
                        <q-input :inputStyle="{ fontWeight: 'bold' }" outlined v-model="packageHandler.price"
                            maxlength="7" prefix="R$" label="Preço*" reverse-fill-mask mask="####,##" color="primary">
                            <template v-slot:append>
                                <q-icon name="attach_money" color="primary" size="xs" />
                            </template>
                        </q-input>
                    </q-card-section>
                    <div class="w100 row items-center justify-center q-pb-sm q-px-md">
                        <q-btn label="Adicionar" @click="addPackage()"
                            :disabled="packageHandler.title.trim() == '' || packageHandler.price.trim() == ''"
                            color="primary" icon-right="add" class="q-py-md q-mb-sm w100" glossy></q-btn>
                        <q-btn flat label="Cancelar" color="secondary" v-close-popup />
                    </div>
                </q-card>
            </q-dialog>
            <q-dialog v-model="modalSubhosts">
                <q-card>
                    <q-card-section class="q-gutter-y-sm">
                        <div id="title-menu" class="text-primary">Subhosts Disponíveis</div>
                        <q-btn label="gerenciar acessos" class="q-px-md" icon-right="sensor_occupied" color="primary"
                            glossy to="/host/acessos" dense></q-btn>
                        <div id="subhost" v-for="subhost in subhostOptions" :key="subhost.login"
                            class="q-mt-md rounded-borders shadow-2">
                            <div class="text-bold text-primary">🟢 {{ subhost.name }}</div>
                            <div class="text-bold text-secondary">🔓 {{ subhost.login.toLowerCase() }}</div>
                            <div class="w100 row q-gutter-x-sm">
                                <q-btn @click="permitirSubhost(subhost)" label="permitir" icon-right="person_add"
                                    color="green-14" glossy class=" q-mt-sm"></q-btn>
                            </div>
                        </div>
                    </q-card-section>
                    <div class="w100 row items-center justify-center q-pb-sm q-px-md">
                        <q-btn flat label="Fechar" color="secondary" v-close-popup />
                    </div>
                </q-card>
            </q-dialog>
        </div>
        <div v-if="loading" class="row w100 q-pt-xl justify-center">
            <q-spinner-ball color="secondary" size="lg" />
            <q-spinner-ball color="secondary" size="lg" />
            <q-spinner-ball color="secondary" size="lg" />
        </div>
    </q-page>
</template>

<script setup>
import { useQuasar } from 'quasar';
import { api } from 'src/boot/axios';
import { Utils } from 'src/utils/Utils';
import { onBeforeMount, onBeforeUnmount, ref } from 'vue';
import { useRouter } from 'vue-router';

const showSubhostsPassword = ref(false);
const hostInfo = sessionStorage.getItem('host') ? JSON.parse(sessionStorage.getItem('host')) : null;
const editando = ref(false);
const loading = ref(false)
const evento = ref(null);
const eventoBefore = ref(null);
const dialogImg = ref(false);
const router = useRouter();
const modalPackage = ref(false);
const modalSubhosts = ref(false);
const file = ref(null);
const $q = useQuasar();
const imgLoading = ref(true);
const packageHandler = ref({
    title: '',
    price: '',
    status: true
});
const subhostOptions = ref([]);

async function permitirSubhost(subhost) {
    evento.value.subhosts.push(subhost);
    await updateEventInfo()
        .then(() => {
            modalSubhosts.value = false;
        })
}

async function uploadImage() {
    if (!file.value) return;

    const formData = new FormData();
    formData.append("file", file.value);
    formData.append(
        "host",
        JSON.stringify({ id: hostInfo.id, token: hostInfo.token }) // Serializa o host como JSON
    );
    formData.append("event", evento.value.id); // Adiciona o ID do evento ao FormData

    try {
        const response = await api.post("/event/upload_image", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        $q.notify({
            color: "primary",
            textColor: "white",
            icon: "cloud_upload",
            position: "top",
            message: "Imagem enviada com sucesso",
        });
        evento.value.img_url = response.data.imageUrl; // URL retornada do backend
        console.log("Imagem enviada:", response.data);
    } catch (error) {
        console.error("Erro ao enviar a imagem:", error);
    } finally {
        dialogImg.value = false;
        imgLoading.value = true;
    }
}


function goToVendas() {
    sessionStorage.setItem('evento_title', evento.value.title);
    sessionStorage.setItem('evento_venda', evento.value.id);
    router.push('/host/vendas-evento');
}

function previewPublicEvent(eventId) {
    window.open(window.location.origin + '/events/' + eventId, '_blank');
}

async function shareEvent(eventUrl) {
    const shareData = {
        title: evento.value.title,
        url: 'https://midnightickets.com/events/' + eventUrl,
    }
    navigator.share(shareData)
    .then(() => console.log('Successful share'))
    .catch((error) => console.log('Error sharing', error));
    await navigator.clipboard.writeText(shareData.url)

}

async function removeSubhost(subhost) {
    if (window.confirm('Deseja realmente remover o acesso do subhost ' + subhost.name + '?\n(˘･_･˘)')) {
        evento.value.subhosts = evento.value.subhosts.filter(sub => sub.login != subhost.login);
        await updateEventInfo();
    }
}
async function openSubhostModal() {
    await getSubhosts();
    modalSubhosts.value = true;
}

function goToSetting(path) {
    switch (path) {
        case '/vendas-evento':
            sessionStorage.setItem('evento_venda', evento.value.id);
            break;
        case '/andamento-evento':
            sessionStorage.setItem('evento_andamento', evento.value.id);
            break;
    }
    router.push('/host' + path);
}

async function getSubhosts() {
    const req = {
        id: hostInfo.id,
        token: hostInfo.token
    };

    await api.post('/host/get_subhosts', req)
        .then(response => {
            const existingSubhosts = evento.value.subhosts.map(subhost => subhost.login);
            subhostOptions.value = response.data.subhosts.filter(
                subhost => !existingSubhosts.includes(subhost.login)
            );
        })
        .catch(error => {
            console.error('Erro ao buscar subhosts:', error);
        });
}


function copyCredentials(subhost) {
    showSubhostsPassword.value = true
    navigator.clipboard.writeText(`🎫 MIDNIGHT TICKETS\n\nSegue abaixo seu código de acesso para validar ingressos no evento ${evento.value.title}:\n\n${subhost.login}#${subhost.password}#${evento.value.id}
    \nMANTENHA AS CREDENCIAIS SEGURAS E NÃO COMPARTILHE COM TERCEIROS\n\n🎟️ Acesse: https://midnightickets.com/login-subhost`);
    $q.notify({
        color: 'blue-14',
        textColor: 'white',
        icon: 'content_paste',
        position: 'top',
        message: 'Credenciais copiadas para a área de transferência',
    });
}

function alternarEdicao() {
    if (editando.value) {
        evento.value = eventoBefore.value;
        editando.value = false;
        return;
    }
    editando.value = !editando.value;
}

function checkEdit() {
    if (evento.value.title.trim() == '' || evento.value.address.trim() == '' || evento.value.contact.trim() == '' || evento.value.date.trim() == '') return true
    const checkEventoIgualEventoBefore = () => {
        if (evento.value.title == eventoBefore.value.title && evento.value.desc == eventoBefore.value.desc && evento.value.address == eventoBefore.value.address && evento.value.contact == eventoBefore.value.contact && evento.value.date == eventoBefore.value.date && evento.value.initial_time == eventoBefore.value.initial_time && evento.value.final_time == eventoBefore.value.final_time && evento.value.maps_loc == eventoBefore.value.maps_loc && evento.value.img_url == eventoBefore.value.img_url) {
            return true;
        }
        return false;
    }
    return checkEventoIgualEventoBefore()
}

async function addPackage() {
    const array = []
    evento.value.ticket_types.forEach(ticket => {
        array.push(ticket)
    })
    array.push(packageHandler.value)
    if (Utils.checkSameTicketTypeTitle(array)) {
        $q.notify({
            color: 'secondary',
            position: 'top',
            message: 'Já existe um pacote com esse nome',
            icon: 'report_problem'
        });
        return;
    } else {
        packageHandler.value.price = Number(packageHandler.value.price.replace(',', '.')).toFixed(2).toString().replace('.', ',');
        evento.value.ticket_types.push(packageHandler.value);
        await updateTicketTypes();
    }
}

async function updateTicketTypes() {
    loading.value = true;
    const reqObject = {
        host: {
            id: hostInfo.id,
            token: hostInfo.token
        },
        event_id: evento.value.id,
        ticket_types: evento.value.ticket_types
    }
    await api.put('/update_ticket_types', reqObject)
        .then(response => {
            $q.notify({
                color: 'primary',
                position: 'top',
                message: response.data.message,
                icon: 'local_activity'
            });
            getEvento();
        })
        .catch(error => {
            $q.notify({
                color: 'red-14',
                position: 'top',
                message: error.response.data.error,
                icon: 'report_problem'
            });
        })
        .finally(() => {
            packageHandler.value = {
                title: '',
                price: '',
                status: true
            }
            modalPackage.value = false;
            loading.value = false;
        });
}

async function getEvento() {
    loading.value = true;
    const reqObject = {
        host: {
            id: hostInfo.id,
            token: hostInfo.token
        },
        event: sessionStorage.getItem('evento')
    }
    await api.post('/host/event', reqObject)
        .then(response => {
            evento.value = response.data;
            eventoBefore.value = JSON.parse(JSON.stringify(evento.value));
        })
        .finally(() => {
            loading.value = false;
        });
}

function goTo(path) {
    router.push(path);
}

async function updateStatusTickets() {
    await updateTicketTypes()
        .finally(() => {
            getEvento();
        })
}

async function updateEventInfo() {
    const req = {
        host: {
            id: hostInfo.id,
            token: hostInfo.token
        },
        id: evento.value.id,
        title: evento.value.title,
        desc: evento.value.desc,
        address: evento.value.address,
        contact: evento.value.contact,
        date: evento.value.date,
        maps_loc: evento.value.maps_loc,
        img_url: evento.value.img_url,
        initial_time: evento.value.initial_time,
        final_time: evento.value.final_time,
        subhosts: evento.value.subhosts
    }
    await api.put('/update_evento', req)
        .then(response => {
            $q.notify({
                color: 'primary',
                position: 'top',
                message: response.data.message,
                icon: 'event'
            });
            getEvento();
        })
        .catch(error => {
            $q.notify({
                color: 'red-14',
                position: 'top',
                message: error.response.data.error,
                icon: 'report_problem'
            });
            evento.value = eventoBefore.value;
        })
        .finally(() => {
            editando.value = false;
        });
}

function openImgDialog () {
    dialogImg.value = true;
    setTimeout(() => {
        imgLoading.value = false;
    }, 3000);
}

async function changeStatusEvento(status) {
    loading.value = true;
    const reqObject = {
        id: hostInfo.id,
        token: hostInfo.token,
        event: evento.value.id,
    }
    console.log(reqObject);
    await api.patch('/event_status/' + status.toLowerCase(), reqObject)
        .then(response => {
            $q.notify({
                color: 'primary',
                position: 'top',
                message: response.data.message,
                icon: 'toggle_off'
            });
            router.push('/host');
        })
        .catch(error => {
            $q.notify({
                color: 'red-14',
                position: 'top',
                message: error.response.data.error,
                icon: 'report_problem'
            });
        })
        .finally(() => {
            loading.value = false;
        });
}

function confirmChangeStatusEvento(status) {
    status = status.toLowerCase();
    const confirm = window.confirm('🚨 Deseja realmente alterar o status do evento para ' + status + '?');
    if (confirm) {
        changeStatusEvento(status);
    }
}

onBeforeMount(async () => {
    loading.value = true;
    await getEvento();
    sessionStorage.setItem('lastEventVisited', evento.value.event_url);
});

</script>

<style scoped>
.q-page {
    width: 100vw
}

.q-card {
    width: 90vw;
}

.bg-orangy {
    background-color: #fff3e9;
}

#ticket,
#subhost {
    padding: 10px;
    background-color: #eeeeee;
}

#ticket:nth-child(odd) {
    background-color: #eeeeee;
}

@media (min-width: 1024px) {
    .q-page {
        width: 100%;
        padding: 0 38px 24px 38px;
    }

    .q-card-wrapper {
        width: 100%;
        display: flex;
        flex-direction: row;
        align-items: flex-start;
        justify-content: space-evenly;
        flex-wrap: nowrap;
    }

    .q-card {
        width: 30vw;
    }

}
</style>