
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
    path: '/host/app',
    component: () => import('src/layouts/HostLayout.vue'),
    children: [
      { path: '', component: () => import('src/pages/host/EventosPage.vue') },
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
