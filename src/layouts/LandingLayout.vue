<template>
    <q-layout class="relative animate__animated animate__fadeIn">
        <q-header class="fixed bg-glass-2 text-white animate__animated animate__fadeInDown animate__slow shadow-1"
            height-hint="98">
            <div class="row justify-between items-center">
                <a @click="scrollBot()" class="menu-item q-pa-sm animate__animated animate__fadeInLeft animate__slow animate__delay-1s row no-wrap items-center" id="title-menu">
                    <q-icon class="q-pr-xs" name="local_activity" size="xl" /> Midnight Tickets
                </a>
            </div>
            <div style="font-size: .8rem;" class=" relative w100 row no-wrap items-center q-py-sm">
                
                <div class="row items-center no-wrap justify-center q-gutter-x-sm w100 q-px-md">
                    <q-btn style="border-radius: 10px;" dense color="primary" label="área do produtor" glossy class="text-bold bg-primary rounded-borders  q-px-md q-py-sm text-white row items-center" v-if=" userInfo == ''" to="/login-host">
                    </q-btn>
                    <a v-if="!isMobile & userInfo == ''" class="menu-item text-grey-4 text-center q-mr-md q-px-md" href="#quem-somos">
                        Quem Somos
                    </a>
                    <a v-if="!isMobile & userInfo == ''" class="menu-item text-center text-grey-4 q-mr-md q-px-md" href="#vantagens">
                        Vantagens
                    </a>
                    <!-- <a v-if="!isMobile & userInfo == ''" class="menu-item text-center text-grey-4 q-mr-md q-px-md" href="#contato">
                        Contato
                    </a> -->
                    <q-btn  class="text-bold q-px-md q-py-sm text-white row items-center" style="border-radius: 10px;" v-if="userInfo == ''" glossy dense label="entrar"
                    icon-right="login" color="green-14  "
                        @click="navigateTo('/login')">
                    </q-btn>
                    <q-btn v-if="userInfo != ''" dense class="text-white text-bold q-pa-sm row items-center" icon="confirmation_number" label="meus ingressos" color="primary" glossy
                    style="border-radius:8px" to="/me">
                </q-btn>
                <q-btn label="meu perfil" icon-right="account_circle" color="secondary" v-if="userInfo != ''" glossy dense class="text-bold text-white q-pa-sm row items-center"
                style="border-radius:8px" to="/me/perfil">
            </q-btn>
                </div>
            </div>
            <q-dialog v-model="dialogResults">
                <div v-if="loading" class="row w100 q-py-sm q-mt-xs justify-center">
                    <q-spinner-ball color="secondary" size="lg" />
                    <q-spinner-ball color="secondary" size="lg" />
                    <q-spinner-ball color="secondary" size="lg" />
                </div>
                <q-card v-if="!loading">
                    <div class="w100 q-px-md text-primary q-pt-sm" id="title">{{ searchPublic.isByHostName ? `Produtores` : 'EVENTOS' }}</div>
                    <q-card-section>
                        <q-list class="column q-gutter-y-md">
                            <q-item class="card-search rounded-borders shadow-1  q-pb-md" v-for="host in hostsResults" :key="host.id" clickable>
                                <q-avatar size="80px" class="q-mr-sm q-mt-sm     shadow-2">
                                    <img v-if="host.img_url && host.img_url.trim() !== ''" :src="host.img_url" style="object-fit:fill" class="rounded-borders shadow-1" alt="banner do Evento">
                                </q-avatar>
                                <q-item-section>
                                        <q-item-label class="text-bold text-primary" id="title-layout">
                                            {{ host.name.toUpperCase() }}
                                        </q-item-label>
                                        <q-item-label class="text-secondary text-bold">
                                            <q-icon name="person" class="q-pr-xs"/>
                                            {{ host.login.toLowerCase() }}
                                        </q-item-label>
                                        <q-item-section class="w100 q-mt-md">
                                            <q-btn @click="goToPublicHostPage(host.login)" label="ver produtor" icon="person_search" color="primary" glossy class="shadow-2"></q-btn>
                                        </q-item-section>
                                    </q-item-section>
                            </q-item>
                            <q-item class="card-search q-py-md shadow-1 rounded-borders q-mb-xl " v-for="event in eventsResults" :key="event.id" clickable style="border-left: 4px solid #762ED3">
                                <q-item-section>
                                    <q-btn  @click="goToPublicEventPage(event.event_url)" :label="event.title.toLowerCase()" color="primary" glossy class="w100 q-pa-md q-mb-md shadow-2"></q-btn>
                                    <img v-if="event.img_url && event.img_url.trim() !== ''"  :src="event.img_url" class="rounded-borders shadow-1 q-mb-md" alt="banner do Evento">
                                    <div class="text-secondary row items-center q-mt-sm">
                                        <q-icon name="event" class="q-pr-xs" />
                                        {{ event.date.replaceAll('-', '/') }}
                                    </div>
                                    <q-item-label class="text-secondary">
                                        <q-icon name="person" class="q-pr-xs"/>
                                        {{ event.host.toLowerCase() }}
                                    </q-item-label>
                                    <q-item-section class="w100 q-mt-md">
                                        <q-btn  @click="goToPublicEventPage(event.event_url)" label="ver evento"  icon-right="search" color="green-14" glossy class="w100 q-pa-md shadow-2"></q-btn>
                                    </q-item-section>
                                </q-item-section>
                            </q-item>
                        </q-list>
                    </q-card-section>
                    <div class="w100 row justify-center close dialog q-pb-md">
                        <q-btn @click="dialogResults = false" color="secondary" flat label="Fechar" />
                    </div>
                </q-card>
            </q-dialog>
        </q-header>
        <q-page-container v-if="userInfo === ''" class="bg-grey-3">
            <!-- <div  class="rounded-borders w100 row justify-center q-mt-md relative" style="overflow: hidden ">
                <div v-if="userInfo == ''" class="animate__animated animate__zoomInDown animate__delay-1s animate__slower column rounded-borders justify-center q-px-sm  w100"
                    style="overflow: hidden ;z-index: 9;">
                    calculadora de economia de taxas
                </div>
            </div> -->
            <div v-if="searchPublic.opened" id="search-public" class="w100 rounded-borders row justify-center">
                <q-card id="search-card" class="w100 q-mb-md animate__animated rounded-borders animate__fadeInDown animate__slower bg-grey-1">
                    <q-card-section class="w100 rounded-borders q-pa-md column" style="border-bottom: 4px solid #762ED3">
                        <q-input class="w100 relative" maxlength="100" v-model="searchPublic.titleEventOrHostName" @keyup.enter="searchPublicEventsOrHost()" outlined 
                        :label="searchPublic.isByHostName ? 'Nome do Produtor' : 'Encontre Eventos'"
                             :placeholder="searchPublic.isByHostName ? 'Digite o Nome do Produtor' : 'Digite o Título do Evento'">
                            <template v-slot:prepend>
                                <q-icon name="search" color="primary" />
                            </template>
                            <template v-slot:append>
                                <q-btn @click="searchPublicEventsOrHost()" class="absolute-right" icon-right="send" color="primary"></q-btn>
                            </template>
                        </q-input>
                        <!-- <div class="w100">
                            <q-radio v-model="searchPublic.isByHostName" color="primary" :val="false" label="Buscar por Evento" />
                            <q-radio v-model="searchPublic.isByHostName" color="primary" :val="true" label="Buscar por Produtor" />
                        </div> -->
                        <!-- <div v-if="isMobile" class="w100 column justify-center ">
                            <q-btn :disabled="disabledSearch()" @click="searchPublicEventsOrHost(false)" color="blue-14" glossy class="shadow-1 w100 q-py-sm q-mb-md" label="Buscar por Evento"
                            icon="event" />
                            <q-btn :disabled="disabledSearch()" @click="searchPublicEventsOrHost(true)" color="primary" glossy class="shadow-1 w100 q-py-sm" label="Buscar por Produtor"
                                icon="person_search" />
                        </div>
                        <div v-else class="w100 row no-wrap justify-between items-center">
                            <q-btn :disabled="disabledSearch()" @click="searchPublicEventsOrHost(false)" color="blue-14" glossy class="shadow-1 w100 q-mr-md q-py-xl" label="Buscar por Evento"
                            icon="event" />
                            <q-btn :disabled="disabledSearch()" @click="searchPublicEventsOrHost(true)" color="primary" glossy class="shadow-1 w100 q-py-xl" label="Buscar por Produtor"
                                icon="person_search" /> 
                        </div> -->
                    </q-card-section>
                </q-card>
            </div>
            <q-page class="">
                <div style="border: 8px solid #692EDD;border-radius: 8px;"
                    class="q-mt-md q-mb-md animate__animated animate__zoomIn animate__slower ">
                    <q-toolbar class="bg-grad-4">
                        <q-toolbar-title
                            class="row justify-center q-py-sm text-bold text-white rounded-borders items-center q-gutter-x-sm">
                            <div id="title" class="text-center">
                                MIDNIGHT <br v-if="isMobile">TICKETS
                            </div>
                            <q-icon v-if="!isMobile" size="xl" color="white" name="local_activity" />
                        </q-toolbar-title>
                    </q-toolbar>
                    <div class="w100 text-center text-grey-1 text-shadow bg-secondary q-py-md text-bold q-px-md"
                        style="font-size:1rem">
                        REALIZE EVENTOS com A MENOR TAXA do mercado e PARE de PAGAR TRIBUTOS excessivos na VENDA DE INGRESSOS
                    </div>
                    <div v-if="userInfo == ''" class="rounded-borders row justify-center  q-mx-md">
                        <q-card  id="email-card"
                            class="text-white bg-grad-1 q-mt-md text-bold rounded-borders animate__animated animate__zoomIn animate__slower animate__delay-3s">
                            <p class="text-center q-pt-md q-px-md high-opacity" style="font-size: .8rem;">DIGITE seu
                                EMAIL e ALAVANQUE o seu FATURAMENTO em INGRESSOS</p>
                            <q-input :inputStyle="{ fontWeight: 'bold', color: '#6310E1' }" v-model="contato.email"
                                type="email" class="bg-white rounded-borders" filled label="Email">
                                <template v-slot:prepend>
                                    <q-icon name="email" color="primary" />
                                </template>
                                <template v-slot:append>
                                    <q-btn @click="fastEmailGetter()" color="primary" icon="send" label="Enviar" />
                                </template>
                            </q-input>
                        </q-card>
                    </div>
                    <div  class="w100 img-wrapper">
                        <img  class="img"
                            src="https://images.blush.design/PJcHFUF4pMy6BXPLEFnD?w=500&auto=compress&cs=srgb" alt="">
                    </div>
                    <div id="quem-somos" class="absolute" style="top:65vh"></div>
                    <div style="font-size:1.3rem" class=" bg-grad-4 text-white text-bold q-px-sm q-py-md text-center">
                        Quem
                        Somos ?</div>
                    <div style="font-size:1.1rem"
                        class=" bg-grad-2 text-white high-opacity text-bold q-px-sm q-py-md text-center text-shadow">
                        Somos
                        um aplicativo de Bilheteria Online e Gerenciamento de Eventos focados na escalabilidade
                        de seus lucros em venda de ingressos digitais</div>
                    <div class="w100 img-wrapper bg-grad-3">
                        <img class="img"
                            src="https://images.blush.design/UKjlMI8EIiiOMVntZau4?w=920&auto=compress&cs=srgb" alt="">
                    </div>
                    <div style="font-size:1.3rem" class=" bg-grad-4 text-white text-bold q-px-sm q-py-md text-center">O que Fazemos ?</div>
                    <div style="font-size:1.1rem"
                        class="text-shadow q-mb-md bg-grad-2 text-white high-opacity text-bold q-px-sm q-py-md text-center">
                        Maximizamos o faturamento na venda de seus ingressos de forma escalável. Além de gerenciar eventos em tempo real temos 
                        suporte humanizado e uma interface amigável sem a necessidade de instalação
                        <br>
                    </div>
                    <div class="w100 img-wrapper column">
                        <img class="img" src="~/assets/landing-images/drawn1.png" alt="">
                    </div>
                    <div style="font-size:1.3rem" class="bg-grad-4 text-white text-bold q-px-sm q-py-md text-center">Como
                        Fazemos ?
                    </div>
                    <div id="vantagens" style="font-size:1.1rem;"
                        class="text-shadow bg-grad-2 text-white high-opacity  text-bold q-px-sm  q-py-md text-center">
                        Utilizamos tecnologias de ponta com criptografia e reduzimos o tráfego de dados para garantir a segurança de suas informações
                        na nuvem com eficiência, diminuindo custos de operação de seus eventos cobrando apenas <strong>5% de taxa</strong> de saque.
                    </div>
                </div>
                <div class="rounded-borders" style="border: 4px solid #692EDD;">
                    <!-- <div style="letter-spacing:1px"
                        class="text-shadow text-h6 w100 text-bold text-blue-4 text-center q-px-md q-py-sm border-bottom">
                        Veja como
                        nossa Plataforma pode aumentar o Faturamento do seu Evento!!</div> -->
                        <div id="title"
                        class="text-h4 bg-white rounded-borders text-primary text-center w100 border-bottom text-bold q-pt-md q-pb-md">
                        Vantagens
                    </div>
                    <div style="font-size:1.1rem" class="text-shadow q-px-md bg-grey-2 text-left q-py-md rounded-borders">
                        🟣 <strong class="text-primary">TAXA REDUZIDA, MAIS LUCRO PARA VOCÊ<br></strong>
                        Nosso <strong>modelo de negócio</strong> é <strong>diferente das plataformas tradicionais</strong>, nossa taxa é de apenas <strong>8% na venda</strong> e <strong>5% no saque</strong>. <strong>Pague menos e lucre mais</strong> com cada ingresso vendido!<br>
                        <br>🟣 <strong class="text-primary">LUCRO EM TEMPO REAL<br></strong>
                        Acompanhe suas <strong>vendas ao vivo</strong>, com <strong>atualização automática</strong> e <strong>painel intuitivo</strong>. Saiba exatamente <strong>quanto está faturando</strong> enquanto seu evento acontece!<br><br>
                        🟣 <strong class="text-primary">AJUSTES DE LOTES GRATUITOS<br></strong>
                        Precisa <strong>alterar valores</strong> ou <strong>disponibilidade de ingressos</strong>? Edite seus lotes <strong>em tempo real</strong>, <strong>sem taxas adicionais</strong>, garantindo <strong>máxima flexibilidade</strong> na venda.<br><br>
                        🟣 <strong class="text-primary">VALIDAÇÃO RÁPIDA E SEGURA DE INGRESSOS<br></strong>
                        Facilite a entrada do público com <strong>check-in via QR Code</strong>! Cadastre <strong>subhosts</strong> para validar ingressos <strong>sem precisar de aplicativos</strong>, utilizando apenas a <strong>câmera do celular</strong> e um <strong>navegador</strong>.
                    </div>
                    <div id="title"
                        class="w100 text-h4 text-bold bg-white text-primary text-center q-px-md q-mt-md rounded-borders q-py-sm border-bottom"
                        style="border-top:4px solid #692EDD">
                        Benefícios
                    </div>
                    <div style="font-size:1.1rem" class="text-shadow q-px-md bg-grey-2 q-py-md rounded-borders border-bottom">
                        💸 <strong style="font-size:1.2rem" class="text-primary text-bold">DIGA ADEUS ÀS TAXAS ABUSIVAS<br></strong>
                        Estamos <strong>integrados ao Mercado Pago</strong>, garantindo <strong>segurança</strong>, <strong>rapidez nos pagamentos</strong> e a <strong>menor taxa do mercado</strong> para produtores de eventos.<br>
                        <br>
                        🤚🏼 <strong style="font-size:1.2rem" class="text-primary text-bold">100% WEB, SEM NECESSIDADE DE INSTALAÇÃO<br></strong>
                        Gerencie tudo <strong>direto do navegador</strong>, seja no <strong>celular</strong>, <strong>computador</strong> ou até no <strong>Instagram</strong>!<br>
                        <br>
                        🧑🏼‍💻 <strong style="font-size:1.2rem" class="text-primary text-bold">SUPORTE HUMANIZADO, VOCÊ NÃO FICA NA MÃO<br></strong>
                        Nosso time <strong>acompanha seu evento de perto</strong> e está sempre disponível para <strong>resolver dúvidas</strong> e <strong>otimizar seu faturamento</strong>.<br>
                        <br>
                        🖥️ <strong style="font-size:1.2rem" class="text-primary text-bold">INTUITIVO, RÁPIDO E DE QUALQUER LUGAR</strong><br>
                        Nosso sistema é <strong>fácil de usar</strong>: uma <strong>interface amigável</strong> otimizada para <strong>qualquer dispositivo</strong>, sem a necessidade de instalação. <strong>Além disso, estamos constantemente implementando novas funcionalidades sem custo adicional para você</strong>.<br>
                        <br>
                        📲 <strong style="font-size:1.2rem" class="text-primary text-bold">TECNOLOGIA DE PONTA<br></strong>
                        Nosso sistema é <strong>hospedado na nuvem</strong>, garantindo <strong>estabilidade</strong>, <strong>rapidez</strong> e <strong>segurança</strong> para produtores, organizadores e compradores de ingressos.
                    </div>
                    
                </div>
                <!-- <q-carousel v-model="slide" transition-prev="scale" transition-next="scale" swipeable animated
                  control-color="white" navigation autoplay="true" infinite padding arrows
                  class="bg-primary text-white shadow-1 q-mt-md">
                  <q-carousel-slide :name="1" img-src="~/assets/landing-images/login.png"
                      class="column no-wrap flex-center">
                  </q-carousel-slide>
                  <q-carousel-slide :name="2" img-src="~/assets/landing-images/evento.png"
                      class="column no-wrap flex-center">
                  </q-carousel-slide>
                  <q-carousel-slide :name="3" img-src="~/assets/landing-images/evento2.png"
                      class="column no-wrap flex-center">
                  </q-carousel-slide>
                  <q-carousel-slide v-if="isMobile" :name="4" img-src="~/assets/landing-images/evento3.png"
                      class="column no-wrap flex-center">
                  </q-carousel-slide>
                  <q-carousel-slide :name="5" img-src="~/assets/landing-images/evento4.png"
                      class="column no-wrap flex-center">
                  </q-carousel-slide>
                  <q-carousel-slide :name="6" img-src="~/assets/landing-images/evento5.png"
                      class="column no-wrap flex-center">
                  </q-carousel-slide>
              </q-carousel> -->
                <!-- <div class=" relative"  id="contato">
                    <div class="text-h4 rounded-borders text-bold q-py-md text-white text-center bg-grad-4 border-bottom q-mt-md">
                        Fale Conosco</div>

                    <div class="space rounded-borders q-my-md  "
                        style="border-radius: 20px;border-bottom: 8px solid #3C0783;z-index: -10">
                        <q-card class="q-pa-md collumn q-gutter-y-md rounded-borders "
                            style="border: 15px solid #6310E1; border-bottom-left-radius: 0px; border-bottom-right-radius: 0px;">
                            <div class="text-shadow w100 text-center text-primary text-bold mid-opacity ">
                                ALAVANQUE seu FATURAMENTO otimizando o LUCRO de suas VENDAS agora mesmo!<br>Digite seu EMAIL para solicitar o CONTATO de um dos nossos CONSULTORES</div>
                                <q-input v-if="hostInfo == ''" placeholder="Digite seu email" :inputStyle="{ fontWeight: 'bold', color: '#6310E1' }" maxlength="200" filled
                                    v-model="contato.email" label="Email*">
                                    <template v-slot:append>
                                        <q-icon name="mail" color="primary" />
                                    </template>
                                </q-input>
                                <q-input :inputStyle="{ fontWeight: 'bold', color: '#6310E1' }" maxlength="200" outlined
                                v-model="contato.email" label="Email*">
                                <template v-slot:append>
                                    <q-icon name="email" color="primary" />
                                </template>
                            </q-input>
                            <div class="mid-opacity text-blue-6 text-center w100 text-bold">
                                Os campos abaixos são opcionais
                            </div>
                            <q-input :inputStyle="{ fontWeight: 'bold', color: '#6310E1' }" maxlength="200" filled
                                v-model="contato.form.name" label="1.Qual é o seu nome?">
                                <template v-slot:append>
                                    <q-icon name="person" color="primary" />
                                </template>
                            </q-input>
                            <q-input :inputStyle="{ fontWeight: 'bold', color: '#6310E1' }" maxlength="200" filled
                                v-model="contato.form.companyName" label="2.Nome da Empresa">
                                <template v-slot:append>
                                    <q-icon name="business" color="primary" />
                                </template>
                            </q-input>
                            <q-input :inputStyle="{ fontWeight: 'bold', color: '#6310E1' }" mask="(##) #####-####"
                                placeholder="(12) 34567-8910" type="tel" maxlength="200" filled
                                v-model="contato.form.phone" label="3.Telefone/WhatsApp">
                                <template v-slot:append>
                                    <q-icon name="phone" color="primary" />
                                </template>
                            </q-input>
                            <q-input :inputStyle="{ fontWeight: 'bold', color: '#6310E1' }"
                                placeholder="Shows, baile funk, festival de rock..." maxlength="200" filled
                                v-model="contato.form.eventType" label="4.Tipos de Eventos">
                                <template v-slot:append>
                                    <q-icon name="nightlife" color="primary" />
                                </template>
                            </q-input>
                            <q-input :inputStyle="{ fontWeight: 'bold', color: '#6310E1' }" suffix="pessoas" mask="#####"
                                filled v-model="contato.form.maxCapacity" label="5.Capacidade máxima de público">
                                <template v-slot:append>
                                    <q-icon name="groups" color="primary" />
                                </template>
                            </q-input>
                            <q-input :inputStyle="{ fontWeight: 'bold', color: '#6310E1' }" suffix="pessoas" mask="#####"
                                filled v-model="contato.form.mediumEventCapacity" label="6.Média de público por evento">
                                <template v-slot:append>
                                    <q-icon name="people" color="primary" />
                                </template>
                            </q-input>
                            <q-input :inputStyle="{ fontWeight: 'bold', color: '#6310E1' }" maxlength="5" mask="#####"
                                filled v-model="contato.form.mediumVendaIngressos"
                                placeholder="Média de Ingressos vendidos online"
                                label="7.Quantidade de Ingressos Digitais ">
                                <template v-slot:append>
                                    <q-icon name="confirmation_number" color="primary" />
                                </template>
                            </q-input>
                            <q-input :inputStyle="{ fontWeight: 'bold', color: '#6310E1' }" maxlength="3" suffix="%"
                                reverse-fill-mask mask="###" filled v-model="contato.form.percentAvista"
                                label="8.Percentual de Vendas à Vista">
                                <template v-slot:append>
                                    <q-icon name="payments" color="primary" />
                                </template>
                            </q-input>
                            <q-input :inputStyle="{ fontWeight: 'bold', color: '#6310E1' }" maxlength="9" prefix="R$"
                                reverse-fill-mask mask="##.###,##" filled v-model="contato.form.mediumProfits"
                                placeholder="Média de faturamento por evento"
                                label="9.Lucro por evento em Ingressos Digitais">
                                <template v-slot:append>
                                    <q-icon name="paid" color="primary" />
                                </template>
                            </q-input>
                            <q-input :inputStyle="{ fontWeight: 'bold', color: '#6310E1' }" maxlength="200" filled
                                v-model="contato.form.localizacao" label="10.Localização">
                                <template v-slot:append>
                                    <q-icon name="location_on" color="primary" />
                                </template>
                            </q-input>
                            <q-btn v-if="!sendLoading" @click="sendForm()" class="q-pa-md w100" color="primary"
                                icon-right="description" label="Enviar" />
                            <div class="w100 row justify-center">
                                <q-spinner-bars v-if="sendLoading" class="q-mt-md" color="primary" size="2em" />
                            </div>
                        </q-card>
                    </div>
                     <div class="space rounded-borders q-my-md ">
                        <q-btn @click="wppConsultor()" class="q-pa-md w100" color="green" icon-right="sms"
                            label="Fale Agora Com um de nossos Consultores" glossy />
                    </div> -->
                    <!-- <div v-if="userInfo == ''"
                        class="w100 text-bold rounded-borders column bg-primary items-center justify-center text-white q-pa-md text-center q-mt-md ">
                        <div class="column text-h5 text-white text-bold">Validar Ingressos</div>
                        <div class="text-purple-2">Recebeu credenciais de um produtor para validar ingressos ??</div>
                        <q-btn icon-right="sensor_occupied" label="Faça login Aqui" style="border-radius:12px"
                            glossy dense class="q-mt-md q-pa-lg shadow-2" color="primary" to="/login-subhost" />
                    </div>
                </div> -->
                <div class="w100 text-secondary text-bold q-mb-xl text-center q-mt-md q-pt-xl">
                    Siga-nos no <a href="https://www.instagram.com/midnightickets" class="text-primary"
                        target="_blank">Instagram</a>
                    e
                    acompanhe o nosso desenvolvimento!
                </div>
            </q-page>
        </q-page-container>
        <q-page-container v-else class="q-mb-xl q-mt-md">
            <div v-if="lastEvent" class="w100 row q-gutter-md justify-center rounded-borders animate__animated animate__fadeInDown animate__slower">
                <q-btn :to="'/' + hostLastEvent" color="secondary" glossy :label="hostLastEvent" icon="favorite" />
                <q-btn :to="'/events/' + urlLastEvent" color="secondary" glossy :label="nameLastEvent" icon-right="event" />
            </div>
            <div id="search-public" class="w100 rounded-borders row justify-center">
                <q-card id="search-card" class="q-mt-md q-mb-md q-mx-md animate__animated rounded-borders animate__fadeInDown animate__slower">
                    <q-card-section class="bg-grad-4 text-white text-bold text-center q-pa-md ">
                        <div class="text-center" style="font-size:1rem">Encontre Produtores e Eventos em Andamento</div>
                    </q-card-section>
                    <q-card-section class="rounded-borders q-pa-md column q-gutter-y-md">
                        <q-input maxlength="100" v-model="searchPublic.titleEventOrHostName" outlined label="Nome do Evento ou Produtor(a)*"
                            placeholder="Digite o nome do Evento ou Produtor">
                            <template v-slot:prepend>
                                <q-icon name="search" color="primary" />
                            </template>
                        </q-input>
                            <q-btn :disabled="disabledSearch()" @click="searchPublicEventsOrHost(false)" color="blue-14" glossy class="shadow-1 q-py-md" label="Buscar por Evento"
                            icon="event" />
                            <q-btn :disabled="disabledSearch()" @click="searchPublicEventsOrHost(true)" color="primary" glossy class="shadow-1 q-py-md" label="Buscar por Produtor"
                                icon="person_search" />
                    </q-card-section>
                </q-card>
            </div>
            <div class="q-py-lg"></div>
        </q-page-container>
        <footer class="w100 row wrap justify-center items-center q-py-xl bg-primary q-px-xl">
            <q-dialog v-model="suporteType">
                <q-card class="rounded-borders q-pa-md">
                    <q-card-section class="text-primary text-bold text-center">
                        <q-icon name="support_agent" size="lg" />
                        <div class="text-center">Selecione o Tipo de Usuário</div>
                    </q-card-section>
                    <q-card-section class="column q-gutter-y-md">
                        <q-btn @click="openSuporte('host')" label="Suporte ao Produtor" color="primary" glossy class="shadow-1"></q-btn>
                        <q-btn @click="openSuporte('user')" label="Suporte ao Usuário" color="primary" glossy class="shadow-1"></q-btn>
                    </q-card-section>
                </q-card>
            </q-dialog>
            <div class=" column q-py-md">
                <q-btn label="Crie seu evento" to="/login-host" class="text-grey-5" flat></q-btn>
                <q-btn label="Valide ingressos" to="/login-subhost" class="text-grey-5" flat></q-btn>
                <q-btn label="Compre ingressos" to="/login" class="text-grey-5" flat></q-btn>
                <q-btn label="Encontre eventos" @click="findEvents()" class="text-grey-5" flat></q-btn>
            </div>
            <div class="w100 q-pt-xs bg-secondary rounded-borders"></div>
            <div class="column q-py-md items-center">
                <q-btn label="Suporte" @click="suporteType = true" class="text-grey-5" flat></q-btn>
                <q-btn label="termos de uso" to="/termos-de-uso"  class="text-grey-5" flat></q-btn>
                <q-btn label="Mercado Pago" @click="goTo('https://www.mercadopago.com.br/developers/pt/docs/checkout-pro/landing')" class="text-grey-5" flat></q-btn>
                <q-btn label="instagram" @click="goTo('https://www.instagram.com/midnightickets')" class="text-grey-5" flat></q-btn>
                <q-btn label="email" @click="alertar('midnightickets@gmail.com')" class="text-grey-5" flat></q-btn>
                <q-btn label="desenvolvedor" @click="goTo('https://samuelvictorol.github.io/portfolio')" class="text-grey-5" flat></q-btn>
            </div>
            <div class="w100 row q-pt-xl items-center justify-start text-secondary" id="title-layout">
                Midnight Tickets 
            </div>
        </footer>
    </q-layout>
