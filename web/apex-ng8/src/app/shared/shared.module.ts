import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { StatusBadgeComponent } from './status-badge.component';
import { EmptyStateComponent } from './empty-state.component';
import { LoadingComponent } from './loading.component';

@NgModule({
  declarations: [
    StatusBadgeComponent,
    EmptyStateComponent,
    LoadingComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],
  exports: [
    CommonModule,
    FormsModule,
    RouterModule,
    StatusBadgeComponent,
    EmptyStateComponent,
    LoadingComponent
  ]
})
export class SharedModule {}
