import { Component, Input } from '@angular/core';

@Component({
  selector: 'apex-empty-state',
  template: `
    <div class="apex-empty">
      <div class="apex-empty__icon">&#9723;</div>
      <div class="apex-empty__title">{{ title }}</div>
      <div>{{ message }}</div>
    </div>
  `
})
export class EmptyStateComponent {
  @Input() title = 'Nothing to show';
  @Input() message = '';
}
