import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { CaseHubRoutingModule } from './case-hub-routing.module';
import { CaseHubListComponent } from './case-hub-list.component';
import { CaseHubComponent } from './case-hub.component';

@NgModule({
  declarations: [CaseHubListComponent, CaseHubComponent],
  imports: [SharedModule, CaseHubRoutingModule]
})
export class CaseHubModule {}
