

export const AUTH_ROUTES = [
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login').then(p => p.LoginPage),
  },
  {
    path: 'sign-up',
    loadComponent: () => import('./pages/sign-up/sign-up').then(p => p.SignUp),
  }
];
