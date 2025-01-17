<template>
  <q-page class="bg-grad-2">
    <div id="title" class="w100 text-center text-white text-shadow q-pt-xl q-px-sm">
      Validar Ingresso
    </div>
    <div class="w100 q-px-md column justify-center items-center">
      <q-btn class="q-mt-md shadow-2 q-pa-xl" icon-right="qr_code_scanner" label="Scanear Ingresso" @click="startScanning" glossy color="blue-14" />
      <div class="w80 bg-secondary rounded-borders q-mt-xl q-pa-md shadow-2">
        <q-input v-model="ingresso_id" outlined class="bg-grey-3 q-mt-md w100 rounded-borders" label="Inserir Manualmente">
        </q-input>
        <q-btn class="q-py-lg q-mt-md w100 shadow-2" icon-right="sensor_occupied" label="Validar manualmente" @click="validateTicket()" glossy color="blue-14" />
      </div>
    </div>
    <q-dialog v-model="cameraOpen" class="w100" persistent>
      <div class="w100 rounded-borders column justify-center items-center">
        <div ref="videoContainer" class="rounded-borders video-container">
          <video ref="videoElement" class="q-mt-md rounded-borders" autoplay></video>
        </div>
        <q-btn label="Parar Câmera" @click="stopScanning" color="negative" glossy class="q-py-sm q-mt-md" />
      </div>
    </q-dialog>
    <q-dialog v-model="ingressoResponse.modal" class="w100" persistent>
      <div class="w100 rounded-borders column justify-center items-center">
        <q-card v-if="ingresso">
          <q-card-section>
            <div id="title" class="text-bold bg-grad-1 text-white text-center rounded-borders q-mb-md q-mt-lg">{{ ingresso.ticket_type.title }}</div>
            <div id="title-layout" class="text-bold text-blue-14 text-h6 text-left">{{ ingresso.event }}</div>
            <div  class="text-bold text-primary q-mt-sm text-h6 text-left">Identificação</div>
            <div class="text-bold text-white text-h6 bg-grad-2 q-py-xs q-mb-md text-left q-pl-md rounded-borders">{{ ingresso.ticket_type.ticket_person_name.toUpperCase() }}
                      <br>{{ ingresso.ticket_type.ticket_person_cpf.toUpperCase() }}
                    </div>
                    <q-select class="q-mt-md" v-model="option" outlined label="Outras Informações" :options="[ingresso.ticket_type.ticket_person_email, ingresso.ticket_type.ticket_person_phone, 'R$ ' + Utils.formatCurrency(ingresso.ticket_type.price), 'Comprado por: ' + ingresso.payer.name]">
                    </q-select>
                  </q-card-section>
                  <div class="q-px-md column justify-center q-pb-md">
                    <div class="w100 text-bold text-center text-grey-7 q-mb-lg">
                      Verifique se o Documento de Identificação do portador do ingresso é o mesmo que consta no ingresso antes de finalizar o checkin*
                    </div>
                    <div class="w100 text-grey-14 text-h6 q-mb-md text-bold text-center">{{ ingresso.isExpired ? "🟡 Checkin já realizado" : "🟢 Ingresso Disponível"}}</div>
                    <q-btn v-if="!ingresso.isExpired" label="Validar Ingresso" glossy @click="validarCheckin()" color="blue-14" icon-right="sensor_occupied" class="q-pa-md" />
                    <q-btn label="voltar" class="q-mt-sm" @click="stopScanning()" color="secondary" flat />
          </div>
        </q-card>
        <q-btn v-if="!ingresso" label="Consultar QR" icon-right="sensor_occupied" @click="validateTicket()" color="primary" glossy class="q-pa-xl q-mt-md" />
        <q-btn v-if="!ingresso"  label="Cancelar" @click="recarregar()" color="primary" flat class="q-py-xs q-mt-xl" />
      </div>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref } from 'vue';
import { BrowserQRCodeReader } from '@zxing/browser';
import { api } from 'src/boot/axios';
import { SessionStorage, useQuasar } from 'quasar';
import { Utils } from 'src/utils/Utils';

const videoElement = ref(null);
const codeReader = new BrowserQRCodeReader();
const ingresso_id = ref('');
const ingresso = ref(null)
const ingressoResponse = ref({
  modal: false,
});
const cameraOpen = ref(false);
const $q = useQuasar();
const option = ref('');

const startScanning = async () => {
  cameraOpen.value = true;
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoInputDevices = devices.filter((device) => device.kind === 'videoinput');

    if (videoInputDevices.length === 0) {
      console.error('Nenhuma câmera encontrada.');
      return;
    }

    const selectedDeviceId = videoInputDevices[0].deviceId;

    await codeReader.decodeFromVideoDevice(selectedDeviceId, videoElement.value, (result, error) => {
      if (result) {
        ingresso_id.value = result.getText();
        ingressoResponse.value.modal = true;
        stopScanning();
      }
      if (error) {
        console.error('Erro ao ler QR Code:', error.message);
      }
    });
  } catch (err) {
    console.error('Erro ao acessar a câmera:', err.message);
    stopScanning();
  }
};

async function validarCheckin() {
  const subhost = JSON.parse(SessionStorage.getItem('subhostInfo'));
  const ingressoData = {
    id: ingresso.value.id,
    subhost: subhost.login,
    token: subhost.token,
  }
  await api.post('/event/checkin', ingressoData).then((res) => {
    $q.notify({
      color: 'blue-14',
      icon: 'sensor_occupied',
      message: res.data.message,
      position: 'top',
      timeout: 2000,
    });
    setTimeout(() => {
      recarregar();
    }, 2000);
  }).catch((error) => {
    console.error('Erro ao realizar checkin:', error.message);
    $q.notify({
      color: 'dark',
      icon: 'error',
      message: error.response.data.error,
      position: 'center',
      timeout: 2000,
    });
  });
}

const validateTicket = async () => {
  try {
    cameraOpen.value = false;
    const subhostInfo = JSON.parse(SessionStorage.getItem('subhostInfo'));
    const response = await api.post('/event/check_valid_ticket', { id: ingresso_id.value, subhost: subhostInfo.login, token: subhostInfo.token });
    ingresso.value = response.data;
    $q.notify({
      color: 'blue-14',
      icon: 'confirmation_number',
      message: 'Ingresso encontrado!',
      position: 'top',
      timeout: 2000,
    });
    setTimeout(() => {
      ingressoResponse.value.modal = true;
    }, 500);
  } catch (error) {
    console.error('Erro ao validar ingresso:', error.message);
    $q.notify({
      color: 'dark',
      icon: 'error',
      message: error.response.data.error,
      position: 'top',
      timeout: 2000,
    });
  }
};

const stopScanning = () => {
  cameraOpen.value = false;
  codeReader.decodeFromVideoDevice(null, videoElement.value);

  if (videoElement.value && videoElement.value.srcObject) {
    const stream = videoElement.value.srcObject;
    const tracks = stream.getTracks();
    tracks.forEach((track) => track.stop());
    videoElement.value.srcObject = null;
  }
};

function recarregar() {
  window.location.reload();
}
</script>

<style scoped>
.video-container {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  width: 100%;
  height: auto;
}
video {
  max-width: 100%;
  border: 1px solid #ccc;
}

</style>
