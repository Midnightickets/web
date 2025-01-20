<template>
    <q-layout view="hHh lpR lFr">

        <q-header class="bg-grad-2 text-white animate__animated animate__fadeInDown" height-hint="98">
            <q-toolbar>
                <q-toolbar-title class="row items-center">
                    <q-avatar>
                        <q-icon size="md" color="purple-1" name="local_activity" />
                    </q-avatar>
                    <a href="/" style="text-decoration: none;" id="title-layout"
                        class="text-purple-1 q-pl-xs text-bold">
                        Midnight Tickets
                    </a>
                </q-toolbar-title>
<!-- 
                <q-btn class="rounded-borders" size="md" :label="isMobile ? null :'menu'" color="primary" glossy icon-right="menu"
                    @click="toggleRightDrawer" /> -->
            </q-toolbar>

        </q-header>
<!-- 
        <q-drawer show-if-above v-model="rightDrawerOpen" side="right" class="bg-dark relative">
            <div  class="w100 row justify-center q-mt-xl">
                <a href="/" style="text-decoration: none;" id="title-layout"
                class="text-purple-1 text-bold row items-center q-mb-md">
                <q-icon size="md" class="q-pr-xs" color="purple-1" name="local_activity" />
                Midnight Tickets
                 </a>
                 <q-btn flat color="secondary" icon-right="home" to="/" label="página inicial"></q-btn>
                <q-list class="q-pt-md text-bold text-white">
                    <q-item v-for="item in menuOptions.items" :key="item.label" clickable @click="goTo(item)"
                        style="border-radius: 8px;"
                        class="q-mt-md q-mx-md text-blue-2 shadow-2 bg-grad-4">
                        <q-item-section avatar>
                            <q-icon :name="item.icon" color="grey-4" />
                        </q-item-section>
                        <q-item-section>
                            <q-item-label  class="text-grey-4">{{ item.label
                                }}</q-item-label>
                        </q-item-section>
                    </q-item>
                </q-list>
                <div class="absolute-bottom w100  row no-wrap items-center justify-center q-mt-xl text-primary q-py-sm">
                    <div class="row items-center w100 q-mb-md">
                        <q-btn class="w100 q-mb-xl" flat @click="rightDrawerOpen = !rightDrawerOpen" color="secondary">fechar menu</q-btn>
                        <q-btn label="logout" icon-right="logout" color="secondary" class="w100 q-mx-md" to="/" glossy></q-btn>
                    </div>
                </div>
            </div>
        </q-drawer> -->

        <q-page-container class="relative bg-grey-4 q-pa-md">
            <div class="w100 q-pt-md row justify-between">
                <q-btn icon-right="home" glossy color="secondary" label="início" size="md" @click="router.push('/')"
                    class="cursor-pointer" />
                    <div class="column">
                        <q-btn label="crie seu evento" glossy color="primary" size="md" @click="router.push('/login-host')"
                    class="cursor-pointer" />
                        <q-btn label="compre ingressos" glossy color="primary" size="md" @click="router.push('/login')"
                    class="cursor-pointer q-mt-sm" />
                    </div>
            </div>
            <div id="indice" class="q-pt-md">
                <q-toolbar class="bg-grad-4">
                    <q-toolbar-title
                        class="row justify-center q-py-sm text-bold text-white rounded-borders items-center q-gutter-x-sm">
                        <div id="title" class="text-center">
                            MIDNIGHT <br v-if="isMobile">TICKETS
                        </div>
                        <q-icon v-if="!isMobile" size="xl" color="white" name="local_activity" />
                    </q-toolbar-title>
                </q-toolbar>
                <div id="title" class="text-primary text-bold q-my-md">
                    Termos de Uso
                </div>
                <div class="column w100 q-gutter-y-md">
                    <q-btn icon="diamond" href="#host-termos" style="text-decoration: none;" class="text-bold text-secondary" label="Produtores de Eventos"></q-btn>
                    <q-btn icon="account_circle" href="#user-termos" style="text-decoration: none;" class="text-bold text-secondary" label="Usuários"></q-btn>
                    <q-btn icon="sensor_occupied" href="#subhost-termos" style="text-decoration: none;" class="text-bold text-secondary" label="Subhosts"></q-btn>
                </div>
            </div>
            <div class="w100 bg-secondary q-pt-xs q-mt-md rounded-borders"></div>
            <div id="host-termos" class="bg-grey-3 rounded-borders shadow-1 q-py-md border-left-roxo q-pl-md q-mt-md">
                <div id="title-2" class="q-mb-md text-primary">
                    Termos de Uso para Produtores de Eventos<br>
                </div>
               <div  style="font-size:1rem">
                <strong>Bem-vindo ao Midnight Tickets!</strong><br><br>
                Os presentes Termos de Uso estabelecem as regras e responsabilidades para os Produtores de Eventos
                que utilizam o software Midnight Tickets. Ao utilizar nossos serviços, o Produtor concorda integralmente com os termos descritos abaixo.
               </div>
               <div class="q-pt-md" id="host-termos" style="font-size:1rem">
                <strong>
                    1. Objetivo
                </strong><br>
                A Midnight Tickets oferece uma plataforma para a gestão de eventos e a venda de ingressos digitais, com suporte humanizado e funcionalidades que otimizam os lucros dos Produtores.
               </div>
               <div class="q-pt-md" id="host-termos" style="font-size:1rem">
                <strong>
                    2. Cadastro e Acesso
                </strong><br>
                2.1 Elegibilidade
                    O Produtor deve ter mais de 18 anos ou ser representado por pessoa maior de idade.
                    Ao se cadastrar, o Produtor declara que os dados fornecidos são verdadeiros e estão atualizados.
                <br>2.2 Responsabilidade do Cadastro
                    O Produtor é o único responsável pela confidencialidade e segurança de suas credenciais de acesso.
                    Qualquer atividade realizada por meio da conta do Produtor será considerada de sua responsabilidade.
               </div>
               <div class="q-pt-md" id="host-termos" style="font-size:1rem">
                <strong>
                    3. Utilização da Plataforma
                </strong><br>
                3.1 Criação de Eventos<br>
                O Produtor pode criar eventos utilizando as funcionalidades disponibilizadas pela Plataforma.
                Todos os eventos criados devem estar em conformidade com a legislação vigente e não devem violar direitos de terceiros.
                <br>3.2 Ajustes de Lotes
                    A Plataforma permite ajustes gratuitos de lotes de ingressos.
                    O Produtor é responsável por garantir a precisão das informações inseridas durante os ajustes.
                <br>3.3 Validação de Ingressos
                    Subhosts podem ser designados pelo Produtor para validar ingressos via QR Code na entrada dos eventos.
                    O acesso dos Subhosts é restrito à funcionalidade de validação e deve ser gerenciado pelo Produtor.
               </div>
               <div class="q-pt-md" id="host-termos" style="font-size:1rem">
                <strong>
                    4. Taxas e Pagamentos
                </strong><br>
                4.1 Modelo de Negócios<br>
                    A Midnight Tickets cobra de uma Taxa fixa de 5% sobre o valor do saldo disponível para saque.
                <br>
                4.2 Recebimentos<br>
                    O saldo das vendas será disponibilizado na conta vinculada ao Mercado Pago do Produtor.
                    Pagamentos aos Produtores estarão sujeitos a eventuais deduções por taxas de serviço ou encargos financeiros.
            </div>
               <div class="q-pt-md" id="host-termos" style="font-size:1rem">
                <strong>
                    5. Responsabilidades do Produtor
                </strong><br>
                5.1 Cumprimento Legal<br>
                    O Produtor deve assegurar que seus eventos estão em conformidade com a legislação vigente e com regulamentos locais.
                    O Produtor é integralmente responsável por questões relacionadas à realização do evento, incluindo segurança, autorizações e alvarás.
                <br>
                5.2 Conteúdo e Informações<br>
                    O Produtor é responsável por todo o conteúdo relacionado ao evento, incluindo descrição, preços e imagens.
                    É proibido divulgar informações enganosas, ofensivas ou que infrinjam direitos de terceiros.
            </div>
               <div class="q-pt-md" id="host-termos" style="font-size:1rem">
                <strong>
                    6. Limitação de Responsabilidade
                </strong><br>
                    A Midnight Tickets não se responsabiliza por:
                    Problemas ou prejuízos decorrentes da realização do evento, incluindo cancelamentos ou alterações de data.
                    Perdas financeiras ocasionadas por informações incorretas fornecidas pelo Produtor.
            </div>
               <div class="q-pt-md" id="host-termos" style="font-size:1rem">
                <strong>
                    7. Privacidade e Dados
                </strong><br>
                A Midnight Tickets adota medidas de segurança para proteger os dados dos Produtores e compradores. Ao utilizar a Plataforma, o Produtor concorda com o uso de seus dados conforme descrito na nossa Política de Privacidade.
            </div>
               <div class="q-pt-md" id="host-termos" style="font-size:1rem">
                <strong>
                    9. Alterações nos Termos de Uso
                </strong><br>
                A Midnight Tickets pode alterar os presentes Termos de Uso a qualquer momento. As alterações serão notificadas com antecedência e o uso continuado da Plataforma implica aceitação dos novos termos.
            </div>
            </div>
            <div id="user-termos" class="bg-grey-3 rounded-borders shadow-1 q-py-md border-left-roxo q-pl-md q-mt-xl">
                <div id="title-2" class="q-mb-md text-primary">
                    Termos de Uso para Usuários<br>
                </div>
                <div style="font-size:1rem">
                    <strong>Bem-vindo ao Midnight Tickets!</strong><br><br>
                    Os presentes Termos de Uso estabelecem as regras e responsabilidades para os Usuários que utilizam o software Midnight Tickets. Ao utilizar nossos serviços, o Usuário concorda integralmente com os termos descritos abaixo.
                </div>
                <div class="q-pt-md" id="user-termos" style="font-size:1rem">
                    <strong>
                        1. Objetivo
                    </strong><br>
                    A Midnight Tickets oferece uma plataforma para a compra e gestão de ingressos digitais, com suporte humanizado e funcionalidades que otimizam a experiência dos Usuários.
                </div>
                <div class="q-pt-md" id="user-termos" style="font-size:1rem">
                    <strong>
                        2. Cadastro e Acesso
                    </strong><br>
                    2.1 Elegibilidade<br>
                        O Usuário deve ter mais de 18 anos ou ser representado por pessoa maior de idade. 
                        Ao se cadastrar, o Usuário declara que os dados fornecidos são verdadeiros e estão atualizados.
                    <br>2.2 Responsabilidade do Cadastro<br>
                        O Usuário é o único responsável pela confidencialidade e segurança de suas credenciais de acesso. 
                        Qualquer atividade realizada por meio da conta do Usuário será considerada de sua responsabilidade.
                </div>
                <div class="q-pt-md" id="user-termos" style="font-size:1rem">
                    <strong>
                        3. Utilização da Plataforma
                    </strong><br>
                    3.1 Compra de Ingressos<br>
                    O Usuário pode adquirir ingressos para eventos utilizando as funcionalidades disponibilizadas pela Plataforma. 
                    Todos os pagamentos devem ser realizados de forma legítima e conforme as instruções descritas no processo de compra.
                    <br>3.2 Responsabilidade pela Compra<br>
                        O Usuário é responsável por garantir a veracidade das informações fornecidas no momento da compra.
                        Ingressos adquiridos de maneira indevida ou com dados incorretos podem ser cancelados.
                    <br>3.3 Validação de Ingressos<br>
                        O Usuário deve garantir que o ingresso adquirido esteja disponível e válido para o evento. 
                        A Midnight Tickets não se responsabiliza por ingressos inválidos ou não utilizados.
                </div>
                <div class="q-pt-md" id="user-termos" style="font-size:1rem">
                    <strong>
                        4. Taxas e Pagamentos
                    </strong><br>
                    4.1 Taxas de Serviço<br>
                        A Midnight Tickets pode aplicar taxas de serviço sobre a compra de ingressos, que serão informadas no momento da transação.
                    <br>
                    4.2 Reembolsos<br>
                        Solicitações de reembolso devem ser feitas diretamente com o Produtor do evento. A Midnight Tickets atua apenas como intermediária na compra de ingressos.
                </div>
                <div class="q-pt-md" id="user-termos" style="font-size:1rem">
                    <strong>
                        5. Responsabilidades do Usuário
                    </strong><br>
                    5.1 Cumprimento Legal<br>
                        O Usuário deve assegurar que sua participação nos eventos está em conformidade com a legislação vigente e com regulamentos locais.
                    <br>
                    5.2 Uso Indevido<br>
                        É proibido usar a Plataforma para fins fraudulentos, ilegais ou que prejudiquem o funcionamento do serviço.
                </div>
                <div class="q-pt-md" id="user-termos" style="font-size:1rem">
                    <strong>
                        6. Limitação de Responsabilidade
                    </strong><br>
                        A Midnight Tickets não se responsabiliza por:
                        Problemas ou prejuízos decorrentes da realização do evento, incluindo cancelamentos ou alterações de data.
                        Perdas financeiras ocasionadas por informações incorretas fornecidas pelo Usuário.
                </div>
                <div class="q-pt-md" id="user-termos" style="font-size:1rem">
                    <strong>
                        7. Privacidade e Dados
                    </strong><br>
                    A Midnight Tickets adota medidas de segurança para proteger os dados dos Usuários. Ao utilizar a Plataforma, o Usuário concorda com o uso de seus dados conforme descrito na nossa Política de Privacidade.
                </div>
                <div class="q-pt-md" id="user-termos" style="font-size:1rem">
                    <strong>
                        9. Alterações nos Termos de Uso
                    </strong><br>
                    A Midnight Tickets pode alterar os presentes Termos de Uso a qualquer momento. As alterações serão notificadas com antecedência e o uso continuado da Plataforma implica aceitação dos novos termos.
                </div>
            </div>
            <div id="subhost-termos" class="bg-grey-3 rounded-borders shadow-1 q-py-md border-left-roxo q-pl-md q-mt-xl">
                <div id="title-2" class="q-mb-md text-primary">
                    Termos de Uso para Subhosts<br>
                </div>
                <div style="font-size:1rem">
                    <strong>Bem-vindo ao Midnight Tickets!</strong><br><br>
                    Os presentes Termos de Uso estabelecem as regras e responsabilidades para os Subhosts que utilizam o ambiente de validação de ingressos. Ao utilizar nossos serviços, o Subhost concorda integralmente com os termos descritos abaixo.
                </div>
                <div class="q-pt-md" id="subhost-termos" style="font-size:1rem">
                    <strong>
                        1. Objetivo
                    </strong><br>
                    A Midnight Tickets disponibiliza um ambiente de validação de ingressos exclusivo para Subhosts, permitindo que eles autentiquem entradas utilizando QR Codes de forma prática e segura.
                </div>
                <div class="q-pt-md" id="subhost-termos" style="font-size:1rem">
                    <strong>
                        2. Cadastro e Acesso
                    </strong><br>
                    2.1 Chave de Acesso<br>
                        O Subhost deve receber uma chave secreta do Produtor para acessar o ambiente de validação. Essa chave é única e intransferível.
                    <br>2.2 Elegibilidade<br>
                        Apenas indivíduos designados pelo Produtor podem atuar como Subhosts. Ao acessar a plataforma, o Subhost declara que utilizará as funcionalidades exclusivamente para validar ingressos dos eventos autorizados.
                    <br>2.3 Confidencialidade<br>
                        É responsabilidade do Subhost proteger a chave de acesso e garantir que terceiros não tenham acesso ao ambiente de validação.
                </div>
                <div class="q-pt-md" id="subhost-termos" style="font-size:1rem">
                    <strong>
                        3. Utilização da Plataforma
                    </strong><br>
                    3.1 Validação de Ingressos<br>
                        O Subhost deve utilizar o ambiente de validação para verificar ingressos apresentados pelos participantes do evento, por meio do QR Code fornecido.
                    <br>3.2 Limitação de Funcionalidades<br>
                        O ambiente de validação é restrito a funções específicas para autenticação de ingressos. O Subhost não terá acesso a informações financeiras, de gestão ou dados sensíveis do evento.
                    <br>3.3 Responsabilidade na Validação<br>
                        O Subhost deve garantir que o processo de validação seja realizado de forma correta, minimizando erros e atendendo aos participantes de forma cordial.
                </div>
                <div class="q-pt-md" id="subhost-termos" style="font-size:1rem">
                    <strong>
                        4. Responsabilidades do Subhost
                    </strong><br>
                    4.1 Uso Apropriado<br>
                        O Subhost deve utilizar a chave de acesso e o ambiente de validação exclusivamente para o evento autorizado pelo Produtor.
                    <br>4.2 Prevenção de Uso Indevido<br>
                        Qualquer tentativa de uso indevido ou compartilhamento da chave de acesso será de responsabilidade do Subhost e poderá resultar em bloqueio de acesso.
                </div>
                <div class="q-pt-md" id="subhost-termos" style="font-size:1rem">
                    <strong>
                        5. Limitação de Responsabilidade
                    </strong><br>
                        A Midnight Tickets não se responsabiliza por:
                        <ul>
                            <li>Erros na validação de ingressos decorrentes de mau uso da plataforma pelo Subhost.</li>
                            <li>Perdas ou danos causados pelo compartilhamento indevido da chave de acesso.</li>
                        </ul>
                </div>
                <div class="q-pt-md" id="subhost-termos" style="font-size:1rem">
                    <strong>
                        6. Privacidade e Dados
                    </strong><br>
                    A Midnight Tickets emprega medidas de segurança para proteger os dados do Subhost e dos participantes. Ao utilizar a plataforma, o Subhost concorda com o uso de seus dados conforme descrito na Política de Privacidade.
                </div>
                <div class="q-pt-md" id="subhost-termos" style="font-size:1rem">
                    <strong>
                        7. Alterações nos Termos de Uso
                    </strong><br>
                    A Midnight Tickets pode alterar os presentes Termos de Uso a qualquer momento. As alterações serão comunicadas antecipadamente, e o uso contínuo da plataforma implicará na aceitação dos novos termos.
                </div>
            </div>
            
            <div class="w100 flex flex-center bg-grad-4 text-grey-3 text-bold q-py-lg q-px-md text-center q-my-xl rounded-borders shadow-1">
                19 de janeiro de 2025
                <br>midnightickets@gmail.com
            </div>
        </q-page-container>
        <footer class="w100 row wrap justify-center items-center q-py-xl bg-primary q-px-xl">
            <div class=" column q-py-md">
                <q-btn label="Crie seu evento" to="/login-host" class="text-grey-5" flat></q-btn>
                <q-btn label="Valide ingressos" to="/login-subhost" class="text-grey-5" flat></q-btn>
                <q-btn label="Compre ingressos" to="/login" class="text-grey-5" flat></q-btn>
                <q-btn label="Encontre eventos" to="/" class="text-grey-5" flat></q-btn>
            </div>
            <div class="w100 q-pt-xs bg-secondary rounded-borders"></div>
            <div class="column q-py-md items-center">
                <q-btn label="Suporte" class="text-grey-5" flat></q-btn>
                <q-btn label="email" @click="alertar('midnightickets@gmail.com')" class="text-grey-5" flat></q-btn>
                <q-btn label="termos de uso" to="/termos-de-uso"  class="text-grey-5" flat></q-btn>
                <q-btn label="instagram" @click="goTo('https://www.instagram.com/midnightickets')" class="text-grey-5" flat></q-btn>
                <q-btn label="desenvolvedor" @click="goTo('https://samuelvictorol.github.io/portfolio')" class="text-grey-5" flat></q-btn>
            </div>
            <div class="w100 row q-pt-xl items-center justify-start text-secondary" id="title-layout">
                Midnight Tickets Software
            </div>
        </footer>

    </q-layout>