</template>
<script setup>
import { useQuasar } from "quasar";
import { onBeforeMount, onMounted, ref } from "vue";
import { api } from 'src/boot/axios';
import { useRouter } from "vue-router";
import { Utils } from 'src/utils/Utils';
const userInfo = ref('')
const suporteType = ref(false)
const searchPublic = ref({
    opened: true,
    isByHostName: false,
    titleEventOrHostName: ''
})
const lastEvent = ref(sessionStorage.getItem('comeFromTicketIntention') ? true : false)
const urlLastEvent = ref(sessionStorage.getItem('comeFromTicketIntention') || null) 
const nameLastEvent = ref(sessionStorage.getItem('comeFromTicketIntentionName') || null)
const hostLastEvent = ref(sessionStorage.getItem('comeFromTicketIntentionHost') || null)
function goTo(url) {
    window.open(url, '_blank');
}

function openSuporte(type) {
    if (type === 'host') {
        window.open('/Manual-do-Produtor.pdf', '_blank');
    } else {
        window.open('Manual-do-Usuario.pdf', '_blank');
    }
}

function alertar(msg) {
    alert(msg)
}

function findEvents() {
    searchPublic.value.opened = true
    window.scrollTo(0, 0);
}

const loading = ref(false)

onMounted(() => {
    if(sessionStorage.getItem('user')) {
        userInfo.value = JSON.parse(sessionStorage.getItem('user'))
        searchPublic.value.opened = true
    } else {
        userInfo.value = ''
    }
})


