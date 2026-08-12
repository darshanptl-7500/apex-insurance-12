import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { CaseHubService, UwEditRequest } from './case-hub.service';
import { AuthService } from '../../core/auth.service';
import { ApiError } from '../../core/api.service';
import { Policy, RiskAnswer } from '../../core/models';

type UwNav = 'dashboard' | 'policy' | 'claim' | 'activity' | 'associations' | 'premium' | 'documents';
type RiskTab = 'summary' | 'notes' | 'performance' | 'quotes';
type SectionTab =
  | 'summary'
  | 'limits'
  | 'premiums'
  | 'performance'
  | 'bureau'
  | 'deductions'
  | 'outwardsRi'
  | 'declarations';

@Component({
  selector: 'apex-case-hub',
  templateUrl: './case-hub.component.html',
  styleUrls: ['./case-hub.component.css']
})
export class CaseHubComponent implements OnInit {

  submissionId: number;
  loading = true;
  error: string | null = null;
  notFound = false;

  file: any = null;
  selectedSection: any = null;
  nav: UwNav = 'policy';
  riskTab: RiskTab = 'summary';
  sectionTab: SectionTab = 'summary';

  performanceCcy = 'GBP';

  riskAnswers: RiskAnswer[] = [];
  riskSaving = false;
  riskError: string | null = null;

  quoteDraft = {
    sumInsured: 1000000,
    limitOfIndemnity: 1000000,
    deductible: 1000,
    commissionPercent: 15
  };
  showQuoteForm = false;
  quoteCreating = false;
  quoteBusyId: number | null = null;
  quotesError: string | null = null;

  showEditModal = false;
  editSaving = false;
  editError: string | null = null;
  editForm: UwEditRequest = this.emptyEditForm();

