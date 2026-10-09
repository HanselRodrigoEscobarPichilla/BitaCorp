import { Routes } from '@angular/router';

import { Login } from './views/auth/login/login';
import { Register } from './views/auth/register/register';

import { Whistleblowers } from './views/whistleblower/whistleblowers/whistleblowers';
import { WhistleblowerBinnacles } from './views/whistleblower/whistleblower-binnacles/whistleblower-binnacles';
import { WhistleblowerBinnaclesUpdate } from './views/whistleblower/whistleblower-binnacles-update/whistleblower-binnacles-update';
import { WhistleblowerBinnaclesCheck } from './views/whistleblower/whistleblower-binnacles-check/whistleblower-binnacles-check';
import { WhistleblowerProfile } from './views/whistleblower/whistleblower-profile/whistleblower-profile';

import { Managers } from './views/manager/managers/managers';
import { ManagerBinnaclesCheck } from './views/manager/manager-binnacles-check/manager-binnacles-check';
import { ManagerProfile } from './views/manager/manager-profile/manager-profile';
import { ManagerWhistleblowerProfile } from './views/manager/manager-whistleblower-profile/manager-whistleblower-profile';

import { Administrators } from './views/administrator/administrators/administrators';
import { AdministratorProfile } from './views/administrator/administrator-profile/administrator-profile';

import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  { path: 'login', component: Login },
  { path: 'register', component: Register },

  {
    path: 'whistleblowers',
    component: Whistleblowers,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['DENUNCIANTE'] }
  },
  {
    path: 'whistleblowers/crear',
    component: WhistleblowerBinnacles,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['DENUNCIANTE'] }
  },
  {
    path: 'whistleblowers/editar/:id',
    component: WhistleblowerBinnaclesUpdate,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['DENUNCIANTE'] }
  },
  {
    path: 'whistleblowers/ver/:id',
    component: WhistleblowerBinnaclesCheck,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['DENUNCIANTE'] }
  },
  {
    path: 'whistleblowers/perfil',
    component: WhistleblowerProfile,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['DENUNCIANTE'] }
  },

  {
    path: 'managers',
    component: Managers,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ENCARGADO'] }
  },
  {
    path: 'managers/ver-inicio/:id',
    component: ManagerBinnaclesCheck,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ENCARGADO'] }
  },
  {
    path: 'managers/ver-historial/:id',
    component: ManagerBinnaclesCheck,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ENCARGADO'] }
  },
  {
    path: 'managers/perfil',
    component: ManagerProfile,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ENCARGADO'] }
  },
  {
    path: 'managers/denunciante-perfil',
    component: ManagerWhistleblowerProfile,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ENCARGADO'] }
  },

  {
    path: 'administrators',
    component: Administrators,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADMINISTRADOR'] }
  },
  {
    path: 'administrators/perfil',
    component: AdministratorProfile,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADMINISTRADOR'] }
  }
];