import {Segment} from '../../shared/utils/paths';


export const AUTH_ROUTES = [
  {
    path: Segment.signIn,
    loadComponent: () => import('./pages/sign-in/sign-in.component').then(p => p.LoginPage),
  },
  {
    path: Segment.signUp,
    loadComponent: () => import('./pages/sign-up/sign-up').then(p => p.SignUp),
  }
];
