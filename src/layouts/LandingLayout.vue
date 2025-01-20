<template>
    <q-layout class="relative animate__animated animate__fadeIn">
        <q-header class="fixed bg-glass-2 text-white animate__animated animate__fadeInDown animate__slow shadow-1"
            height-hint="98">
            <div style="font-size: 1rem;" class=" q-py-md w100 row no-wrap items-center  justify-evenly">
                <a v-if="!isMobile" @click="scrollBot()" class="menu-item row items-center" id="title-menu">
                    <q-icon class="q-pr-xs" name="local_activity" size="xl" /> Midnight Tickets
                </a>
                <a v-else @click="scrollBot()" class="menu-item row items-center">
                    <q-icon name="local_activity" size="65px" />
                </a>
                <div class="row items-center no-wrap q-gutter-x-sm">
                    <a v-if="!isMobile & userInfo == ''" class="menu-item q-mr-md q-px-md" href="#vantagens">
                        Vantagens
                    </a>
                    <a v-if="isMobile  & userInfo == ''" class="menu-item" @click="scrollToVantagem()">
                        <q-btn icon="redeem" color="secondary"></q-btn>
                    </a>
                    <a v-if="!isMobile & userInfo == ''" class="menu-item q-mr-md q-px-md" href="#contato">
                        Contato
                    </a>
                    <a v-if="isMobile & userInfo == ''" class="menu-item" @click="scrollToBottom()">
                        <q-btn icon="phone_callback" color="secondary"></q-btn>
                    </a>
                    <q-btn v-if="userInfo == ''" glossy dense flat class="menu-item text-bold bg-primary q-pa-md text-purple-1 row items-center"
                        style="border-radius:12px" @click="navigateTo('/login')">
                        Entrar
                        <q-icon name="login" size="md" />
                    </q-btn>
                    <q-btn v-if="userInfo != ''" dense class="menu-item text-purple-1 text-bold q-pa-md row items-center" label="sair" flat
                        style="border-radius:8px" @click="Utils.logout()">
                    </q-btn>
                    <q-btn v-if="userInfo != ''" glossy dense class="menu-item text-bold bg-secondary q-pa-md text-purple-1 row items-center"
                        style="border-radius:8px" @click="navigateTo('/me')">
                        <q-icon name="person" size="md" />
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
                                <q-item-section>
                                        <img v-if="host.img_url && host.img_url.trim() !== ''" :src="host.img_url" class="rounded-borders shadow-1 q-mb-md q-mt-sm" alt="banner do Evento">
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
                            <q-item class="card-search q-py-md shadow-1 rounded-borders" v-for="event in eventsResults" :key="event.id" clickable>
                                <q-item-section>
                                    <img v-if="event.img_url && event.img_url.trim() !== ''"  :src="event.img_url" class="rounded-borders shadow-1 q-mb-md" alt="banner do Evento">
                                    <q-item-label class="text-bold text-primary" id="title-layout">
                                        {{ event.title.toUpperCase() }}
                                    </q-item-label>
                                    <div class="text-secondary row items-center q-mt-sm">
                                        <q-icon name="event" class="q-pr-xs" />
                                        {{ event.date.replaceAll('-', '/') }}
                                    </div>
                                    <q-item-label class="text-secondary">
                                        <q-icon name="person" class="q-pr-xs"/>
                                        {{ event.host.toLowerCase() }}
                                    </q-item-label>
                                    <q-item-section class="w100 q-mt-md">
                                        <q-btn  @click="goToPublicEventPage(event.id)" label="ver evento"  icon="travel_explore" color="primary" glossy class="w100 shadow-2"></q-btn>
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
        <q-page-container v-if="userInfo === ''" class="bg-grey-4">
            <div  class="rounded-borders w100 row justify-center q-mt-md relative" style="overflow: hidden ">
                <div v-if="userInfo == ''" class="animate__animated animate__zoomInDown animate__delay-1s animate__slower row no-wrap rounded-borders justify-center q-px-sm  w100"
                    style="overflow: hidden ;z-index: 9;">
                    <q-btn to="/login-host" color="blue-14"
                        class="shadow-6 animate__animated text-primary animate__fadeInLeft  animate__delay-3s animate__slower q-pa-xl rounded-borders"
                        icon-right="event" label="Quero criar eventos" />
                    <q-btn @click="searchPublic.opened = !searchPublic.opened"
                        class="shadow-6 animate__animated animate__fadeInRight  text-bold q-ml-sm text-white animate__delay-3s animate__slower q-pa-xl rounded-borders"
                        icon-right="confirmation_number"  color="blue-14" label="Quero comprar Ingressos" />
                </div>
            </div>
            <div v-if="searchPublic.opened" id="search-public" class="w100 rounded-borders row justify-center">
                <q-card id="search-card" class="q-mt-md q-mb-md q-mx-md animate__animated rounded-borders animate__fadeInDown animate__slower">
                    <q-card-section class="bg-grad-4 text-white text-bold text-center q-pa-md ">
                        <q-icon name="nightlife" size="lg" color="white" />
                        <div class="text-center">Encontre Produtores e Eventos em Andamento</div>
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
            <q-page class="">
                <div id="home" style="border: 8px solid #692EDD;border-radius: 8px;"
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
                    <div class="w100 img-wrapper">
                        <img class="img"
                            src="https://images.blush.design/PJcHFUF4pMy6BXPLEFnD?w=500&auto=compress&cs=srgb" alt="">
                    </div>
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
                        fazemos isso ?
                    </div>
                    <div id="vantagens" style="font-size:1.1rem;"
                        class="text-shadow bg-grad-2 text-white high-opacity  text-bold q-px-sm  q-py-md text-center">
                        Utilizamos tecnologias de ponta com criptografia de dados para garantir a redução do tráfego de dados e a segurança de suas informações
                        na nuvem, diminuindo custos de operação e aumentando a eficiência de seus eventos
                    </div>
                </div>
                <div class="rounded-borders" style="border: 4px solid #692EDD;">
                    <!-- <div style="letter-spacing:1px"
                        class="text-shadow text-h6 w100 text-bold text-blue-4 text-center q-px-md q-py-sm border-bottom">
                        Veja como
                        nossa Plataforma pode aumentar o Faturamento do seu Evento!!</div> -->
                    <div id="title"
                        class="text-h4 bg-white text-primary text-center w100 border-bottom text-bold q-pt-md q-pb-md">
                        Vantagens</div>
                    <div style="font-size:1.1rem"
                        class="text-shadow q-px-md bg-grey-4 text-left q-py-md rounded-borders">
                        🟣 <strong class="text-primary">REDUZA TAXA POR INGRESSO<br></strong> Nosso <strong>modelo de negócio</strong>
                        permite realizar <strong>Eventos</strong> com <strong>5% de taxa</strong> em ingressos
                        vendidos. Obtenha
                        o <strong>máximo do seu
                            lucro</strong>
                        <br>🟣 <strong class="text-primary">LUCRO EM TEMPO REAL<br></strong> Disponibilizamos a
                        visualização do andamento do 
                        <strong>lucro de suas vendas atualizadas automaticamente em tempo real na sua conta</strong> enquanto
                        acontece o seu evento<br>
                        🟣 <strong class="text-primary">AJUSTES DE LOTES GRATUITOS<br></strong>
                        Realize <strong>reajustes</strong> de ingressos dos seus ingressos <strong>sem custo
                        adicional</strong> de forma intuitiva na palma da sua mão
                        <br>
                        🟣 <strong class="text-primary">VALIDAÇÃO DE INGRESSOS<br></strong>
                        Disponibilizamos um perfil de <strong>subhost</strong>, que são perfis cadastrados pelos produtores de eventos para <strong>validar ingressos</strong>
                        de forma segura e rápida com <strong>QR Code</strong> na entrada de seus eventos. Utilizando apenas uma câmera e acesso à navegador
                    </div>
                    <div id="title"
                        class="w100 text-h4 text-bold bg-white text-primary text-center q-px-md rounded-borders q-py-sm border-bottom"
                        style="border:4px solid #692EDD">
                        Benefícios</div>
                    <div style="font-size:1.1rem"
                        class="text-shadow q-px-md bg-grey-4 q-py-md rounded-borders border-bottom">
                        💸 <strong style="font-size:1.2rem" class="text-primary text-bold">LIBERTE-SE das
                        TAXAS EXCESSIVAS<br></strong>
                        Estamos
                        integrados ao <strong>Mercado Pago</strong> com segurança
                        e confidencialidade realizando pagamentos em ambientes com fontes confiáveis
                        <br>
                        <br>    
                        🤳🏼 <strong style="font-size:1.2rem" class="text-primary text-bold">SEM INSTALAÇÃO
                            <br></strong> Gerencie seus
                        eventos, vendas e ingressos na palma da sua mão <strong>sem
                            necessidade de
                            instalação</strong> de aplicativos. Nosso webapp é adaptativo para todos os dispositivos inclusive o navegador do próprio instagram
                        <br>
                        <br>
                        🧑🏼‍💻 <strong style="font-size:1.2rem" class="text-primary text-bold">SUPORTE HUMANIZADO<br>
                        </strong> Nosso
                        serviço é monitorado constantemente, focado em <strong>otimizar o tráfego de dados. </strong>
                        O Suporte é <strong>humanizado</strong> e <strong>ágil</strong> para atender suas necessidades o
                        quanto antes
                        <br>
                        <br>
                        🖥️ <strong style="font-size:1.2rem" class="text-primary text-bold">CONSULTORIA
                            INDIVIDUAL<br></strong> Nossos
                        <strong>desenvolvedores</strong> possuem experiências
                        profisionais em
                        diversos <strong>projetos
                            nacionais e internacionais</strong> em Bancos e Software Houses, e estarão a
                        disposição para
                        suporte, <strong>sugestões de melhorias e correções
                            de bugs</strong>
                        <br>
                        <br>
                        📲 <strong style="font-size:1.2rem" class="text-primary text-bold">TECNOLOGIA DE
                            PONTA<br></strong>
                        Nosso App Web é desenvolvido com as <strong id="contato">melhores tecnologias</strong> do
                        mercado
                        e hospedada
                        na nuvem, <strong>garantindo segurança e escalabilidade</strong>. Nosso foco é a
                        <strong>Usabilidade</strong> de
                        todos os tipos de usuários: <strong>produtores, organizadores de eventos e compradores de
                            ingressos
                            digitais</strong>
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
                <div class=" relative">
                    <div class="text-h4 text-bold q-py-md text-white text-center bg-grad-4 border-bottom q-mt-md">
                        Fale Conosco</div>

                    <div class="space rounded-borders q-my-md  "
                        style="border-radius: 20px;border-bottom: 8px solid #3C0783;z-index: -10">
                        <q-card class="q-pa-md collumn q-gutter-y-md rounded-borders "
                            style="border: 15px solid #6310E1; border-bottom-left-radius: 0px; border-bottom-right-radius: 0px;">
                            <div class="text-shadow w100 text-center text-primary text-bold mid-opacity ">
                                ALAVANQUE seus FATURAMENTO otimizando o LUCRO de suas VENDAS com uma CONSULTORIA
                                PERSONALIZADA para a
                                SUA DEMANDA</div>
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
                    <!-- <div class="space rounded-borders q-my-md ">
                        <q-btn @click="wppConsultor()" class="q-pa-md w100" color="green" icon-right="sms"
                            label="Fale Agora Com um de nossos Consultores" glossy />
                    </div> -->
                    <div v-if="userInfo == ''"
                        class="w100 text-bold rounded-borders column bg-primary items-center justify-center text-white q-pa-md text-center q-mt-md ">
                        <div class="column text-h5 text-white text-bold">Validar Ingressos</div>
                        <div class="text-purple-2">Recebeu credenciais de um produtor para validar ingressos ??</div>
                        <q-btn icon-right="sensor_occupied" label="Faça login Aqui" style="border-radius:12px"
                            glossy dense class="q-mt-md q-pa-lg shadow-2" color="primary" to="/login-subhost" />
                    </div>
                </div>
                <div class="w100 text-secondary text-bold q-mb-xl text-center q-mt-md q-pt-xl">
                    Siga-nos no <a href="https://www.instagram.com/midnightickets" class="text-primary"
                        target="_blank">Instagram</a>
                    e
                    acompanhe o nosso desenvolvimento!
                </div>
            </q-page>
        </q-page-container>
        <q-page-container style="min-height: 90vh" v-else>
            <div class="q-mt-xl q-px-md w100 row justify-center animate__animated rounded-borders animate__fadeInDown animate__slower" v-if="hostInfo != ''">
                <q-btn to="/me" id="ver-ingressos" icon="local_activity" glossy color="primary" class="shadow-2 q-py-lg w100" label="ver meus ingressos"></q-btn>
            </div>
            <div id="search-public" class="w100 rounded-borders row justify-center">
                <q-card id="search-card" class="q-mt-md q-mb-md q-mx-md animate__animated rounded-borders animate__fadeInDown animate__slower">
                    <q-card-section class="bg-grad-4 text-white text-bold text-center q-pa-md ">
                        <q-icon name="nightlife" size="lg" color="white" />
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
        </q-page-container>
        <footer class="w100 row wrap justify-center items-center q-py-xl bg-primary q-px-xl">
            <div class=" column q-py-md">
                <q-btn label="Crie seu evento" to="/login-host" class="text-grey-5" flat></q-btn>
                <q-btn label="Valide ingressos" to="/login-subhost" class="text-grey-5" flat></q-btn>
                <q-btn label="Compre ingressos" to="/login" class="text-grey-5" flat></q-btn>
                <q-btn label="Encontre eventos" @click="findEvents()" class="text-grey-5" flat></q-btn>
            </div>
            <div class="w100 q-pt-xs bg-secondary rounded-borders"></div>
            <div class="column q-py-md items-center">
                <q-btn label="Suporte" to="/suporte" class="text-grey-5" flat></q-btn>
                <q-btn label="termos de uso" to="/termos-de-uso"  class="text-grey-5" flat></q-btn>
                <q-btn label="Mercado Pago" @click="goTo('https://www.mercadopago.com.br/developers/pt/docs/checkout-pro/landing')" class="text-grey-5" flat></q-btn>
                <q-btn label="instagram" @click="goTo('https://www.instagram.com/midnightickets')" class="text-grey-5" flat></q-btn>
                <q-btn label="email" @click="alertar('midnightickets@gmail.com')" class="text-grey-5" flat></q-btn>
                <q-btn label="desenvolvedor" @click="goTo('https://samuelvictorol.github.io/portfolio')" class="text-grey-5" flat></q-btn>
            </div>
            <div class="w100 row q-pt-xl items-center justify-start text-secondary" id="title-layout">
                Midnight Tickets Software
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
const searchPublic = ref({
    opened: false,
    isByHostName: false,
    titleEventOrHostName: ''
})

function goTo(url) {
    window.open(url, '_blank');
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
async function searchPublicEventsOrHost(isByHostName) {
    loading.value = true
    searchPublic.value.isByHostName = isByHostName
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
            if (isByHostName) {
                hostsResults.value = response.data
                eventsResults.value = []
            } else {
                eventsResults.value = response.data.events
                hostsResults.value = []
            }
        }
    }).catch(() => {
        $q.notify({
            message: 'Erro ao buscar eventos',
            color: 'orange-14',
            position: 'top',
            icon: 'event',
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
}

.q-btn:hover {
    opacity: 0.8;
}

.menu-item:hover {
    color: #6310E1;
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