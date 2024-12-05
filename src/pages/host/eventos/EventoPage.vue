<template>
    <q-page class="animate__animated animate__fadeIn">
        <div v-if="loading" class="row w100 q-pt-xl justify-center">
            <q-spinner-ball color="secondary" size="lg" />
            <q-spinner-ball color="secondary" size="lg" />
            <q-spinner-ball color="secondary" size="lg" />
        </div>
        <div v-if="evento != null" class="text-secondary q-pt-xs">
            <div class="w100">
                <q-btn @click="goTo('/host')" dense class="q-ml-sm" flat icon="keyboard_return" label="voltar"
                    color="secondary">
                </q-btn>
            </div>
            <div id="title" class="text-white q-pl-md">{{ evento.title }}</div>
            <div class="text-bold q-pb-sm q-pl-md">{{ evento.status }}</div>
            <div class="text-bold q-pl-md">🕑 {{ evento.date.replaceAll("-", "/") }} {{ (evento.initial_time ? ' às ' +
                evento.initial_time : '') +
                (evento.final_time ? (' - ' + evento.final_time) : '' ) }}</div>
            <div v-if="!loading" class="q-card-wrapper row justify-center ">
                <q-card class="w100 q-mt-md" :class="editando ? 'bg-orange-1' : ''">
                    <div id="title-menu" class="text-primary w100 q-pt-md text-center">
                        Informações do Evento
                    </div>
                    <div class="w100 row justify-center q-gutter-x-xs">
                        <q-btn v-if="!editando && evento.img_url.trim() != ''" @click="dialogImg = !dialogImg"  glossy icon="image" icon-right="search"
                            class="q-mt-md q-px-sm" dense color="blue-14"></q-btn>
                        <q-btn v-if="evento.status.includes('andamento')" @click="alternarEdicao()" :label="!editando ? 'Editar Evento' : 'cancelar'" :icon-right="!editando ? 'edit' : 'cancel'" :flat="editando"
                            class="q-mt-md q-px-md " dense color="primary" glossy></q-btn>
                    </div>
                    <q-dialog v-model="dialogImg">
                        <q-card>
                            <q-card-section>
                                <img :src="evento.img_url" class="w100" alt="Banner do Evento">
                            </q-card-section>
                            <q-card-actions align="right">
                                <q-btn flat label="OK" color="primary" v-close-popup />
                            </q-card-actions>
                        </q-card>
                    </q-dialog>
                    <q-card-section v-if="!editando">
                        <div class="text-h6 text-primary row items-center">
                            <q-icon class="q-pr-xs" color="primary" name="description" size="sm"/>
                            Descrição</div>
                        <div style="font-size: 16px;">{{ evento.desc }}</div>
                    </q-card-section>
                    <q-card-section v-if="!editando">
                        <div class="text-h6 text-primary row items-center">
                            <q-icon class="q-pr-xs" color="primary" name="location_city" size="sm"/>
                            Endereço</div>
                        <div style="font-size: 16px;">{{ evento.address }}</div>
                    </q-card-section>
                    <q-card-section v-if="!editando">
                        <div class="text-h6 text-primary row items-center">
                            <q-icon class="q-pr-xs" color="primary" name="phone" size="sm"/>
                            Contato</div>
                        <div style="font-size: 16px;">{{ evento.contact }}</div>
                    </q-card-section>
                    <q-card-section v-if="evento.maps_loc && !editando">
                        <div class="text-h6 text-primary q-mb-sm row items-center">
                            <q-icon class="q-pr-xs" color="primary" name="location_on" size="sm"/>
                            Localização</div>
                        <iframe :src="evento.maps_loc" class="w100" height="450" style="border:0;" loading="lazy"
                            referrerpolicy="no-referrer-when-downgrade"></iframe>
                    </q-card-section>
                    <!-- MODO EDITANDO -->
                    <div v-if="editando" class="editando w100 q-py-md q-px-md q-gutter-y-md">
                        <q-input :inputStyle="{ fontWeight: 'bold' }" filled v-model="evento.title" label="Título*" color="primary"/>
                        <q-input :inputStyle="{ fontWeight: 'bold' }" type="textarea" filled v-model="evento.desc" label="Descrição" color="primary"/>
                        <q-input :inputStyle="{ fontWeight: 'bold' }" type="textarea" filled v-model="evento.address" label="Endereço*" color="primary" />
                        <q-input :inputStyle="{ fontWeight: 'bold' }" type="textarea" filled v-model="evento.contact" label="Contato*" color="primary" />
                        <q-input :inputStyle="{ fontWeight: 'bold' }" filled v-model="evento.img_url" label="Banner Url" color="primary" />
                        <div class="text-secondary" id="title-layout">Data do Evento é Obrigatória*</div>
                        <q-date id="date-picker" class="w100" v-model="evento.date" mask="DD-MM-YYYY" :options="(date) => {
                            const today = new Date();
                            const yesterday = new Date(today);
                            yesterday.setDate(today.getDate());
                            const minDate = yesterday.toISOString().split('T')[0];
                            const mydate = new Date(date);
                            return mydate >= new Date(minDate);
                        }" color="primary" />
                        <div class="w100 row no-wrap q-gutter-x-sm justify-center items-center">
                            <q-input  id="times" label="Início" filled v-model="evento.initial_time" mask="time" :rules="['time']">
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
                            <q-input label="Final" filled v-model="evento.final_time" mask="time" :rules="['time']">
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
                        <q-input :inputStyle="{ fontWeight: 'bold' }" filled v-model="evento.maps_loc" label="Localização" color="primary" />
                        <q-input :inputStyle="{ fontWeight: 'bold' }" filled v-model="evento.img_url" label="URL da Imagem" color="primary" />
                        <q-btn @click="updateEventInfo()" label="salvar alterações" color="orange-14" :disabled="checkEdit()" icon-right="save" class="w100 q-py-md" glossy></q-btn>
                    </div>
                    
                </q-card>
                <q-card class="w100 q-mx-md q-mt-md">
                    <div id="title-menu" class="text-primary w100 q-pt-md text-center">
                        Pacote de Ingressos
                    </div>
                    <div class="w100 q-px-md">
                        <q-btn @click="modalPackage = !modalPackage" label="Adicionar Ingressos" glossy icon-right="add_circle" color="primary" class="w100 q-mt-sm"></q-btn>
                    </div>
                    <q-card-section>
                        <div class="text-h6 text-primary">Pacote</div>
                        <div class="text-bold">{{ evento.package }}</div>
                        <div class="text-h6 text-primary q-mt-md">Ingressos Disponíveis</div>
                        <div class="text-bold">{{ evento.available_tickets }}</div>
                    </q-card-section>
                    <q-card-section>
                        <div class="text-h5 text-primary text-bold q-mb-md">Tipos de Ingressos</div>
                        <div v-for="ticket in evento.ticket_types" :key="ticket.id">
                            <div class="text-bold text-primary"  :class="ticket.status ? '' : 'mid-opacity'"><q-icon name="local_activity" color="primary" size="xs" ></q-icon> {{ ticket.title }}</div>
                            <div class="row items-center">
                                <q-toggle class="text-bold" v-model="ticket.status" @update:model-value="updateStatusTickets()" :label="ticket.status ? 'Ativo' : 'Inativo'" :color="ticket.status ? 'primary' : 'secondary'"></q-toggle>
                                <div  :class="ticket.status ? '' : 'mid-opacity'" class="text-bold text-green-14 q-ml-lg">{{ 'R$ ' + ticket.price }}</div>
                            </div>
                            <div class="w100 bg-secondary q-pt-xs q-mb-sm rounded-borders"></div>
                        </div>
                    </q-card-section>
                </q-card>
                <q-card class="w100 q-mx-md q-mt-md">
                    <div id="title-menu" class="text-primary w100 q-pt-md text-center">
                        Acesso
                    </div>
                    <q-btn label="Adicionar Subhost" icon-right="person_add" color="primary" glossy
                        class="q-my-sm q-ml-md"></q-btn>
                    <q-card-section>
                        <div class="text-h6 text-primary">Subhosts Cadastrados</div>
                        <div>{{ evento.subhosts.length }}</div>
                    </q-card-section>
                </q-card>
            </div>
            <div class="w100 q-mt-xl q-px-sm">
                <q-btn class="w100 q-py-xl" label="Painel de Vendas" color="green-7" glossy
                    icon-right="payments"></q-btn>
                <q-btn v-if="evento.status.includes('andamento')" class="w100 q-py-md q-mt-md" label="Encerrar Evento" @click="confirmChangeStatusEvento('ENCERRADO')" color="secondary" glossy
                    icon-right="event_available"></q-btn>
                <q-btn v-if="evento.status.includes('andamento')" class="w100 q-py-md q-mt-sm" label="Cancelar Evento" @click="confirmChangeStatusEvento('CANCELADO')" color="red-3" flat></q-btn>
            </div>
            <q-dialog v-model="modalPackage">
                <q-card>
                    <q-card-section class="q-gutter-y-sm">
                        <div id="title-menu" class="text-primary">Adicionar Ingressos</div>
                        <q-input :inputStyle="{ fontWeight: 'bold'}" outlined maxlength="40" v-model="packageHandler.title" label="Título do Ingresso*" color="primary">
                            <template v-slot:append>
                                <q-icon name="local_activity" color="primary" size="xs" />
                            </template>
                        </q-input>
                        <q-input :inputStyle="{ fontWeight: 'bold'}" outlined v-model="packageHandler.price" maxlength="7" prefix="R$" label="Preço*" reverse-fill-mask mask="####,##"  color="primary">
                            <template v-slot:append>
                                <q-icon name="attach_money" color="primary" size="xs" />
                            </template>
                        </q-input>
                    </q-card-section>
                    <div class="w100 row items-center justify-center q-pb-sm q-px-md">
                        <q-btn label="Adicionar" @click="addPackage()" :disabled="packageHandler.title.trim() == '' || packageHandler.price.trim() == ''" color="primary" icon-right="add" class="q-py-md q-mb-sm w100" glossy></q-btn>
                        <q-btn flat label="Cancelar" color="secondary" v-close-popup />
                    </div>
                </q-card>
            </q-dialog>
        </div>
    </q-page>
