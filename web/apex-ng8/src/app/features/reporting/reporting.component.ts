import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { ReportingService } from './reporting.service';
import { ApiError } from '../../core/api.service';
import {
  BrokerLeagueRow, LossRatioRow, PipelineAgingRow, PremiumVsTargetRow
} from '../../core/models';
import { exportToCsv } from '../../shared/csv-export.util';

type ReportTab = 'premium' | 'league' | 'pipeline' | 'lossRatio';

function isoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

@Component({
  selector: 'apex-reporting',
  templateUrl: './reporting.component.html',
  styleUrls: ['./reporting.component.css']
})
export class ReportingComponent implements OnInit {

  activeTab: ReportTab = 'premium';
  loading = true;
  error: string | null = null;

  fromDate = isoDate(new Date(new Date().getFullYear(), 0, 1));
  toDate = isoDate(new Date());
  period: 'ytd' | 'qtd' | 'mtd' | '12m' | 'custom' = 'ytd';

  premiumVsTarget: PremiumVsTargetRow[] = [];
  brokerLeague: BrokerLeagueRow[] = [];
  pipeline: PipelineAgingRow[] = [];
  lossRatioRows: LossRatioRow[] = [];

  catalog: { id: ReportTab; title: string; blurb: string }[] = [
    { id: 'premium', title: 'Premium vs Target', blurb: 'Monthly written vs plan with variance' },
    { id: 'league', title: 'Broker League', blurb: 'GWP, hit ratio and production rank' },
    { id: 'pipeline', title: 'Pipeline Aging', blurb: 'Status × age-bucket heat map' },
    { id: 'lossRatio', title: 'Loss Ratio', blurb: 'Incurred vs earned by LOB' }
  ];

  constructor(private reportingService: ReportingService) {}

  ngOnInit(): void {
    this.load();
  }

  setTab(tab: ReportTab): void {
    this.activeTab = tab;
  }

  applyPeriod(period: 'ytd' | 'qtd' | 'mtd' | '12m'): void {
    this.period = period;
    const now = new Date();
    this.toDate = isoDate(now);
    if (period === 'mtd') {
      this.fromDate = isoDate(new Date(now.getFullYear(), now.getMonth(), 1));
    } else if (period === 'qtd') {
      const q = Math.floor(now.getMonth() / 3) * 3;
      this.fromDate = isoDate(new Date(now.getFullYear(), q, 1));
    } else if (period === '12m') {
      this.fromDate = isoDate(new Date(now.getFullYear(), now.getMonth() - 11, 1));
    } else {
      this.fromDate = isoDate(new Date(now.getFullYear(), 0, 1));
    }
    this.load();
  }

  applyDateFilter(): void {
    this.period = 'custom';
    this.load();
  }

  load(): void {
    this.loading = true;
    this.error = null;

    forkJoin([
      this.reportingService.getPremiumVsTarget(this.fromDate, this.toDate),
      this.reportingService.getBrokerLeague(this.fromDate, this.toDate),
      this.reportingService.getPipeline(),
      this.reportingService.getLossRatio(this.fromDate, this.toDate)
    ]).subscribe(
      ([premium, league, pipeline, lossRatio]:
        [PremiumVsTargetRow[], BrokerLeagueRow[], PipelineAgingRow[], LossRatioRow[]]) => {
        this.premiumVsTarget = premium || [];
        this.brokerLeague = league || [];
        this.pipeline = pipeline || [];
        this.lossRatioRows = lossRatio || [];
        this.loading = false;
      },
      (err: ApiError) => {
        this.error = err.message;
        this.loading = false;
      }
    );
  }

  get premiumWrittenTotal(): number {
    return this.premiumVsTarget.reduce((s, r) => s + (r.premiumWritten || 0), 0);
  }

  get premiumTargetTotal(): number {
    return this.premiumVsTarget.reduce((s, r) => s + (r.target || 0), 0);
  }

  get premiumVariancePct(): number {
    if (!this.premiumTargetTotal) { return 0; }
    return ((this.premiumWrittenTotal - this.premiumTargetTotal) / this.premiumTargetTotal) * 100;
  }

  get pipelineTotal(): number {
    return this.pipeline.reduce((s, r) => s + (r.count || 0), 0);
  }