</template>

<script setup>
import { Utils } from 'src/utils/Utils';
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const isMobile = window.innerWidth < 800
const rightDrawerOpen = ref(false)
const router = useRouter()
// const isMobile = window.innerWidth < 800

const menuOptions = ref({
    items: [
        // USER MENUS
        { label: 'Índice', icon: 'list', to: '/admidnightickets', role: 'admin' },
        { label: 'Buscar Logs', icon: 'search', to: '/admidnightickets/buscar-logs', role: 'admin' },
        { label: 'Buscar Pagamento', icon: 'account_balance', to: '/admidnightickets/buscar-pagamento', role: 'admin' },
        { label: 'Produtores', icon: 'diamond', to: '/admidnightickets/hosts', role: 'admin' },
        { label: 'Usuários', icon: 'groups', to: '/admidnightickets/users', role: 'admin' },
        { label: 'Suporte', icon: 'support', to: '#', role: 'admin' },
    ]
})


function goTo(url) {
    window.open(url, '_blank')
}

const toggleRightDrawer = () => {
    rightDrawerOpen.value = !rightDrawerOpen.value
}


function openInstagramMidnightickets() {
    window.open('https://www.instagram.com/midnightickets', '_blank')
}

function alertar(msg) {
    alert(msg)
}

</script>
<style scoped>
.bg-purple-2 {
    background-color: #8025e22b !important;
}

.shadow-inset {
    box-shadow: inset 0 0 96px 0 rgba(0, 0, 0, 0.552);
}
</style>