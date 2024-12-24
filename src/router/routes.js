
const routes = [
  {
    path: '/',
    component: () => import('src/layouts/LandingLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') }
    ]
  },
  {
    path: '/:events_host',
    component: () => import('src/layouts/UserLayout.vue'),
    children: [
      { path: '', component: () => import('pages/user/EventsByHostPublic.vue') }
    ]
  },
  {
    path: '/events/:event',
    component: () => import('src/layouts/UserLayout.vue'),
    children: [
      { path: '', component: () => import('pages/user/EventPublic.vue') }
    ]
  },
  {
    path: '/login-host',
    component: () => import('layouts/login/LoginHostLayout.vue'),
  },
  {
    path: '/login-subhost',
    component: () => import('layouts/login/LoginSubHostLayout.vue'),
  },
  {
    path: '/login',
    component: () => import('layouts/login/LoginUserLayout.vue'),
  },
  {
    path: '/admin-auth',
    component: () => import('layouts/login/LoginAdminLayout.vue'),
  },
  {
    path: '/host',
    component: () => import('src/layouts/HostLayout.vue'),
    children: [
      { path: '', component: () => import('src/pages/host/eventos/EventosPage.vue') },
      { path: 'criar-evento', component: () => import('src/pages/host/eventos/CreateEventoPage.vue') },
      { path: 'evento', component: () => import('src/pages/host/eventos/EventoPage.vue') },
      { path: 'acessos', component: () => import('src/pages/host/AcessosPage.vue') },
      { path: 'me', component: () => import('src/pages/host/HostPerfilPage.vue') },
    ]
  },
  {
    path: '/subhost',
    component: () => import('src/layouts/SubhostLayout.vue'),
    children: [
      { path: '', component: () => import('src/pages/subhost/ValidarIngressoPage.vue') },
    ]
  },
  {
    path: '/me',
    component: () => import('src/layouts/UserLayout.vue'),
    children: [
      { path: '', component: () => import('src/pages/user/IngressosPage.vue') },
      { path: 'perfil', component: () => import('src/pages/user/UserPage.vue') },
    ]
  },
  {
    path: '/admidnightickets',
    component: () => import('src/layouts/AdminLayout.vue'),
    children: [
      { path: '', component: () => import('src/pages/admin/LogsRecentesPage.vue') },
      { path: 'buscar-logs', component: () => import('src/pages/admin/AdminPage.vue') },
      { path: 'users', component: () => import('src/pages/admin/UsersPage.vue') },
      { path: 'hosts', component: () => import('src/pages/admin/HostsPage.vue') },
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