  get leagueGwpTotal(): number {
    return this.brokerLeague.reduce((s, r) => s + (r.grossWrittenPremium || 0), 0);
  }

  get avgLossRatio(): number {
    if (!this.lossRatioRows.length) { return 0; }
    const earned = this.lossRatioRows.reduce((s, r) => s + (r.earnedPremium || 0), 0);
    const incurred = this.lossRatioRows.reduce((s, r) => s + (r.incurredLosses || 0), 0);
    return earned > 0 ? (incurred / earned) * 100 : 0;
  }

  maxPremium(): number {
    return Math.max(1, ...this.premiumVsTarget.map(r => Math.max(r.premiumWritten || 0, r.target || 0)));
  }

  writtenHeight(r: PremiumVsTargetRow): string {
    return Math.round(((r.premiumWritten || 0) / this.maxPremium()) * 100) + '%';
  }

  targetHeight(r: PremiumVsTargetRow): string {
    return Math.round(((r.target || 0) / this.maxPremium()) * 100) + '%';
  }

  maxLeagueGwp(): number {
    return Math.max(1, ...this.brokerLeague.map(r => r.grossWrittenPremium || 0));
  }

  leagueBar(r: BrokerLeagueRow): string {
    return Math.round(((r.grossWrittenPremium || 0) / this.maxLeagueGwp()) * 100) + '%';
  }

  get agingStatuses(): string[] {
    const set: { [k: string]: boolean } = {};
    this.pipeline.forEach(r => { set[r.status] = true; });
    return Object.keys(set);
  }

  get agingBuckets(): string[] {
    const order = ['0-7', '8-14', '15-30', '31-60', '61+', '0-7 days', '8-14 days', '15-30 days', '31-60 days', '61+ days'];
    const set: { [k: string]: boolean } = {};
    this.pipeline.forEach(r => { set[r.ageBucket] = true; });
    const keys = Object.keys(set);
    keys.sort((a, b) => {
      const ia = order.indexOf(a);
      const ib = order.indexOf(b);
      if (ia >= 0 && ib >= 0) { return ia - ib; }
      return a.localeCompare(b);
    });
    return keys;
  }

  agingCount(status: string, bucket: string): number {
    const row = this.pipeline.find(r => r.status === status && r.ageBucket === bucket);
    return row ? row.count : 0;
  }

  rowTotal(status: string): number {
    return this.pipeline
      .filter(r => r.status === status)
      .reduce((sum, r) => sum + (r.count || 0), 0);
  }

  maxAging(): number {
    return Math.max(1, ...this.pipeline.map(r => r.count || 0));
  }

  heatClass(count: number): string {
    if (!count) { return 'mi-heat--0'; }
    const pct = count / this.maxAging();
    if (pct > 0.75) { return 'mi-heat--4'; }
    if (pct > 0.5) { return 'mi-heat--3'; }
    if (pct > 0.25) { return 'mi-heat--2'; }
    return 'mi-heat--1';
  }

  lrGauge(row: LossRatioRow): string {
    const pct = Math.max(0, Math.min(100, row.lossRatioPercent || 0));
    const circ = 2 * Math.PI * 36;
    const filled = (pct / 100) * circ;
    return filled + ' ' + (circ - filled);
  }

  exportCurrentTab(): void {
    switch (this.activeTab) {
      case 'premium':
        window.open(this.reportingService.premiumVsTargetExportUrl(this.fromDate, this.toDate), '_blank');
        break;
      case 'league':
        window.open(this.reportingService.brokerLeagueExportUrl(this.fromDate, this.toDate), '_blank');
        break;
      case 'pipeline':
        exportToCsv('pipeline-aging.csv', this.pipeline as any);
        break;
      case 'lossRatio':
        exportToCsv('loss-ratio.csv', this.lossRatioRows as any);
        break;
    }
  }

  currentRowCount(): number {
    switch (this.activeTab) {
      case 'premium': return this.premiumVsTarget.length;
      case 'league': return this.brokerLeague.length;
      case 'pipeline': return this.pipeline.length;
      case 'lossRatio': return this.lossRatioRows.length;
      default: return 0;
    }
  }
}
