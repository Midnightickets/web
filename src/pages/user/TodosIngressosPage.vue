<template>
    <q-page class="bg-grad-2 text-white q-px-md animate__animated animate__fadeIn q-pb-xl" id="title">
        <div class="w100" >
            <q-btn @click="retornar()" icon="keyboard_return" color="secondary" glossy></q-btn>
        </div>
        <div class="W100">{{ Utils.toCamelCase(Utils.convertStringToFirstAndLast(userLogin)) }}</div>
        <div class="w100 text-white animate__animated animate__fadeInLeft animate__slow text-left q-mb-md" id="title">Compras</div>
        <div v-if="loading" class="row w100 q-py-sm q-mt-md justify-center">
            <q-spinner-ball color="secondary" size="xl" />
            <q-spinner-ball color="secondary" size="xl" />
            <q-spinner-ball color="secondary" size="xl" />
        </div>
        <div id="meus-ingressos">
            <q-list class="row q-gutter-x-md q-gutter-y-md">
                <q-card v-for="ingresso in ingressos" :key="ingresso.id" class="w100 q-pb-md bg-grey-3" :style="ingresso.isExpired ? 'border-left: 6px solid #6310E1' : 'border-left: 6px solid #6310E1'">
                    <q-card-section>
                        <div :class="!ingresso.isExpired ? 'bg-primary' : 'bg-primary'" class="text-white q-pa-md rounded-borders" id="title-menu">
                            <q-icon class="q-pb-xs" name="local_activity" color="white"></q-icon>
                            {{ ingresso.ingresso }}
                        </div>
                        <div class="text-h6 text-grey-14 text-bold q-mt-md">{{ ingresso.event }}</div>
                        <q-btn color="secondary" :label="ingresso.host" :to="'/' + ingresso.host_login"></q-btn>
                        <div class="bg-grey-9 rounded-borders q-pa-md text-center q-mt-sm text-h6 text-white text-bold">{{ ingresso.ticket_person_name.toUpperCase() }}</div>
                        <div class="rounded-borders q-mt-md text-h6 text-green-14 text-bold">R$ {{ Utils.formatCurrency(ingresso.price) }}</div>
                        <div class="text-h6 text-grey-7 text-left text-bold">Comprado por: {{ ingresso.payer }}</div>
                        <div class="text-h6 text-grey-7 text-right text-bold">{{ ingresso.createdAt }}</div>
                        <div class="text-grey-14 text-bold q-pt-md" style="font-size: 16px">{{ !ingresso.isExpired ? '🟢 Disponível' : '🟡  Utilizado' }}</div>
                    </q-card-section>
                    <div class="w100 q-px-md" >
                        <q-btn @click="generateQRCode(ingresso)" label="Ver detalhes" icon-right="visibility" class="w100 q-py-md" color="primary" glossy></q-btn>
                    </div>
                </q-card>                
                <q-card v-if="ingressos.length == 0 && !loading" class="w100 q-pb-md bg-grey-3" style="border-left: 6px solid #6310E1">
                    <q-card-section>
                        <div class="text-primary text-center" id="title-menu">
                            Você ainda <strong class="text-primary">não</strong> comprou ingressos<br>
                        </div>
                    </q-card-section>
                </q-card>                
            </q-list>
        </div>
        <q-dialog v-model="dialogQrIngresso"  >
            <div class="flex flex-center">
                <q-icon class="q-pb-xs" size="lg" name="local_activity" color="white"></q-icon>
                <div class="text-white w100 text-center text-shadow bg-dark q-pa-md shadow-2" id="title-2">
                    {{ ingressoHandler.ingresso }}<br>
                    <div class="text-secondary text-center q-mt-sm">
                        {{ ingressoHandler.event }}</div>
                        <div class="text-white text-center bg-black q-mt-md q-pb-lg rounded-borders shadow-1" id="title-layout">
                            <br>{{ ingressoHandler.ticket_person_name.toUpperCase() }}<br><br>[{{ ingressoHandler.ticket_person_cpf }}]
                        </div>
                        <div class="column q-mt-md items-center justify-center">
                            <canvas class="shadow-1 rounded-borders" ref="qrcodeCanvas"></canvas>
                        </div>
                        <div class="text-grey-7 text-center column bg-dark q-pa-md shadow-3 q-mt-md" id="title-layout">
                            <q-btn label="Baixar Ingresso" icon="download" v-if="btnDownloadShow" class="q-py-md q-mb-md" color="primary" glossy @click="downloadQDialogAsPng()"></q-btn>
                            <div class="text-white" v-else>{{ ingressoHandler.id }}</div>
                            <q-btn v-if="btnDownloadShow" label="abrir código ID" color="dark" glossy @click="alertIdIngresso(ingressoHandler.id)"></q-btn>
                        </div>
                        <div class="text-grey-7 text-center bg-dark q-pa-md shadow-2 q-mt-md" id="title-layout">
                            Apresente este QRCode e seu Documento de Identidade na entrada do evento
                        </div>
                    <div v-if="loading" class="row w100 q-py-sm q-mt-xs justify-center">
                        <q-spinner-ball color="secondary" size="lg" />
                        <q-spinner-ball color="secondary" size="lg" />
                        <q-spinner-ball color="secondary" size="lg" />
                    </div>
                    <q-btn @click="dialogQrIngresso = false" label="Fechar" color="secondary" class="w100 q-mt-md" flat></q-btn>
            </div>
            </div>
    </q-dialog>
        <div id="ingresso-png" v-if="dialogQrIngresso" style="z-index: -999999!important;position:absolute;top:-9999px">
            <div id="dialog-ingresso" class="flex flex-center" style="overflow-x: hidden;">
                <q-icon class="q-pb-xs" size="lg" name="local_activity" color="secondary"></q-icon>
                <div class="text-white w100 text-center text-shadow bg-dark q-pa-md shadow-2" id="title-2">
                    {{ ingressoHandler.ingresso }}<br>
                    <div class="text-blue-14 text-center q-mt-sm">
                        {{ ingressoHandler.event }}</div>
                        <div class="text-secondary text-center bg-black q-mt-md q-pb-lg rounded-borders shadow-1" id="title-layout">
                            <br>{{ ingressoHandler.ticket_person_name.toUpperCase() }}<br>{{ ingressoHandler.ticket_person_cpf }}
                        </div>
                        <div id="canvas-clone" class="w100 q-mt-md items-center justify-center">
                        
                        </div>
                        <div class="text-grey-7 text-center bg-dark q-pa-md shadow-3 q-mt-md" id="title-layout">
                            <div class="text-white">{{ ingressoHandler.id }}</div>
                        </div>
                        <div class="text-grey-7 text-center bg-dark q-pa-md shadow-2 q-mt-md" id="title-layout">
                            Apresente este QRCode e seu Documento de Identidade na entrada do evento
                        </div>
                    <div v-if="loading" class="row w100 q-py-sm q-mt-xs justify-center">
                        <q-spinner-ball color="secondary" size="lg" />
                        <q-spinner-ball color="secondary" size="lg" />
                        <q-spinner-ball color="secondary" size="lg" />
                    </div>
                    <q-btn @click="dialogQrIngresso = false" label="Fechar" color="secondary" class="w100 q-mt-md" flat></q-btn>
                </div>
            </div>
        </div>
    </q-page>
