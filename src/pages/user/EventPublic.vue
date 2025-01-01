<template>
    <q-page class="q-pb-xl animate__animated animate__fadeInLeft ">
        <div class="w100 q-pt-sm q-pl-sm" >
            <q-btn @click="returnBack()" icon="keyboard_return" color="secondary" glossy></q-btn>
        </div>
        <div class="w100 row justify-center q-mt-md q-px-md">
            <q-card v-if="eventoIndisponivel">
                <q-card-section>
                    <div id="title-2" class="text-center  text-secondary text-bold q-py-md">Evento Indisponível<br>( ˘︹˘ )</div>
                </q-card-section>
            </q-card>
        </div>
        <div v-if="!loading && !eventoIndisponivel" class="animate__animated animate__fadeInRight w100 text-primary text-center " id="title">
            {{ event.title }}
        </div>
        <q-btn  v-if="!loading && !eventoIndisponivel" :to="'/' + event.host_login" class="text-secondary text-bold w100 text-center q-mb-md text-" flat :label="event.host"></q-btn>
        <div v-if="isMobile && !loading && !eventoIndisponivel" class="w100 q-mb-lg row justify-center">
            <a class="text-white bg-green-14 q-pa-md rounded-borders text-bold shadow-1" style="text-decoration: none;" href="#ingressos">Comprar Ingressos <q-icon size="sm" name="add_shopping_cart"></q-icon></a>
        </div>
        <div v-if="!loading && !eventoIndisponivel" id="cards-wrapper" class="w100 row items-start q-gutter-y-md">
            <q-card class="card-event q-mx-md bg-grey-4 q-mt-md">
                <q-card-section >
                    <q-item >
                        <q-item-section class="text-black">
                            <q-item-label id="title-2"  class="text-primary">INFORMAÇÕES</q-item-label>
                            <q-item-label class="text-bold text-grey-14 q-py-sm">{{ event.desc }}</q-item-label>
                            <q-item-label class="text-bold text-primary w100 column text-bold" >📆 {{ event.date.replaceAll('-', '/') }} ⏱️ {{ event.initial_time ? event.initial_time : 'xx:xx' }}{{ event.final_time ? (' - ' + event.final_time) : ''}}</q-item-label>
                            <img id="img-events" :src="event.img_url" class="q-mt-md" alt="🎇 Banner do Evento"/>
                            <div id="ingressos"></div>
                        </q-item-section>
                    </q-item>
                </q-card-section>
            </q-card>

            <q-card class="card-event q-mx-md bg-grey-4 q-mt-md">
                <q-card-section>
                    <q-item >
                        <q-item-section class="text-black">
                            <q-item-label id="title-2"  class="text-primary" >INGRESSOS</q-item-label>
                            <div id="ticket-types" >
                                <q-item id="ticket" v-for="(ticket, index) in event.ticket_types" :key="index" style="border-left: 6px solid #9573f3;" class="shadow-1 q-mt-md">
                                    <q-item-section class="text-bold text-primary q-py-sm" id="title-layout">
                                        <q-icon name="confirmation_number"></q-icon>{{ ticket.title }}<br><strong class="text-secondary q-pt-xs">R$ {{ formatStringValue(ticket.price) }}</strong>
                                    </q-item-section>
                                    <q-item-section side>
                                        <q-btn @click="openModalBuyTicket(ticket)" class="q-py-md" icon="add_shopping_cart" color="green-14" glossy></q-btn>
                                    </q-item-section>
                                </q-item>
                            </div>
                        </q-item-section>
                    </q-item>
                </q-card-section>
            </q-card>
            <q-card class="card-event q-mx-md bg-grey-4 q-mt-md">
                <q-card-section>
                    <q-item >
                        <q-item-section class="text-black">
                            <q-item-label id="title-2"  class="q-pt-sm text-primary">CONTATO</q-item-label>
                            <q-item-label class="text-bold text-grey-14 q-py-sm">{{ event.contact }}<br><br><strong class="text-secondary">Hospedado por {{ event.host }}</strong></q-item-label>
                            <q-item-label id="title-2"  class="text-primary q-pt-md">LOCALIZAÇÃO</q-item-label>
                            <q-item-label class="text-bold text-grey-14 q-py-sm">{{ event.address }}</q-item-label>
                            <iframe v-if="event.maps_loc" :src="event.maps_loc" class="q-mt-md w100" height="450" style="border:0;" loading="lazy"
                            referrerpolicy="no-referrer-when-downgrade"></iframe>
                        </q-item-section>
                    </q-item>
                </q-card-section>
            </q-card>
        </div>
        <q-dialog  v-model="modalBuyTicket" persistent>
            <div class="q-px-md q-pb-md bg-grey-4">
                <div class="w100 q-mt-md text-white bg-grad-2 q-py-md text-center" id="title-layout">COMPRAR INGRESSO</div>
                <div class="text-center q-pt-lg text-black text-h6 q-px-xs">Deseja realmente comprar o ingresso <strong class="text-primary">{{ ingressoHandle.title }}</strong> por<br><strong class="text-primary"> {{ Utils.formatCurrency(ingressoHandle.totalValue, 'brl') }}</strong>?</div>
                <div class="q-pt-md mid-opacity text-center text-bold text-primary">{{ stringTaxes() }}</div>
                <BuyTicketComponent />
                <TicketPaymentComponent />
                <div class="w100 row justify-center">
                    <q-btn label="voltar" flat color="secondary" @click="modalBuyTicket = false" />
                </div>
            </div>
        </q-dialog>
        <div v-if="loading" class="row w100 q-pb-xl justify-center">
            <q-spinner-ball color="secondary" size="lg" />
            <q-spinner-ball color="secondary" size="lg" />
            <q-spinner-ball color="secondary" size="lg" />
        </div>
    </q-page>
