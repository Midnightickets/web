<template>
    <q-page class="text-white bg-grey-2 q-pb-xl">
        <div id="title" class="q-pt-sm w100 text-primary text-center">
            Buscar Pagamento Mercado Pago
        </div>
        <div id="container" class="w100 q-px-md q-mt-xl rounded-borders justify-center items-center row q-gutter-md">
                <q-card>
                    <q-card-section>
                        <q-input v-model="idPagamento" label="ID Pagamento" maxlength="100" outlined >
                            <template v-slot:prepend>
                                <q-icon name="payment" :color="idPagamento.length >= 11 ? 'primary' : 'grey'" class="cursor-pointer" @click="pasteIdPagamento()"/>
                            </template>
                        </q-input>
                    </q-card-section>
                </q-card>
                <q-card style="border-left: 6px solid blue;"
                    class="bg-grey-4 rounded-borders text-bold">
                    <q-card-section class="w100">
                        <q-btn @click="buscarPagamento()" label="buscar pagamento" color="primary" glossy class="w100 q-py-md"
                            icon-right="search"></q-btn>
                    </q-card-section>
                </q-card>
        </div>
    </q-page>
</template>

<script setup>
import { useQuasar } from 'quasar';
import { api } from 'src/boot/axios';
import { ref } from 'vue';

const $q = useQuasar()
const idPagamento = ref('')

function pasteIdPagamento() {
    navigator.clipboard.readText()
        .then(text => {
            idPagamento.value = text
        })
        .catch(err => {
            console.error('Failed to read clipboard contents: ', err)
        })
}

async function buscarPagamento() {
    await api.post('/admin/getPagamento', { pagamento_mercadopago_id: idPagamento.value })
        .then((response) => {
            const formattedJson = JSON.stringify(response.data, null, 2);
            $q.dialog({
                title: 'Pagamento',
                color: 'secondary',
                message: `<pre style="font-family: monospace; white-space: pre-wrap; text-align: left;">${formattedJson}</pre>`,
                html: true,
                ok: 'Fechar',
            })
        })
        .catch((error) => {
            $q.notify({
                color: 'negative',
                position: 'top',
                message: 'Erro ao buscar pagamento',
                icon: 'report_problem',
            })
        })
}

</script>

<style scoped>
</style>