</template>

<script setup>
import { onBeforeMount, ref } from 'vue';
import { api } from 'src/boot/axios';
import QRCode from 'qrcode';
import { Utils } from 'src/utils/Utils';

const dialogQrIngresso = ref(false)
const ingressos = ref([])
const ingressoHandler = ref(null)
const loading = ref(true)
const userLogin = JSON.parse(sessionStorage.getItem('user')).login
onBeforeMount(async () => {
    const user = JSON.parse(sessionStorage.getItem('user'))
    await api.post('/user/ingressos-comprados', {user: { id: user.id , token: user.token}})
        .then(response => {
            ingressos.value = response.data
        })
        .catch(error => {
            console.log(error)
        })
        .finally(() => {
            loading.value = false
        })
})

async function downloadQDialogAsPng() {
    // Aguardar para garantir que o QR Code está renderizado
    setTimeout(async () => {
        const dialog = document.querySelector('#ingresso-png'); // Seleciona o elemento do diálogo
        if (!dialog) {
            console.error("Elemento do diálogo não encontrado.");
            btnDownloadShow.value = true; // Restaura o botão em caso de erro
            return;
        }

        try {
            // Captura o elemento usando html2canvas
            const canvas = await html2canvas(dialog, {
                backgroundColor: null, // Mantém o fundo transparente
                useCORS: true, // Garante carregamento de recursos externos
                windowHeight: dialog.scrollHeight, // Altura total do conteúdo
            });

            // Converte o canvas para URL de imagem
            const image = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.href = image;
            link.download = ingressoHandler.value.ingresso + '.png';
            link.click(); // Inicia o download
        } catch (error) {
            console.error('Erro ao capturar o diálogo:', error);
        } finally {
            console.log(ingressoHandler.value.id)
            btnDownloadShow.value = true; // Restaura o botão
        }
    }, 1000); // Tempo para garantir que o QR Code foi renderizado
}

function alertIdIngresso(id) {
    alert(id)
}

function formatCurrency(valor) {
    if(typeof valor === 'number') {
        return valor.toFixed(2).toString().replace('.', ',')
    } else {
        if(valor.includes(',')) {
            valor = valor.replace(',', '.')
        }
        valor = Number(valor).toFixed(2)        
        return valor.toString().replace('.', ',')
    }
}

function retornar() {
    window.history.back()
}

const qrcodeCanvas = ref(null);

const generateQRCode = (ingresso) => {
      loading.value = true;
      ingressoHandler.value = ingresso;
      dialogQrIngresso.value = true;

      setTimeout(() => {
        QRCode.toCanvas(qrcodeCanvas.value, ingresso.id, (error) => {
          if (error) {
            console.error(error);
            loading.value = false;
            return;
          }

          // Clone do QRCode gerado
          const originalCanvas = qrcodeCanvas.value;
          const cloneCanvas = document.createElement("canvas");
          cloneCanvas.width = originalCanvas.width;
          cloneCanvas.height = originalCanvas.height;
          const ctx = cloneCanvas.getContext("2d");
          ctx.drawImage(originalCanvas, 0, 0);

          // Adiciona o clone na div #canvas-clone
          const cloneDiv = document.getElementById("canvas-clone");
          cloneDiv.innerHTML = ""; // Limpa qualquer conteúdo anterior
          cloneDiv.appendChild(cloneCanvas);

          loading.value = false;
        });
      }, 500);
    };
</script>

<style scoped>
.q-card{
    cursor: pointer;
}

@media (min-width: 600px) {
   .q-card{
        width: 45%;
    }
    .q-list {
        display: flex;
        justify-content: center;
    }
}

</style>