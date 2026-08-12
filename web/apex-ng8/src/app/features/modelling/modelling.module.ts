import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { ModellingRoutingModule } from './modelling-routing.module';
import { ModellingComponent } from './modelling.component';

@NgModule({
  declarations: [ModellingComponent],
  imports: [SharedModule, ModellingRoutingModule]
})
export class ModellingModule {}
