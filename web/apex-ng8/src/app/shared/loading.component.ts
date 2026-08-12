import { Component, Input } from '@angular/core';

@Component({
  selector: 'apex-loading',
  template: `
    <div class="apex-loading">
      <span class="apex-spinner"></span> {{ label }}
    </div>
  `
})
export class LoadingComponent {
  @Input() label = 'Loading…';
}
