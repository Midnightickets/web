<template>
    <q-page class="q-pb-xl animate__animated animate__fadeInLeft ">
        <div class="w100 q-pt-sm q-pl-sm" >
            <q-btn @click="returnBack()" icon="keyboard_return" color="secondary" glossy></q-btn>
        </div>
        <div v-if="!loading" class="animate__animated animate__fadeInRight w100 text-white text-center q-pb-sm" id="title">
            {{ event.title }}
        </div>
        <div  v-if="!loading" class="text-secondary text-bold w100 text-center q-mb-lg">{{ event.host }}</div>
        <div v-if="isMobile" class="w100 q-mb-xl row justify-center">
            <a class="text-white bg-green-14 q-pa-sm rounded-borders text-bold shadow-1" style="text-decoration: none;" href="#ingressos">Comprar Ingressos <q-icon size="sm" name="add_shopping_cart"></q-icon></a>
        </div>
        <div v-if="!loading" id="cards-wrapper" class="w100 row items-start q-gutter-y-md">
            <q-card class="card-event q-mx-md bg-grey-4 q-mt-md">
                <q-card-section >
                    <q-item >
                        <q-item-section class="text-black">
                            <q-item-label id="title-2"  class="text-primary">INFORMAÇÕES</q-item-label>
                            <q-item-label class="text-bold text-grey-14 q-py-sm">{{ event.desc }}</q-item-label>
                            <q-item-label class="text-bold text-primary w100 column text-bold" >📆 {{ event.date.replaceAll('-', '/') }}<br>⏱️ {{ event.initial_time ? event.initial_time : 'xx:xx' }}{{ event.final_time ? (' - ' + event.final_time) : ''}}</q-item-label>
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
                                <q-item id="ticket" v-for="(ticket, index) in event.ticket_types" :key="index" class="shadow-1 q-mt-md">
                                    <q-item-section class="text-bold text-grey-14 q-py-sm">
                                        {{ ticket.title }}<br>R$ {{ ticket.price }}
                                    </q-item-section>
                                    <q-item-section side>
                                        <q-btn icon="add_shopping_cart" color="green" glossy></q-btn>
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
                            <iframe :src="event.maps_loc" class="q-mt-md w100" height="450" style="border:0;" loading="lazy"
                            referrerpolicy="no-referrer-when-downgrade"></iframe>
                        </q-item-section>
                    </q-item>
                </q-card-section>
            </q-card>
        </div>
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
import { api } from 'src/boot/axios';

const isMobile = window.innerWidth < 800;
const route = useRoute();
const event = ref(null);
const loading = ref(false);

onBeforeMount(async () => {
    loading.value = true;
    
    await api.get('/events?event=' + route.params.event).then((res) => {
        event.value = res.data;
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

</script>

<style scoped>
#img-events {
    width: 100%;
    object-fit: cover;
    border-radius: 12px;
    border: 4px solid #9573f3;
}

.q-card {
    width: 100%;
    border-radius: 4px;
    border: 6px solid #6310E1;
}

#ticket{
    border-radius: 8px;
    background-color: #edebff;
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