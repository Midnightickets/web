
const routes = [
  {
    path: '/',
    component: () => import('src/layouts/LandingLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') }
    ]
  },
  {
    path: '/login-host',
    component: () => import('layouts/login/LoginHostLayout.vue'),
  },
  {
    path: '/host',
    component: () => import('src/layouts/HostLayout.vue'),
    children: [
      { path: '', component: () => import('src/pages/host/eventos/EventosPage.vue') },
      { path: 'criar-evento', component: () => import('src/pages/host/eventos/CreateEventoPage.vue') },
      { path: 'evento', component: () => import('src/pages/host/eventos/EventoPage.vue') },
      { path: 'acessos', component: () => import('src/pages/host/AcessosPage.vue') },
    ]
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
