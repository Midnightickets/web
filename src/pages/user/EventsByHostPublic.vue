<template>
    <q-page class="q-pb-xl bg-twitch animate__animated animate__fadeInRight">
        <div class="w100 q-pt-sm q-pl-sm" >
            <q-btn to="/" icon="travel_explore" color="secondary" glossy class="shadow-1"></q-btn>
        </div>
        <div v-if="!loading" class="animate__animated animate__fadeInLeft w100 text-white text-center q-pb-lg q-mt-sm q-px-md" id="title-2">
            Eventos de {{ hostName.toUpperCase() }}
        </div>
        <div v-if="!loading" class="w100 row items-center q-gutter-y-md">
            <q-card v-for="(event, index) in events" :key="index" class="card-event q-mx-md bg-grey-4 q-mt-md">
                <q-card-section>
                    <q-item >
                        <q-item-section class="text-black">
                            <q-item-label id="title-2"  class="text-primary">{{ (index + 1) + '. ' + event.title }}</q-item-label>
                            <q-item-label class="text-bold text-grey-14 q-py-sm">{{ event.desc }}</q-item-label>
                            <q-item-label class="text-bold text-secondary">📆 {{ event.date.replaceAll('-', '/') }}</q-item-label>
                            <img id="img-events" :src="event.img_url" class="q-mt-md" alt="🎇 Banner do Evento"/>
                        </q-item-section>
                    </q-item>
                    <q-item-section class="q-px-md">
                        <q-btn @click="goToEvent(event.id)" label="Visualizar evento" icon-right="event" class="shadow-1 q-py-md" color="primary" glossy style="height: 100%;width: 100%;"></q-btn>
                    </q-item-section>
                </q-card-section>
            </q-card>
        </div>
        <div v-if="!loading && events.length == 0" class="w100 text-center text-secondary" id="title-2">
            Nenhum Evento Em Andamento foi encontrado para esse Host<br>( ˘︹˘ )
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
const loading = ref(false);
const hostName = ref(route.params.events_host);

onBeforeMount(async () => {
    loading.value = true;
    await api.get('?events_host=' + route.params.events_host).then((res) => {
        if (res.data.length > 0){
            events.value = res.data;
            hostName.value = res.data[0].host;
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