const router = useRouter()
const $q = useQuasar()
const isMobile = window.innerWidth < 500
const sendLoading = ref(false)
const contato = ref({
    email: '',
    form: {
        name: '',
        phone: '',
        companyName: '',
        maxCapacity: '',
        eventType: '',
        mediumEventCapacity: '',
        mediumProfits: '',
        mediumVendaIngressos: '',
        mercadopago: false,
        percentAvista: '',
        localizacao: '',
    },
    dispositivo: window.innerWidth < 900 ? 'Mobile' : 'Desktop'
})

function wppConsultor() {
    window.open('https://wa.me/5561981748795?text=Ola,%20Gostaria%20de%20realizar%20uma%20consultoria%20para%20Potencializar%20a%20Venda%20dos%20meus%20Ingressos%20e%20Escalar%20o%20Lucro%20dos%20Meus%20Eventos%20com%20a%20Midnight%20Tickets!', '_blank');
}

function disabledSearch() {
    if(searchPublic.value.titleEventOrHostName.trim() === '') {
        return true
    } else {
        return false
    }
}

const hostsResults = ref([])
const eventsResults = ref([])
const dialogResults = ref(false)
async function searchPublicEventsOrHost() {
    loading.value = true
    searchPublic.value.titleEventOrHostName = searchPublic.value.titleEventOrHostName.trim()
    await api.post('/host/public_events', searchPublic.value).then((response) => {
        if (response.data.length === 0) {
            $q.notify({
                message: 'Nenhum resultado encontrado para sua busca :(',
                color: 'secondary',
                position: 'top',
                icon: 'event',
            });
        } else {
            dialogResults.value = true
            if (searchPublic.value.isByHostName) {
                hostsResults.value = response.data
                eventsResults.value = []
            } else {
                eventsResults.value = response.data.events
                hostsResults.value = []
            }
        }
    }).catch((error) => {
        $q.notify({
            message: error.response.data.error,
            color: 'secondary',
            position: 'top',
            icon: 'info',
        });
    }).
    finally(() => {
        loading.value = false
    })
}

