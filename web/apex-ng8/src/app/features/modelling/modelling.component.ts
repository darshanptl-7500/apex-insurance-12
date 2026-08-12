import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { AuthService } from '../../core/auth.service';
import { ApiError } from '../../core/api.service';
import { ConcentrationSummary, ExposureRow } from '../../core/models';
import { ExposureGroupBy, ModellingService, PricingTask } from './modelling.service';

@Component({
  selector: 'apex-modelling',
  templateUrl: './modelling.component.html',
  styleUrls: ['./modelling.component.css']
})
export class ModellingComponent implements OnInit, OnDestroy {

  loading = true;
  error: string | null = null;
  riskLoading = false;
  riskError: string | null = null;

  submissionId: number | null = null;
  file: any = null;
  embedOpen = false;
  embedUrl: SafeResourceUrl | null = null;

  tasks: PricingTask[] = [];
  tasksLoading = false;

  concentration: ConcentrationSummary | null = null;
  showPortfolio = false;
  activeTab: ExposureGroupBy = 'lob';
  groupOptions: { value: ExposureGroupBy; label: string }[] = [
    { value: 'lob', label: 'Line of Business' },
    { value: 'territory', label: 'Territory' },
    { value: 'broker', label: 'Broker' }
  ];
  private rowsByGroup: { [key in ExposureGroupBy]?: ExposureRow[] } = {};
  private routeSub: Subscription | null = null;

  constructor(
    private modellingService: ModellingService,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    public auth: AuthService
  ) {}

  ngOnInit(): void {
    this.routeSub = this.route.queryParamMap.subscribe(params => {
      const raw = params.get('submissionId');
      const id = raw ? Number(raw) : NaN;
      this.submissionId = !isNaN(id) && id > 0 ? id : null;
      this.refreshEmbedUrl();
      this.load();
    });
  }

  ngOnDestroy(): void {
    if (this.routeSub) { this.routeSub.unsubscribe(); }
  }

  get reference(): string {
    if (!this.file) { return ''; }
    return this.file.uwReference || this.file.submissionNumber || '';
  }

  get accountName(): string {
    return (this.file && (this.file.accountName || this.file.insuredName)) || '';
  }

  get sections(): any[] {
    return (this.file && this.file.sections) || [];
  }

  get pricingUrl(): string {
    return this.modellingService.pricingPortalUrl({
      reference: this.reference || undefined,
      submissionId: this.submissionId || undefined
    });
  }

  get uwFileUrl(): string {
    if (!this.submissionId) { return '/ng8/case-hub'; }
    return '/ng8/case-hub/' + this.submissionId;
  }

  taskUrl(task: PricingTask): string {
    return this.auth.shellUrl('/tasks/' + task.id);
  }

  private refreshEmbedUrl(): void {
    this.embedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.pricingUrl);
  }

  load(): void {
    this.loading = true;
    this.error = null;
    this.rowsByGroup = {};
    this.refreshEmbedUrl();

    this.modellingService.getConcentrationSummary().subscribe(
      (summary: ConcentrationSummary) => { this.concentration = summary; },
      () => { this.concentration = null; }
    );

    this.loadTasks();

    if (this.submissionId) {
      this.loadRisk(this.submissionId);
    } else {
      this.file = null;
      this.riskError = null;
    }

    this.modellingService.getExposure(this.activeTab).subscribe(
      (rows: ExposureRow[]) => {
        this.rowsByGroup[this.activeTab] = rows || [];
        this.loading = false;
      },
      (err: ApiError) => {
        this.error = err.message;
        this.loading = false;
      }
    );
  }

  loadRisk(id: number): void {
    this.riskLoading = true;
    this.riskError = null;
    this.modellingService.getUnderwriterFile(id).subscribe(
      (file: any) => {
        this.file = file;
        this.refreshEmbedUrl();
        this.riskLoading = false;
      },
      (err: ApiError) => {
        this.file = null;
        this.riskError = err.message;
        this.riskLoading = false;
      }
    );
  }

  loadTasks(): void {
    this.tasksLoading = true;
    this.modellingService.getModellingTasks().subscribe(
      (tasks: PricingTask[]) => {
        this.tasks = tasks || [];
        this.tasksLoading = false;
      },
      () => {
        this.tasks = [];
        this.tasksLoading = false;
      }
    );
  }

  openPricing(): void {
    window.open(this.pricingUrl, '_blank', 'noopener');
  }

  toggleEmbed(): void {
    this.embedOpen = !this.embedOpen;
    if (this.embedOpen) { this.refreshEmbedUrl(); }
  }

  togglePortfolio(): void {
    this.showPortfolio = !this.showPortfolio;
  }

  setTab(tab: ExposureGroupBy): void {
    this.activeTab = tab;
    if (!this.rowsByGroup[tab]) {
      this.modellingService.getExposure(tab).subscribe(
        (rows: ExposureRow[]) => { this.rowsByGroup[tab] = rows || []; },
        () => { this.rowsByGroup[tab] = []; }
      );
    }
  }

  get activeRows(): ExposureRow[] {
    return this.rowsByGroup[this.activeTab] || [];
  }

  maxSumInsured(): number {
    return Math.max(1, ...this.activeRows.map(r => r.sumInsured));
  }

  barWidth(row: ExposureRow): string {
    return Math.round((row.sumInsured / this.maxSumInsured()) * 100) + '%';
  }

  concentrationPct(row: ExposureRow): number {
    const total = this.activeRows.reduce((sum, r) => sum + (r.sumInsured || 0), 0);
    return total > 0 ? (row.sumInsured / total) * 100 : 0;
  }

  money(v: any): string {
    if (v == null || v === '') { return '—'; }
    const n = Number(v);
    if (isNaN(n)) { return '—'; }
    return '£' + n.toLocaleString('en-GB', { maximumFractionDigits: 0 });
  }

  pct(v: any): string {
    if (v == null || v === '') { return '—'; }
    const n = Number(v);
    if (isNaN(n)) { return String(v); }
    return (n <= 1 ? n * 100 : n).toFixed(1) + '%';
  }
}
