import {signIn, signUp} from '../../shared/utils/paths';


export const AUTH_ROUTES = [
  {
    path: signIn,
    loadComponent: () => import('./pages/login/login.component').then(p => p.LoginPage),
  },
  {
    path: signUp,
    loadComponent: () => import('./pages/sign-up/sign-up').then(p => p.SignUp),
  }
];
