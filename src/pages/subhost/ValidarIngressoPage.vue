<template>
    <q-page>
      <div id="title" class="w100 text-center text-white q-mt-md q-px-sm">
        Validar Ingresso
      </div>
      <div class="w100">
        <q-btn label="Abrir Câmera" @click="startScanning" color="primary" />
        <div ref="videoContainer" class="video-container">
          <video ref="videoElement" class="q-mt-md" autoplay></video>
        </div>
        <q-btn label="Parar Câmera" @click="stopScanning" color="negative" class="q-mt-md" />
      </div>
    </q-page>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { BrowserQRCodeReader } from '@zxing/browser';
  
  // Referências para os elementos da câmera
  const videoElement = ref(null);
  const videoContainer = ref(null);
  const codeReader = new BrowserQRCodeReader();
  
  const startScanning = async () => {
    try {
      // Usar API nativa para listar dispositivos de vídeo
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoInputDevices = devices.filter((device) => device.kind === 'videoinput');
  
      if (videoInputDevices.length === 0) {
        console.error('Nenhuma câmera encontrada.');
        return;
      }
  
      // Selecionar o primeiro dispositivo disponível
      const selectedDeviceId = videoInputDevices[0].deviceId;
  
      // Iniciar o leitor de QR Code
      await codeReader.decodeFromVideoDevice(selectedDeviceId, videoElement.value, (result, error) => {
        if (result) {
          alert(`QR Code lido: ${result.text}`);
          stopScanning(); // Parar a câmera após a leitura
        }
        if (error) {
          console.error('Erro na leitura do QR Code:', error.message);
        }
      });
    } catch (err) {
      console.error('Erro ao acessar a câmera:', err.message);
    }
  };
  
  const stopScanning = () => {
    codeReader.reset();
    console.log('Leitura interrompida.');
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
  