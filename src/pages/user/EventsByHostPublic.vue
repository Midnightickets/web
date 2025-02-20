<template>
    <q-page class="q-pb-xl bg-grad-1 animate__animated animate__fadeInRight">
        <div class="w100 q-pt-sm q-pl-sm" >
            <q-btn @click="returnRout()" icon="keyboard_return" color="secondary" glossy class="shadow-1 q-mr-sm"></q-btn>
            <q-btn to="/" icon="travel_explore" color="secondary" glossy class="shadow-1"></q-btn>
        </div>
        <div v-if="!loading" class="w100 row justify-center">
            <q-avatar style="width:180px;height:180px" class="shadow-2">
                <img style="object-fit: cover;width: 100%;height: 100%;" :src="hostImgUrl ? hostImgUrl : '/favicon.svg'" alt="">
            </q-avatar>
        </div>
        <div v-if="!loading && events.length > 0" class="animate__animated animate__fadeInLeft w100 text-white text-center q-pb-lg q-mt-sm q-px-md" id="title-2">
            Eventos de<br>{{hostName.toUpperCase() }}
        </div>
        <div v-if="!loading" class="w100 row items-start q-gutter-y-md">
            <q-card v-for="(event, index) in events" :key="index" class="card-event q-mx-md bg-grey-4 q-mt-md">
                <q-card-section>
                    <q-item >
                        <q-item-section class="text-black">
                            <!-- <q-item-label id="title-2"  class="text-primary">{{ (index + 1) + '. ' + event.title }}</q-item-label> -->
                            <q-btn @click="goToEvent(event.event_url)" id="title-2" :label="(index + 1) + '. ' + event.title" class="q-mb-sm"  glossy color="primary"/>
                            <q-item-label class="text-bold text-grey-14 q-py-sm" style="white-space: pre-wrap">{{ event.desc }}</q-item-label>
                            <q-item-label class="text-bold text-primary">📆 {{ event.date.replaceAll('-', '/') }}</q-item-label>
                            <img id="img-events" v-if="event.img_url" :src="event.img_url" class="q-mt-md" alt="🎇 Banner do Evento"/>
                        </q-item-section>
                    </q-item>
                    <q-item-section class="q-px-md">
                        <q-btn @click="goToEvent(event.event_url)" label="Visualizar evento" icon-right="event" class="shadow-1 q-py-md" color="primary" glossy style="height: 100%;width: 100%;"></q-btn>
                    </q-item-section>
                </q-card-section>
            </q-card>
        </div>
        <div v-if="hostEmail.includes('@')" class="w100 bg-glass-2  text-center text-white q-pb-lg q-my-xl q-px-md" >
            <div id="title-2" class="text-white q-pt-md">
                Contato do Produtor
            </div>
            <q-item>
                <q-item-section class="">
                    <q-input readonly outlined v-model="hostEmail" label="E-mail" class="text-bold bg-grey-2 rounded-borders text-grey-14">
                        <template v-slot:prepend>
                            <q-icon name="email" color="primary" />
                        </template>
                    </q-input>
                    <q-input readonly outlined label="Telefone" v-model="hostPhone" class="text-bold text-grey-14 bg-grey-2 rounded-borders">
                        <template v-slot:prepend>
                            <q-icon name="phone" color="primary" />
                        </template>
                    </q-input>
                    <q-input readonly outlined label="CNPJ ou CPF do Responsável" v-model="hostIdentity" class="text-bold text-grey-14 bg-grey-2 rounded-borders">
                        <template v-slot:prepend>
                            <q-icon name="fingerprint" color="primary" />
                        </template>
                    </q-input>

                </q-item-section>
            </q-item>

        </div>
        <div v-if="!loading && events.length == 0" class="w100 text-center text-secondary q-pt-xl" id="title-2">
            Esse Host não possui nenhum evento em Andamento<br>( ˘︹˘ )
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

const route = useRoute();
const router = useRouter();
const events = ref([]);
const loading = ref(true);
const hostName = ref('');
const hostImgUrl = ref('');
const hostEmail = ref('');
const hostPhone = ref('');
const hostIdentity = ref('');
function returnRout() {
    window.history.back();
}

onBeforeMount(async () => {
    loading.value = true;
    await api.get('?events_host=' + route.params.events_host).then((res) => {
        if (res.data.events.length > 0){
            events.value = res.data.events;
            hostImgUrl.value = res.data.host_img_url;
            hostName.value = res.data.events[0].host;
            hostEmail.value = res.data.host_email;
            hostPhone.value = res.data.host_phone;
            hostIdentity.value = res.data.host_identity;
        }
    })
    .finally(() => {
        loading.value = false;
    });
});

function goToEvent(id) {
    router.push('/events/' + id);
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
    border-radius: 4px;
    border-left: 6px solid #6310E1;
}

@media (min-width: 800px) {
    #img-events {
        width: 100%;
    }
    .q-card {
        width: 40%;
    }
}

</style>