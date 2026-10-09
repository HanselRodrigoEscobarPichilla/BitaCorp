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

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  { path: 'login', component: Login },
  { path: 'register', component: Register },
  
  { path: 'whistleblowers', component: Whistleblowers },
  { path: 'whistleblowers/crear', component: WhistleblowerBinnacles },
  { path: 'whistleblowers/editar/:id', component: WhistleblowerBinnaclesUpdate },
  { path: 'whistleblowers/ver/:id', component: WhistleblowerBinnaclesCheck },
  { path: 'whistleblowers/perfil', component: WhistleblowerProfile },

  { path: 'managers', component: Managers },
  { path: 'managers/ver-inicio/:id', component: ManagerBinnaclesCheck },
  { path: 'managers/ver-historial/:id', component: ManagerBinnaclesCheck },
  { path: 'managers/perfil', component: ManagerProfile },
  { path: 'managers/denunciante-perfil', component: ManagerWhistleblowerProfile },

  { path: 'administrators', component: Administrators },
  { path: 'administrators/perfil', component: AdministratorProfile }
];