</template>

<script setup>
import { useQuasar } from 'quasar';
import { api } from 'src/boot/axios';
import { Utils } from 'src/utils/Utils';
import { onBeforeMount, onBeforeUnmount, ref } from 'vue';
import { useRouter } from 'vue-router';

const hostInfo = sessionStorage.getItem('host') ? JSON.parse(sessionStorage.getItem('host')) : null;
const editando = ref(false);
const loading = ref(false)
const evento = ref(null);
const eventoBefore = ref(null);
const dialogImg = ref(false);
const router = useRouter();
const modalPackage = ref(false);
const $q = useQuasar();
const packageHandler = ref({
    title: '',
    price: '',
    status: true
});

function alternarEdicao() {
    if(editando.value){
        evento.value = eventoBefore.value;
        editando.value = false;
        return;
    }
    editando.value = !editando.value;
}

function checkEdit() {
    if(evento.value.title.trim() == '' || evento.value.address.trim() == '' || evento.value.contact.trim() == '' || evento.value.date.trim() == '') return true
    const checkEventoIgualEventoBefore = () =>{
        if(evento.value.title == eventoBefore.value.title && evento.value.desc == eventoBefore.value.desc && evento.value.address == eventoBefore.value.address && evento.value.contact == eventoBefore.value.contact && evento.value.date == eventoBefore.value.date && evento.value.initial_time == eventoBefore.value.initial_time && evento.value.final_time == eventoBefore.value.final_time && evento.value.maps_loc == eventoBefore.value.maps_loc && evento.value.img_url == eventoBefore.value.img_url){
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
    if(Utils.checkSameTicketTypeTitle(array)){
        $q.notify({
            color: 'orange-14',
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

async function updateStatusTickets(){
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
        final_time: evento.value.final_time
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
        })
        .finally(() => {
            editando.value = false;
        });
}

async function changeStatusEvento(status) {
    loading.value = true;
    const reqObject = {
        id: hostInfo.id,
        token: hostInfo.token,
        event: evento.value.id,
    }
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

async function confirmChangeStatusEvento(status) {
    $q.dialog({
        title: (status.includes('CANC') ? 'Cancelar' : 'Encerrar')+ ' Evento',
        message: 'Deseja realmente alterar o status do evento para ' + status + '?',
        cancel: true,
        persistent: true,
        ok: {
            label: 'Sim',
            color: status.includes('CANC') ? 'red-14' : 'primary',
            glossy: true,
            handler: () => {
                changeStatusEvento(status);
            }
        },
        cancel: {
            label: 'Não',
            color: 'primary',
            flat: true,
            handler: () => {
                return;
            }
        }
    });
}

onBeforeMount(async () => {
    loading.value = true;
    await getEvento();
});

onBeforeUnmount(() => {
    sessionStorage.removeItem('evento');
});

</script>

<style scoped>
.q-page {
    width: 100vw
}

.q-card {
    width: 90vw;
}

.bg-orange-1{
    background-color: #fff7ec;
}

@media (min-width: 1024px) {
    .q-page {
        width: 100%;
        padding: 0 38px;
    }

    .q-card-wrapper {
        display: flex;
        flex-direction: row;
        align-items: flex-start;
        justify-content: space-between;
        flex-wrap: nowrap;
    }

    .q-card {
        width: 30vw;
    }

}
</style>