function goToPublicHostPage(login) {
    router.push(`/${login}`)
}

function goToPublicEventPage(event_id){
    router.push(`/events/${event_id}`)
}

const lowDownScrolling = () => {
    window.scrollTo(0, 500);
}

function scrollTop() {
    window.scrollTo(0, 0);
}

function navigateTo(to) {
    router.push(to)
}

async function fastEmailGetter() {
    if (!checkEmail()) {
        return false
    } else {
        lowDownScrolling()
        await sendForm('Continue navegando pelo site para mais informações ou preencha o formulário em contato para uma consultoria personalizada')
    }
}

const checkEmail = () => {
    if (!contato.value.email || contato.value.email === '' || !contato.value.email.includes('@')) {
        $q.notify({
            message: 'Campo de Email inválido',
            color: 'orange-14',
            position: 'top',
            icon: 'email',
        });
        return false
    }
    return true
}

async function sendForm(msg) {
    if (!checkEmail()) {
        return
    }
    sendLoading.value = true
    await api.post('/landing', contato.value).then((response) => {
        $q.notify({
            message: response.data,
            color: 'green',
            position: 'top',
            icon: 'email',
            timeout: 1000
        });
        $q.notify({
            message: 'Redirecionando para a página de login e cadastro de produtores',
            color: 'primary',
            position: 'bottom',
            icon: 'local_activity',
            timeout: 6000
        });
        router.push('/login-host')
    }).catch((err) => {
        $q.notify({
            message: err.response.data.error ,
            color: 'dark',
            position: 'top',
            icon: 'email',
        });
    })
        .finally(() => {
            setTimeout(() => {
                sendLoading.value = false
            }, 1000)
        })
}


