<template>
    <q-page class="q-pb-xl animate__animated animate__fadeIn">
        <div class="w100 text-white text-center q-py-md" id="title">
            {{ hostName }}
        </div>
        <div v-if="!loading" class="w100 row items-center q-gutter-y-md">
            <q-card v-for="(event, index) in events" :key="index" class="card-event q-mx-md bg-grey-4 q-mt-md">
                <q-card-section>
                    <q-item >
                        <q-item-section class="text-black">
                            <q-item-label id="title-2"  class="text-primary">{{ (index + 1) + '. ' + event.title }}</q-item-label>
                            <q-item-label class="text-bold text-grey-14 q-py-sm">{{ event.desc }}</q-item-label>
                            <q-item-label class="text-bold text-secondary">{{ event.date.replaceAll('-', '/') }}</q-item-label>
                            <img id="img-events" :src="event.img_url" class="q-mt-md" alt="🎇 Banner do Evento"/>
                        </q-item-section>
                        <q-item-section side>
                            <q-btn icon="visibility" class="shadow-2" color="green" glossy style="height: 100%;width: 100%;"></q-btn>
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
import { useRoute } from "vue-router";
import { api } from 'src/boot/axios';

const route = useRoute();
const events = ref([]);
const loading = ref(false);
const hostName = ref(route.params.events_host);
onBeforeMount(async () => {
    loading.value = true;
    
    await api.get('?events_host=' + route.params.events_host).then((res) => {
        events.value = res.data;
        hostName.value = res.data[0].host;
    })
    .finally(() => {
        loading.value = false;
    });
});

</script>

<style scoped>
#img-events {
    width: 100%;
    object-fit: cover;
    border-radius: 12px;
    border: 4px solid #9573f3;
}

.q-card {
    border-radius: 4px;
    border: 6px solid #6310E1;
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