  previewDocId: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private caseHubService: CaseHubService,
    private sanitizer: DomSanitizer,
    public auth: AuthService
  ) {}

  ngOnInit(): void {
    this.submissionId = Number(this.route.snapshot.paramMap.get('id'));
    this.reload();
  }

  get uwReference(): string {
    if (!this.file) { return String(this.submissionId); }
    return this.file.uwReference || this.file.submissionNumber || String(this.submissionId);
  }

  /** Document types as simple folders + files for the Documents pane. */
  get documentFolders(): { type: string; docs: any[] }[] {
    const docs = (this.file && this.file.documents) || [];
    const map: { [key: string]: any[] } = {};
    for (let i = 0; i < docs.length; i++) {
      const d = docs[i];
      const t = d.documentType || 'Other';
      if (!map[t]) { map[t] = []; }
      map[t].push(d);
    }
    return Object.keys(map).sort().map(type => ({ type: type, docs: map[type] }));
  }

  get previewDoc(): any {
    if (this.previewDocId == null || !this.file || !this.file.documents) { return null; }
    return this.file.documents.find((d: any) => d.id === this.previewDocId) || null;
  }

  /** Claim KPI strip values from first claim (or nulls when none). */
  get claimKpis(): { ilr: any; cap: any; apexShareNp: any; exposure: any } {
    const claims = (this.file && this.file.claims) || [];
    const c = claims.length ? claims[0] : null;
    if (!c) {
      return { ilr: null, cap: null, apexShareNp: null, exposure: null };
    }
    return {
      ilr: c.ilr,
      cap: c.cap,
      apexShareNp: c.apexShareNp,
      exposure: c.exposure != null ? c.exposure : this.file.sumInsured
    };
  }

  reload(): void {
    this.loading = true;
    this.error = null;
    this.notFound = false;
    this.caseHubService.getUnderwriterFile(this.submissionId).subscribe(
      (file: any) => {
        const prevQuoteId = this.selectedSection && this.selectedSection.quoteId;
        this.file = file;
        if (prevQuoteId && file.sections) {
          this.selectedSection = file.sections.find((s: any) => s.quoteId === prevQuoteId) || file.sections[0] || null;
        } else {
          this.selectedSection = (file.sections && file.sections[0]) || null;
        }
        this.loading = false;
        this.caseHubService.getRiskAnswers(this.submissionId).subscribe(
          (answers: RiskAnswer[]) => { this.riskAnswers = answers || []; },
          () => { this.riskAnswers = []; }
        );
      },
      (err: ApiError) => {
        this.loading = false;
        if (err.status === 404) { this.notFound = true; }
        else { this.error = err.message; }
      }
    );
  }

  setNav(nav: UwNav): void { this.nav = nav; }
  setRiskTab(tab: RiskTab): void { this.riskTab = tab; }
  setSectionTab(tab: SectionTab): void { this.sectionTab = tab; }

  selectSection(section: any): void {
    this.selectedSection = section;
    this.nav = 'policy';
    this.riskTab = 'summary';
    this.sectionTab = 'summary';
  }

  shellDocumentsUrl(): string {
    return this.auth.shellUrl('/documents?submissionId=' + this.submissionId);
  }

  modellingUrl(): string {
    return '/ng8/modelling?submissionId=' + this.submissionId;
  }

  taskInboxUrl(): string {
    return this.auth.shellUrl('/inbox?submissionId=' + this.submissionId);
  }

  openBoxUrl(): string {
    return this.auth.shellUrl('/openbox');
  }

  filteredPerformanceRows(rows: any[]): any[] {
    if (!rows || !rows.length) { return []; }
    if (!this.performanceCcy) { return rows; }
    return rows.filter((r: any) => !r.ccy || r.ccy === this.performanceCcy);
  }

  activityDetailUrl(a: any): string | null {
    if (!a || a.relatedEntityId == null) { return null; }
    if (!this.isTaskLikeActivity(a)) { return null; }
    return this.auth.shellUrl('/tasks/' + a.relatedEntityId);
  }

  isTaskLikeActivity(a: any): boolean {
    if (!a) { return false; }
    const t = String(a.activityType || '').toLowerCase();
    return t.indexOf('task') >= 0
      || t === 'modelling'
      || t === 'second sight'
      || t === 'front sheet'
      || t === 'line slip'
      || t === 'referral'
      || t === 'wording'
      || t === 'data entry';
  }

  previewDocument(doc: any): void {
    this.previewDocId = doc ? doc.id : null;
  }

  isPdfDoc(doc: any): boolean {
    if (!doc) { return false; }
    const ct = String(doc.contentType || '').toLowerCase();
    const name = String(doc.fileName || '').toLowerCase();
    return ct.indexOf('pdf') >= 0 || name.endsWith('.pdf');
  }

  openEditModal(): void {
    this.editError = null;
    const s = this.selectedSection;
    this.editForm = {
      riskStatus: this.file.status || '',
      brokerContact: this.file.brokerContact || '',
      inception: this.toDateInput(this.file.policyEffectiveDate || this.file.requestedEffectiveDate),
      expiry: this.toDateInput(this.file.policyExpiryDate),
      riskAppetite: this.file.riskAppetite || '',
      renewalWarning: !!this.file.renewalWarning,
      policyDescription: this.file.policyDescription || '',
      isNonRenewable: !!this.file.isNonRenewable,
      principalUw: (s && s.uwPrincipal) || this.file.underwriterName || '',
      subStat1: (s && s.subStat1) || '',
      subStat2: (s && s.subStat2) || '',
      etradingPlatform: (s && s.etradingPlatform) || '',
      licSecondee: (s && s.licSecondee) || '',
      esgStatus: this.file.esgStatus || '',
      notesType: this.file.notesType || 'UWTR',
      notes: this.file.notes || '',
      estSigning: s && s.estSigning != null ? s.estSigning : null,
      dedXs: s && s.dedXs != null ? s.dedXs : (s && s.deductible != null ? s.deductible : null),
      premRate: s && s.premRate != null ? s.premRate : null,
      riskChange: s && s.riskChange != null ? s.riskChange : null,
      tcChange: s && s.tcChange != null ? s.tcChange : null,
      otherChange: s && s.otherChange != null ? s.otherChange : null,
      modelledLr: s && s.modelledLr != null ? s.modelledLr : null,
      facilityFlag: !!(s && s.facility),
      lbsFlag: !!(s && s.lbs),
      licFlag: !!(s && s.lic),
      longTermLossRatio: this.file.longTermLossRatio != null ? this.file.longTermLossRatio : null,
      rateAdequacy: this.file.rateAdequacy != null ? this.file.rateAdequacy : null,
      technicalIndex: s && s.technicalIndex != null ? s.technicalIndex : null
    };
    this.showEditModal = true;
  }

  closeEditModal(): void {
    if (this.editSaving) { return; }
    this.showEditModal = false;
    this.editError = null;
  }

  submitEdit(): void {
    this.editSaving = true;
    this.editError = null;
    const body: UwEditRequest = {
      riskStatus: this.editForm.riskStatus,
      brokerContact: this.editForm.brokerContact,
      inception: this.editForm.inception || undefined,
      expiry: this.editForm.expiry || undefined,
      riskAppetite: this.editForm.riskAppetite,
      renewalWarning: !!this.editForm.renewalWarning,
      policyDescription: this.editForm.policyDescription,
      isNonRenewable: !!this.editForm.isNonRenewable,
      principalUw: this.editForm.principalUw,
      subStat1: this.editForm.subStat1,
      subStat2: this.editForm.subStat2,
      etradingPlatform: this.editForm.etradingPlatform,
      licSecondee: this.editForm.licSecondee,
      esgStatus: this.editForm.esgStatus,
      notesType: this.editForm.notesType,
      notes: this.editForm.notes,
      estSigning: this.toOptionalNumber(this.editForm.estSigning),
      dedXs: this.toOptionalNumber(this.editForm.dedXs),
      premRate: this.toOptionalNumber(this.editForm.premRate),
      riskChange: this.toOptionalNumber(this.editForm.riskChange),
      tcChange: this.toOptionalNumber(this.editForm.tcChange),
      otherChange: this.toOptionalNumber(this.editForm.otherChange),
      modelledLr: this.toOptionalNumber(this.editForm.modelledLr),
      facilityFlag: !!this.editForm.facilityFlag,
      lbsFlag: !!this.editForm.lbsFlag,
      licFlag: !!this.editForm.licFlag,
      longTermLossRatio: this.toOptionalNumber(this.editForm.longTermLossRatio),
      rateAdequacy: this.toOptionalNumber(this.editForm.rateAdequacy),
      technicalIndex: this.toOptionalNumber(this.editForm.technicalIndex)
    };
    this.caseHubService.editUnderwriting(this.submissionId, body).subscribe(
      () => {
        this.editSaving = false;
        this.showEditModal = false;
        this.reload();
      },
      (err: ApiError) => {
        this.editError = err.message;
        this.editSaving = false;
      }
    );
  }

  addRiskAnswer(): void {
    this.riskAnswers = [...this.riskAnswers, { questionCode: '', questionText: '', answerText: '' }];
  }

  removeRiskAnswer(index: number): void {
    this.riskAnswers = this.riskAnswers.filter((_, i) => i !== index);
  }

  saveRiskAnswers(): void {
    this.riskSaving = true;
    this.riskError = null;
    this.caseHubService.saveRiskAnswers(this.submissionId, this.riskAnswers).subscribe(
      (answers: RiskAnswer[]) => { this.riskAnswers = answers || []; this.riskSaving = false; },
      (err: ApiError) => { this.riskError = err.message; this.riskSaving = false; }
    );
  }

  toggleQuoteForm(): void {
    this.showQuoteForm = !this.showQuoteForm;
    this.quotesError = null;
  }

  createQuote(): void {
    this.quoteCreating = true;
    this.quotesError = null;
    this.caseHubService.createQuote({
      submissionId: this.submissionId,
      sumInsured: Number(this.quoteDraft.sumInsured),
      limitOfIndemnity: Number(this.quoteDraft.limitOfIndemnity),
      deductible: Number(this.quoteDraft.deductible) || 0,
      commissionPercent: Number(this.quoteDraft.commissionPercent) || 0
    }).subscribe(
      () => {
        this.quoteCreating = false;
        this.showQuoteForm = false;
        this.reload();
        this.riskTab = 'quotes';
      },
      (err: ApiError) => { this.quotesError = err.message; this.quoteCreating = false; }
    );
  }

  canBind(section: any): boolean {
    if (!section) { return false; }
    if (!section.isReferralRequired) { return true; }
    return section.referralDecision === 'Approved' || section.referralDecision === 2;
  }

  selectQuote(section: any): void {
    this.quoteBusyId = section.quoteId;
    this.caseHubService.selectQuote(section.quoteId).subscribe(
      () => { this.quoteBusyId = null; this.reload(); },
      (err: ApiError) => { this.quotesError = err.message; this.quoteBusyId = null; }
    );
  }

  bindQuote(section: any): void {
    this.quoteBusyId = section.quoteId;
    this.caseHubService.bindQuote(section.quoteId).subscribe(
      (_policy: Policy) => { this.quoteBusyId = null; this.reload(); },
      (err: ApiError) => { this.quotesError = err.message; this.quoteBusyId = null; }
    );
  }

  downloadDocument(doc: any): void {
    window.open(this.caseHubService.downloadUrl(doc.id), '_blank');
  }

  documentDownloadUrl(doc: any): string {
    return this.caseHubService.downloadUrl(doc.id);
  }

  documentPreviewUrl(doc: any): SafeResourceUrl | null {
    if (!doc || !this.isPdfDoc(doc)) { return null; }
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.caseHubService.downloadUrl(doc.id));
  }

  private emptyEditForm(): UwEditRequest {
    return {
      riskStatus: '',
      brokerContact: '',
      inception: '',
      expiry: '',
      riskAppetite: '',
      renewalWarning: false,
      policyDescription: '',
      isNonRenewable: false,
      principalUw: '',
      subStat1: '',
      subStat2: '',
      etradingPlatform: '',
      licSecondee: '',
      esgStatus: '',
      notesType: 'UWTR',
      notes: '',
      estSigning: null,
      dedXs: null,
      premRate: null,
      riskChange: null,
      tcChange: null,
      otherChange: null,
      modelledLr: null,
      facilityFlag: false,
      lbsFlag: false,
      licFlag: false,
      longTermLossRatio: null,
      rateAdequacy: null,
      technicalIndex: null
    };
  }

  private toDateInput(value: string | Date | null | undefined): string {
    if (!value) { return ''; }
    const d = value instanceof Date ? value : new Date(value);
    if (isNaN(d.getTime())) { return ''; }
    const yyyy = d.getFullYear();
    const mm = ('0' + (d.getMonth() + 1)).slice(-2);
    const dd = ('0' + d.getDate()).slice(-2);
    return yyyy + '-' + mm + '-' + dd;
  }

  private toOptionalNumber(value: number | string | null | undefined): number | null {
    if (value === null || value === undefined || value === '') { return null; }
    const n = Number(value);
    return isNaN(n) ? null : n;
  }
}
