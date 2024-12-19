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
import { onBeforeMount, ref } from "vue";
import { api } from "src/boot/axios";
import { useQuasar } from "quasar";

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
    const user = JSON.parse(sessionStorage.getItem('user'));
    $q.notify({
        message: 'Confirmando a compra do Ingresso, você concorda com a taxa de 5% sobre o valor da transação.',
        color: 'secondary',
        position: 'top',
        icon: 'request_quote',
        timeout: 6000
    });
    try {
        const ticketConfigs = JSON.parse(sessionStorage.getItem('ticketConfigs'));
        
        await loadScript('https://sdk.mercadopago.com/js/v2');
        const mp = new MercadoPago(process.env.MIDNIGHTICKETS_MERCADO_PAGO_PK, { locale: 'pt-BR' });
        const createPreference = async () => {
            await api.post('/create_preference', {
                back_urls: {
                    "success": baseURL + '/host',
                    "failure": baseURL + '/host',
                    "pending": baseURL + '/host',
                },
                user: user.id,
                ticket_type: ticketConfigs,
                auto_return: "approved",
                items: [
                    {
                        title: '🎫 Compra do Ingresso: ' + ticketConfigs.title + ' por R$ ' + ticketConfigs.totalValue,
                        quantity: 1,
                        unit_price: ticketConfigs.price,
                        event_id: ticketConfigs.event_id,
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