import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CaseHubListComponent } from './case-hub-list.component';
import { CaseHubComponent } from './case-hub.component';

const routes: Routes = [
  { path: '', component: CaseHubListComponent },
  { path: ':id', component: CaseHubComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CaseHubRoutingModule {}
