<template>
    <q-page class="animate__animated animate__fadeIn bg-grey-4 q-pb-xl">
        <div class="w100">
            <q-btn to="/host" dense glossy flat icon="keyboard_return" label="voltar"
                color="primary">
            </q-btn>
        </div>
        <div class="q-pa-md">
            <div id="title" class="text-primary">Painel de Vendas</div>
            <div class="text-bold text-h6 text-grey-14">{{evento_title}}</div>
            <div class="text-bold text-h6 text-blue-14 q-mb-lg">Faturamento: R$ {{Utils.formatCurrency(profit)}}<br>{{ ingressos.length}} vendas</div>
                <div v-if="loading" class="row w100 q-pb-xl justify-center">
                    <q-spinner-ball color="secondary" size="lg" />
                    <q-spinner-ball color="secondary" size="lg" />
                    <q-spinner-ball color="secondary" size="lg" />
                </div>
            <div class="w100 row wrap items-center justify-center q-gutter-md" v-if="ingressos.length > 0">
                <q-card v-for="ingresso in ingressos" :key="ingresso.id" class="q-mb-md">
                    <q-card-section>
                        <div id="title-2" class="text-primary text-bold row items-center justify-center"> {{ ingresso.ticket_type.title }}</div>
                        <div id="title-layout" class="text-green-14 text-bold row items-center justify-end">+ R$ {{ Utils.formatCurrency(ingresso.ticket_type.price) }}<q-icon name="paid" color="primary" size="sm" class="q-pl-sm"></q-icon></div>
                        <div class="text-primary q-mt-sm"><strong>Responsável Ingresso:</strong><br>{{ ingresso.ticket_type.ticket_person_name.toUpperCase() + ' - ' + ingresso.ticket_type.ticket_person_cpf }}</div>
                        <div class="text-primary q-mt-sm"><strong>Contato Responsável:</strong><br>{{ ingresso.ticket_type.ticket_person_email.toLowerCase() }} <br>{{ ingresso.ticket_type.ticket_person_phone }}</div>
                        <div class="text-primary q-mt-sm"><strong>Comprado por:</strong><br>{{ ingresso.payer.toUpperCase() }}</div>
                        <div class="text-grey-14 text-bold text-right w100 q-mt-md">{{ingresso.createdAt}}</div>
                    </q-card-section>
                </q-card>
            </div>
            <div v-else class="w100">
                <div id="title-2" class="text-primary text-center text-bold q-mt-lg">Ainda não foi vendido nenhum ingresso neste evento</div>
            </div>
        </div>
    </q-page>
</template>

<script setup>
import { api } from 'src/boot/axios';
import { Utils } from 'src/utils/Utils';
import { onBeforeMount, ref } from 'vue';

const evento_title = sessionStorage.getItem('evento_title')
const ingressos = ref([])
const profit = ref(0)
// const response = ingressos.map((ingresso) => {
//             return {
//                 id: ingresso._id,
//                 ticket_type: ingresso.ticket_type,
//                 payer: ingresso.user.name + ' - ' + ingresso.user.cpf,
//             };
//         })
onBeforeMount( async () => {
    const host = JSON.parse(sessionStorage.getItem('host'))
    const evento_venda = sessionStorage.getItem('evento_venda')
    await api.post('/event/painel_vendas', {host:{token: host.token, id: host.id}, event_id: evento_venda}).then(response => {
        ingressos.value = response.data.ingressos
        profit.value = response.data.profit
    })
})

</script>

<style scoped>
@media (min-width: 600px) {
    .q-card {
        width: 40%;
    }
    
}
</style>