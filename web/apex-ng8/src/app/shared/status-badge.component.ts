import { Component, Input, OnChanges } from '@angular/core';
import { CLAIM_STATUS_LABELS, POLICY_STATUS_LABELS, SUBMISSION_STATUS_LABELS } from '../core/models';

type BadgeKind = 'submission' | 'policy' | 'claim';

// API enums cross the wire as PascalCase strings (StringEnumConverter), so
// both the label and CSS-class lookups below are keyed by that string name.
const BADGE_CLASS: { [kind: string]: { [status: string]: string } } = {
  submission: { Received: 'neutral', Triaged: 'info', Quoted: 'gold', Referred: 'warn', Bound: 'success', Declined: 'danger', NotTakenUp: 'neutral' },
  policy: { Active: 'success', Cancelled: 'danger', Expired: 'neutral', PendingRenewal: 'warn', Renewed: 'info' },
  claim: { Open: 'info', ReservedForPayment: 'gold', Paid: 'success', Closed: 'neutral', Declined: 'danger', Reopened: 'warn' }
};

const LABELS: { [kind: string]: { [status: string]: string } } = {
  submission: SUBMISSION_STATUS_LABELS,
  policy: POLICY_STATUS_LABELS,
  claim: CLAIM_STATUS_LABELS
};

@Component({
  selector: 'apex-status-badge',
  template: `<span class="apex-badge" [ngClass]="'apex-badge--' + badgeClass">{{ label }}</span>`
})
export class StatusBadgeComponent implements OnChanges {
  @Input() kind: BadgeKind = 'submission';
  @Input() value: string;

  label = '';
  badgeClass = 'neutral';

  ngOnChanges(): void {
    const labels = LABELS[this.kind] || {};
    const classes = BADGE_CLASS[this.kind] || {};
    this.label = (this.value && labels[this.value]) || this.value || 'Unknown';
    this.badgeClass = (this.value && classes[this.value]) || 'neutral';
  }
}
