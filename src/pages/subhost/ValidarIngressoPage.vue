<template>
  <q-page class="bg-grey-3">
    <div id="title" class="w100 text-center text-secondary q-pt-md q-px-sm">
      Validar Ingresso
    </div>
    <div class="w100 q-px-md row justify-center">
      <q-btn class="q-py-md q-mt-md shadow-2" icon-right="qr_code_scanner" label="Scanear Ingresso" @click="startScanning" glossy color="primary" />
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
            <q-card-title class="text-center text-primary q-pt-md" id="title">Detalhes do Ingresso</q-card-title>
                    <div  class="text-bold text-primary text-h5 text-center">Nome do Pagador</div>
                    <div class="text-bold text-secondary text-h6 q-mb-md text-center">{{ ingresso.payer.name.toUpperCase() }}</div>
                    <div  class="text-bold text-primary text-h5 text-center">CPF do Pagador</div>
                    <div>{{ ingresso.payer.cpf }}</div>
                    <div class="text-bold text-primary text-h5 text-center">Tipo de Ingresso</div>
                    <div class="text-bold text-secondary text-h6 q-mb-md text-center">{{ ingresso.ticket_type.title }}</div>
                    <div class="text-bold text-secondary text-h6 q-mb-md text-center">{{ ingresso.ticket_type.price }}</div>
                    <div class="text-bold text-secondary text-h6 q-mb-md text-center">{{ ingresso.ticket_type.status }}</div>
                    <div class="text-bold text-secondary text-h6 q-mb-md text-center">{{ ingresso.ticket_type.sales }}</div>
          </q-card-section>
        </q-card>
        <q-btn v-if="!ingresso" label="Consultar QR" @click="validateTicket()" color="green-14" glossy class="q-py-sm q-mt-md" />
        <q-btn v-else label="Fechar" @click="ingressoResponse.modal = false" color="secondary" flat class="q-py-sm q-mt-md" />
      </div>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref } from 'vue';
import { BrowserQRCodeReader } from '@zxing/browser';
import { api } from 'src/boot/axios';
import { useQuasar } from 'quasar';

const videoElement = ref(null);
const codeReader = new BrowserQRCodeReader();
const ingresso_id = ref('');
const ingresso = ref(null)
const ingressoResponse = ref({
  modal: false,
});
const cameraOpen = ref(false);
const $q = useQuasar();

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

const validateTicket = async () => {
  try {
    cameraOpen.value = false;
    const response = await api.post('/event/check_valid_ticket', { id: ingresso_id.value });
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
      color: 'red-14',
      icon: 'error',
      message: 'Erro ao validar ingresso.',
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
