import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/auth.guard';

/**
 * Angular 8 lazy loading uses the string module#export form.
 * Dynamic import().then() is Angular 9+ and will fail under @angular/cli 8.
 */
const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  {
    path: 'login',
    loadChildren: './features/login/login.module#LoginModule'
  },
  {
    path: 'dashboard',
    canActivate: [AuthGuard],
    loadChildren: './features/dashboard/dashboard.module#DashboardModule'
  },
  {
    path: 'case-hub',
    canActivate: [AuthGuard],
    loadChildren: './features/case-hub/case-hub.module#CaseHubModule'
  },
  {
    path: 'reporting',
    canActivate: [AuthGuard],
    loadChildren: './features/reporting/reporting.module#ReportingModule'
  },
  {
    path: 'modelling',
    canActivate: [AuthGuard],
    loadChildren: './features/modelling/modelling.module#ModellingModule'
  },
  {
    path: 'admin',
    canActivate: [AuthGuard],
    data: { role: 'Admin' },
    loadChildren: './features/admin/admin.module#AdminModule'
  },
  { path: '**', redirectTo: 'dashboard' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
