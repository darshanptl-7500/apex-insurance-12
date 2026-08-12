import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { ReportingRoutingModule } from './reporting-routing.module';
import { ReportingComponent } from './reporting.component';

@NgModule({
  declarations: [ReportingComponent],
  imports: [SharedModule, ReportingRoutingModule]
})
export class ReportingModule {}
