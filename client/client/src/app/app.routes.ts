import { provideRouter, RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './feature/home/home.component';
import { LoginComponent } from './feature/authorization/login/login.component';
import { RegisterComponent } from './feature/authorization/register/register.component';
import { FullSummaryComponent } from './feature/full-summary/full-summary.component';
import { AuthGuard } from './auth.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'inspection',
    component: FullSummaryComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  { path: '**', redirectTo: 'login' }
];
