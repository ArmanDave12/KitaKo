const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '/home',
        name: 'Home',
        component: () => import('pages/HomePage.vue'),
        meta: {
          title: 'KITAKO - Home',
          requiresAuth: true,
        },
      },
      {
        path: '/salary',
        name: 'Salary',
        component: () => import('pages/SalaryPage.vue'),
        meta: {
          title: 'KITAKO - SAHOD_VIEWER',
          requiresAuth: true,
        },
      },
      {
        path: '/budget',
        name: 'Budget',
        component: () => import('pages/BudgetPage.vue'),
        meta: {
          title: 'KITAKO - BUDGET_TRACKER',
          requiresAuth: true,
        },
      },
      // Redirect root path to home
      {
        path: '',
        redirect: '/home',
      },
    ],
  },
  // Auth routes outside MainLayout
  {
    path: '/',
    component: () => import('layouts/AuthLayout.vue'),
    children: [
      {
        path: 'login',
        component: () => import('pages/auth/LoginPage.vue'),
        meta: {
          title: 'KITAKO - Access Portal',
          guest: true,
        },
      },
      {
        path: 'signup',
        component: () => import('pages/auth/SignupPage.vue'),
        meta: {
          title: 'KITAKO - New User Registration',
          guest: true,
        },
      },
    ],
  },
  {
    path: '/splash',
    component: () => import('components/SplashScreen.vue'),
  },
  // Always leave this as last one
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
