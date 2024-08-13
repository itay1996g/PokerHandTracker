import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/views/Home.vue';
import LoginView from '@/views/Login.vue';
import RegisterView from '@/views/Register.vue';
import DashboardView from '@/views/Dashboard.vue';
import StatisticsView from '@/views/Statistics.vue';
import HandHistoryView from '@/views/HandHistory.vue';
import { useStore } from '../store/index';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { requiresAuth: false },
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    meta: { requiresAuth: false },
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterView,
    meta: { requiresAuth: false },
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: DashboardView,
    meta: { requiresAuth: true },
  },
  {
    path: '/statistics',
    name: 'Statistics',
    component: StatisticsView,
    meta: { requiresAuth: true },
  },
  {
    path: '/handhistory/:sessionId',
    name: 'HandHistory',
    component: HandHistoryView,
    props: true,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const store = useStore();
  const isAuthenticated = store.getters.isAuthenticated;
  
  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: 'Login' });
  } else if (!to.meta.requiresAuth && isAuthenticated && to.name === 'Home') {
    next({ name: 'Dashboard' });
  } else {
    next();
  }
});

export default router;
