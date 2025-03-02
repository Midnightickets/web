<template>
  <q-page class="q-pb-xl animate__animated animate__fadeIn bg-grey-3">
      <div class="w100 row justify-between no-wrap">
          <q-btn @click="voltar()" dense  class="q-pr-sm rounded-borders" flat  icon="keyboard_return" label="voltar" color="primary" glossy></q-btn>
          <div id="title-layout" class="q-px-lg text-primary">
              Funcionalidade em desenvolvimento
              <q-icon name="build" color="primary" class="q-pb-xs"/>
          </div>
        </div>
        <div class="q-pa-md">
            <p><strong>Gere um ingresso manualmente para um evento.<br>Recomendado em transferência de plataformas, cortesias para colaboradores etc.</strong>
            </p>
        </div>
        <div class=" flex flex-center q-px-md">
            <q-card class="w100 border-left-primary">
                <div id="title" class="text-primary q-pl-md q-pt-sm">Gerar Ingresso</div>
                <div class="w100 q-pl-md">
                    Items marcados com * são obrigatórios.
                </div>
                <q-card-section class="column q-gutter-y-sm ">
                    <q-select
                        class="cursor-pointer"
                        outlined
                        v-model="ingressoHandle.evento"
                        :options="eventoOptions"
                        label="Evento*"
                        map-options
                        fill-input
                        clearable
                    >
                        <template v-slot:no-option>
                            <q-item>
                                <q-item-section class="text-grey-8">
                                    Nenhum evento encontrado
                                </q-item-section>
                            </q-item>
                        </template>
                        <template v-slot:prepend>
                            <q-icon name="event" color="primary" />
                        </template>
                    </q-select>
                    <q-input
                        v-model="ingressoHandle.titulo"
                        outlined
                        label="Título do ingresso*"
                        type="text"
                    >
                    <template v-slot:prepend>
                        <q-icon name="confirmation_number" color="primary" />
                    </template>
                    </q-input>
                    <q-input
                        v-model="ingressoHandle.descricao"
                        label="Motivo/Descrição"
                        outlined
                        type="textarea"
                    >
                    <template v-slot:prepend>
                        <q-icon name="description" color="primary" />
                    </template>
                    </q-input>
                    <q-input
                        v-model="ingressoHandle.cpf"
                        label="CPF no ingresso*"
                        outlined
                        type="text"
                        maxlength="14"
                        mask="###.###.###-##"
                    >
                    <template v-slot:prepend>
                        <q-icon name="fingerprint" color="primary" />
                    </template>
                    </q-input>
                    <q-input
                        v-model="ingressoHandle.nome"
                        outlined
                        label="Nome Completo no ingresso*"
                        type="text"
                    >
                    <template v-slot:prepend>
                        <q-icon name="person" color="primary" />
                    </template>
                    </q-input>
                </q-card-section>
                <q-card-actions align="right">
                    <q-btn
                        :disabled="true"
                        @click="gerarIngresso()"
                        label="Gerar"
                        color="primary"
                        class=""
                        icon-right="confirmation_number"
                        glossy
                    />
                </q-card-actions>
            </q-card>
        </div>
  </q-page>
</template>

<script setup>
import { api } from 'src/boot/axios';
import { onBeforeMount, ref } from 'vue';

const ajudaDialog = ref(false)
const loading = ref(false)
const eventoOptions = ref([])
const ingressoHandle = ref({
    evento: null,
    titulo: '',
    descricao: '',
    cpf: '',
    nome: '',
})

const voltar = () => {
    window.history.back();
}

async function getEventos() {
    const hostInfo = JSON.parse(sessionStorage.getItem('host'));
    const reqObject = {
        host: {
            id: hostInfo.id,
            token: hostInfo.token,
        },
        isActiveEventsOnly: true,
    }
    loading.value = true;
    await api.post('/host/events', reqObject).then((response) => {
        if(response.data.message) {
            console.log(response.data.message);
            eventoOptions.value = [];
            return
        } else {
            eventoOptions.value = response.data.map((evento) => {
                return {
                    label: evento.title,
                    value: evento.id,
                }
            });
        }
    }).catch((error) => {
        console.log(error.data);
    })
    .finally(() => {
        loading.value = false;
    });
}

onBeforeMount(async () => {
    await getEventos();
})

</script>

<style scoped>

.border-left-primary {
    border-left: 2px solid #6310E1;
}

@media (min-width: 600px) {
    .q-card {
        width: 50%;
    }
}

</style>
