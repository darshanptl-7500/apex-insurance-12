import { Component, OnInit } from '@angular/core';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../../core/auth.service';
import { ApiError } from '../../core/api.service';
import {
  BrokerPerformanceWidget, ConcentrationSummary, DashboardSummary, PremiumVsTargetRow
} from '../../core/models';
import { DashboardService, PipelinePulse } from './dashboard.service';

interface QueueTile {
  key: string;
  label: string;
  count: number;
  tone: 'neutral' | 'warn' | 'danger' | 'ok';
  href: string;
}

interface PulseTile {
  label: string;
  count: number;
  href: string;
  tone: string;
}

@Component({
  selector: 'apex-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  loading = true;
  error: string | null = null;
  summary: DashboardSummary | null = null;
  pulse: PipelinePulse | null = null;
  concentration: ConcentrationSummary | null = null;
  premiumTrend: PremiumVsTargetRow[] = [];

  period: 'ytd' | 'qtd' | 'mtd' | '12m' = 'ytd';
  fromDate = '';
  toDate = '';

  constructor(private dashboardService: DashboardService, public auth: AuthService) {}

  ngOnInit(): void {
    this.applyPeriod('ytd');
  }

  applyPeriod(period: 'ytd' | 'qtd' | 'mtd' | '12m'): void {
    this.period = period;
    const now = new Date();
    const to = this.iso(now);
    let from: Date;
    if (period === 'mtd') {
      from = new Date(now.getFullYear(), now.getMonth(), 1);
    } else if (period === 'qtd') {
      const q = Math.floor(now.getMonth() / 3) * 3;
      from = new Date(now.getFullYear(), q, 1);
    } else if (period === '12m') {
      from = new Date(now.getFullYear(), now.getMonth() - 11, 1);
    } else {
      from = new Date(now.getFullYear(), 0, 1);
    }
    this.fromDate = this.iso(from);
    this.toDate = to;
    this.load();
  }

  private iso(d: Date): string {
    return d.toISOString().slice(0, 10);
  }

  load(): void {
    this.loading = true;
    this.error = null;

    forkJoin([
      this.dashboardService.getSummary(this.fromDate, this.toDate),
      this.dashboardService.getPipelinePulse().pipe(catchError(() => of(null))),
      this.dashboardService.getPremiumTrend(this.fromDate, this.toDate).pipe(catchError(() => of([]))),
      this.dashboardService.getConcentration().pipe(catchError(() => of(null)))
    ]).subscribe(
      ([summary, pulse, trend, concentration]:
        [DashboardSummary, PipelinePulse | null, PremiumVsTargetRow[], ConcentrationSummary | null]) => {
        this.summary = summary;
        this.pulse = pulse;
        this.premiumTrend = trend || [];
        this.concentration = concentration;
        this.loading = false;
      },
      (err: ApiError) => {
        this.error = err.message;
        this.loading = false;
      }
    );
  }

  get queueTiles(): QueueTile[] {
    const q = this.summary && this.summary.queues;
    if (!q) { return []; }
    return [
      { key: 'new', label: 'New submissions', count: q.newSubmissions, tone: 'neutral',
        href: this.auth.shellUrl('/pipeline/upcoming') },
      { key: 'ref', label: 'Referrals', count: q.referrals, tone: q.referrals > 0 ? 'danger' : 'ok',
        href: this.auth.shellUrl('/pipeline/referrals') },
      { key: 'ren', label: 'Renewals due', count: q.renewalsDue, tone: q.renewalsDue > 0 ? 'warn' : 'ok',
        href: this.auth.shellUrl('/pipeline/upcoming') },
      { key: 'qte', label: 'Outstanding quotes', count: q.outstandingQuotes, tone: 'neutral',
        href: this.auth.shellUrl('/pipeline/upcoming') },
      { key: 'docs', label: 'Bound · awaiting docs', count: q.boundAwaitingDocs, tone: q.boundAwaitingDocs > 0 ? 'warn' : 'ok',
        href: this.auth.shellUrl('/documents') }
    ];
  }

  get pulseTiles(): PulseTile[] {
    const p = this.pulse || {};
    return [
      { label: 'Upcoming', count: p.upcoming || 0, href: this.auth.shellUrl('/pipeline/upcoming'), tone: 'navy' },
      { label: 'Day File', count: p.dayFile || 0, href: this.auth.shellUrl('/pipeline/day-file'), tone: 'navy' },
      { label: 'Queries', count: p.queries || 0, href: this.auth.shellUrl('/pipeline/queries'), tone: 'warn' },
      { label: 'Referrals', count: p.referrals || 0, href: this.auth.shellUrl('/pipeline/referrals'), tone: 'danger' },
      { label: 'Open tasks', count: p.openTasks || 0, href: this.auth.shellUrl('/inbox'), tone: 'warn' },
      { label: 'DA', count: p.delegatedAuthority || 0, href: this.auth.shellUrl('/pipeline/da'), tone: 'navy' },
      { label: 'Bound', count: p.bound || 0, href: this.auth.shellUrl('/pipeline/bound'), tone: 'ok' },
      { label: 'E-Placement', count: p.ePlacement || 0, href: '/ng8/modelling', tone: 'navy' }
    ];
  }

  get topBrokers(): BrokerPerformanceWidget[] {
    return (this.summary && this.summary.topBrokers) || [];
  }

  get kpis() {
    return this.summary && this.summary.kpis;
  }

  get targetPct(): number {
    return (this.kpis && this.kpis.percentOfTarget) || 0;
  }

  get gaugeDash(): string {
    const pct = Math.max(0, Math.min(100, this.targetPct));
    const circ = 2 * Math.PI * 42;
    const filled = (pct / 100) * circ;
    return filled + ' ' + (circ - filled);
  }

  maxQueueCount(): number {
    return Math.max(1, ...this.queueTiles.map(q => q.count));
  }

  queueBarWidth(q: QueueTile): string {
    return Math.round((q.count / this.maxQueueCount()) * 100) + '%';
  }

  maxBrokerPremium(): number {
    return Math.max(1, ...this.topBrokers.map(b => b.grossWrittenPremium || 0));
  }

  brokerBarWidth(b: BrokerPerformanceWidget): string {
    return Math.round(((b.grossWrittenPremium || 0) / this.maxBrokerPremium()) * 100) + '%';
  }

  maxTrend(): number {
    return Math.max(1, ...this.premiumTrend.map(r => Math.max(r.premiumWritten || 0, r.target || 0)));
  }

  trendWrittenHeight(r: PremiumVsTargetRow): string {
    return Math.round(((r.premiumWritten || 0) / this.maxTrend()) * 100) + '%';
  }

  trendTargetHeight(r: PremiumVsTargetRow): string {
    return Math.round(((r.target || 0) / this.maxTrend()) * 100) + '%';
  }

  get recentTrend(): PremiumVsTargetRow[] {
    return (this.premiumTrend || []).slice(-8);
  }

  get attentionItems(): { label: string; detail: string; href: string; tone: string }[] {
    const items = [];
    const q = this.summary && this.summary.queues;
    const p = this.pulse || {};
    if (q && q.referrals > 0) {
      items.push({ label: 'Referrals waiting', detail: q.referrals + ' open', href: this.auth.shellUrl('/pipeline/referrals'), tone: 'danger' });
    }
    if (p.openTasks > 0) {
      items.push({ label: 'Open tasks', detail: p.openTasks + ' assigned', href: this.auth.shellUrl('/inbox'), tone: 'warn' });
    }
    if (q && q.boundAwaitingDocs > 0) {
      items.push({ label: 'Docs outstanding', detail: q.boundAwaitingDocs + ' bound risks', href: this.auth.shellUrl('/documents'), tone: 'warn' });
    }
    if (p.queries > 0) {
      items.push({ label: 'Ops queries', detail: p.queries + ' open', href: this.auth.shellUrl('/pipeline/queries'), tone: 'warn' });
    }
    if (!items.length) {
      items.push({ label: 'Queues clear', detail: 'No urgent UW actions', href: this.auth.shellUrl('/pipeline/upcoming'), tone: 'ok' });
    }
    return items;
  }
}