function scrollBot() {
    window.scrollTo(0, document.body.scrollHeight);
}

function scrollToBottom() {
    window.scrollTo(0, document.body.scrollHeight - 1920);
}
function scrollToVantagem() {
    window.scrollTo(0, document.body.scrollHeight - 3740);
}


</script>

<style scoped>


* {
    overflow-x: hidden;
}

.q-header {
    position: fixed;
}

.q-page-container {
    z-index: 1;
    padding: 0 6px;
    overflow: hidden
}

.border-bottom {
    border-bottom: 4px solid #692EDD;
}

.img-wrapper {
    z-index: 99 !important;
    display: flex;
    justify-content: center;
    align-items: center;
    padding-top: 20px;
}

.img,
img {
    width: 100%;
    max-width: 800px;
    height: auto;
}

.q-btn {
    transition: all 0.2s linear;
}



a {
    color: white;
    text-decoration: none;
    border-radius: 2px;
    transition: all 0.2s linear;
    font-weight: bold;
    cursor: pointer;
}

.menu-item {
    font-size: 1.1rem;
    color: white;
}

.q-btn:hover {
    opacity: 0.8;
}

.menu-item:hover {
    color: #6310E1!important;
    background: #ebd3ffde;
    filter: brightness(1.2);
    border-top-left-radius: 12px;
    border-bottom-right-radius: 12px;
}

.q-carousel {
    height: 400px;
}

.w40 {
    width: 40%;
}

@media(min-width: 1300px) {
    .q-page {
        padding: 0 15vw;
        margin: 0 30px;
    }

    .q-page-container {
        padding: 0 100px;
    }

    #email-card {
        width: 60% !important;
    }

    .q-carousel {
        height: 90vh;
    }

    .img {
        max-width: 620px;
    }
}

@media (min-width: 800px) {
    #search-card, #ver-ingressos {
        width: 50%;
    }
}
.card-search{
    background: #f8effc;
}
.card-search:nth-child(odd) {
    background: #efeffc;
}
.high-opacity {
    opacity: 0.8;
}
</style>