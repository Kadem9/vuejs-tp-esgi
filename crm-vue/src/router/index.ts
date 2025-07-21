import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/LoginView.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/DashboardView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/customers',
    name: 'Customers',
    component: () => import('@/views/CustomersView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/customers/new',
    name: 'NewCustomer',
    component: () => import('@/views/CustomerFormView.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/customers/:id/edit',
    name: 'EditCustomer',
    component: () => import('@/views/CustomerFormView.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/customers/:id',
    name: 'CustomerDetail',
    component: () => import('@/views/CustomerDetailView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/interactions',
    name: 'Interactions',
    component: () => import('@/views/InteractionsView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/admin',
    name: 'Admin',
    component: () => import('@/views/AdminView.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFoundView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach(async (to, from, next) => {
  const { useAuth } = await import('@/composables/useAuth')
  const { checkAuth, isAuthenticated, user } = useAuth()
  
  await checkAuth()
  
  if (to.meta.requiresAuth && !isAuthenticated.value) {
    next('/login')
  } else if (to.meta.requiresAdmin && user.value?.role !== 'admin') {
    next('/dashboard')
  } else if (to.path === '/login' && isAuthenticated.value) {
    next('/dashboard')
  } else {
    next()
  }
})

export default router 