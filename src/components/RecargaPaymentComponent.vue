<template>
    <!-- CHECKOUT PRO MERCADO PAGO -->
    <div class="wrapper ">
        <div id="wallet_container">
        </div>
        <div v-if="loading" class="row w100 justify-center q-mt-md q-py-xl">
            <q-spinner-ball color="blue" size="xl" />
            <q-spinner-ball color="blue" size="xl" />
            <q-spinner-ball color="blue" size="xl" />
        </div>
    </div>
</template>

<script setup>
import { onBeforeMount, onBeforeUnmount, ref } from "vue";
import { api } from "src/boot/axios";
import { useQuasar } from "quasar";
import { Utils } from "src/utils/Utils";

const loading = ref(true)
const $q = useQuasar();

const loadScript = (src) => {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.async = true;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
};

const isProd = !window.location.href.includes('localhost')
const baseURL = isProd ? 'https://midnightickets.com' : 'http://localhost:9000'

const preferenceId = ref('');

onBeforeMount(async () => {
    const host = JSON.parse(sessionStorage.getItem('userLogado'));
    try {
        const recarga = sessionStorage.getItem('recarga');
        await loadScript('https://sdk.mercadopago.com/js/v2');
        const mp = new MercadoPago(process.env.MIDNIGHTICKETS_MERCADO_PAGO_PK, { locale: 'pt-BR' });
        const createPreference = async () => {
            await api.post('/create_preference', {
                back_urls: {
                    "success": baseURL + '/host',
                    "failure": baseURL + '/host',
                    "pending": baseURL + '/host',
                },
                host: host.id,
                pacote: recargaPacote,
                auto_return: "approved",
                items: [
                    {
                        id: recarga.id,
                        title: 'Recarga de ' + Utils.formatCurrency(recarga.preco, 'brl'),
                        quantity: 1,
                        unit_price: recarga,
                        tipo: 'Recarga de Saldo para Perfil Host',
                    }
                ],
                

            }).then(response => {
                preferenceId.value = response.data.id;
            }).catch(() => {
                $q.notify({
                    message: 'Erro ao criar preferência de pagamento',
                    color: 'orange-14',
                    position: 'top',
                    icon: 'error',
                    timeout: 3000
                });
            });
        }
        await createPreference();
        mp.bricks().create("wallet", "wallet_container", {
            initialization: {
                preferenceId: preferenceId.value,
            },
            customization: {
                texts: {
                    valueProp: 'smart_option',
                },
            }
        });
        loading.value = false;
    } catch (error) {
        console.error(error);
    }
});
</script>

<style>
.grey-3WMlEf.svelte-1a1oxv8.svelte-1a1oxv8{
    color: rgba(255, 255, 255, 0.824)!important;
}
</style>