</template>

<script setup>
import { onBeforeMount, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import TicketPaymentComponent from 'src/components/TicketPaymentComponent.vue'
import BuyTicketComponent from 'src/components/BuyTicketComponent.vue'

import { api } from 'src/boot/axios';
import { SessionStorage, useQuasar } from "quasar";
import { Utils } from "src/utils/Utils";
const ingressoHandle = ref()
const isMobile = window.innerWidth < 800;
const route = useRoute();
const router = useRouter();
const event = ref(null);
const loading = ref(false);
const modalBuyTicket = ref(false);
const $q = useQuasar();
const eventoIndisponivel = ref(false);
onBeforeMount(async () => {
    loading.value = true;
    
    await api.get('/events?event=' + route.params.event).then((res) => {
        event.value = res.data;
    })
    .catch((err) => {
        eventoIndisponivel.value = true;
    })
    .finally(() => {
        loading.value = false;
    });
});

function returnBack() {
    if (window.location.href.includes('ingressos')) {
        window.history.back();
        window.history.back();
    } else
    window.history.back();
}

function formatStringValue(str){
    if(typeof str === 'string') {
        str = str.includes(',') ? str.replace(',', '.') : str;
        str = Number(str);
    }
    return str.toFixed(2).toString().replace('.', ',');
}

function stringTaxes() {
    let value = ingressoHandle.value.price
    return 'R$ ' + value.toFixed(2).toString().replace('.', ',')+ ' + ' + 'R$ ' + (value * 0.05).toFixed(2).toString().replace('.', ',') + ' (5% de taxa)';
}

function openModalBuyTicket(ticket) {
    if(sessionStorage.getItem('user')){
        if(typeof ticket.price === 'string') {
            ticket.price = ticket.price.includes(',') ? ticket.price.replace(',', '.') : ticket.price;
            ticket.price = Number(ticket.price);
        }
        const ticketConfigs = {
            event_id: event.value.id,
            title: ticket.title,
            price: ticket.price,
            taxes: 0.05, // taxa de 5% pela venda do ingresso
            totalValue: ticket.price + (ticket.price * 0.05),
        }
        ingressoHandle.value = ticketConfigs;
        sessionStorage.setItem('ticketConfigs', JSON.stringify(ticketConfigs));
        modalBuyTicket.value = true;
    } else {
        $q.notify({
            message: 'Você precisa estar logado para comprar ingressos.',
            color: 'secondary',
            position: 'top',
            icon: 'local_activity',
            timeout: 4000
        });
        sessionStorage.setItem('comeFromTicketIntention', event.value.id);
        router.push('/login')
    }
}

</script>

<style scoped>
#img-events {
    width: 100%;
    object-fit: cover;
    border-radius: 12px;
    border-bottom: 4px solid #9573f3;
    border-right: 4px solid #9573f3;
}

.q-card {
    width: 100%;
    border-radius: 4px;
    border-left: 6px solid #6310E1;
}

#ticket{
    border-radius: 8px;
    background-color: #f9f8ff;
    cursor: pointer;
    transition: all 0.3s linear;
}

#ticket:hover {
    background-color: #e5efff;
}

@media (min-width: 800px) {
    #img-events {
        width: 100%;
    }
    #cards-wrapper{
        justify-content: center;
    }
    .q-card {
        width: 45%;
    }
}
@media (min-width: 1100px) {
    #img-events {
        width: 100%;
    }
    .q-card {
        width: 30%;
    }
    #cards-wrapper{
        flex-wrap: nowrap;
    }
}

</style>