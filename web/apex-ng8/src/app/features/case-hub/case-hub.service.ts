import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ApiService } from '../../core/api.service';
import { AuthService } from '../../core/auth.service';
import {
  AuditLogItem, Claim, DocumentItem, PagedResult, Policy, Quote, RiskAnswer, Submission
} from '../../core/models';

export interface SubmissionListFilters {
  status?: string;
  lineOfBusiness?: string;
  search?: string;
  page?: number;
  pageSize?: number;
}

/** Body for POST /underwriter-file/{id}/edit (Open Box write-through). Slice-3 prep fields included. */
export interface UwEditRequest {
  riskStatus?: string;
  brokerContact?: string;
  inception?: string;
  expiry?: string;
  riskAppetite?: string;
  renewalWarning?: boolean;
  policyDescription?: string;
  isNonRenewable?: boolean;
  principalUw?: string;
  subStat1?: string;
  subStat2?: string;
  etradingPlatform?: string;
  licSecondee?: string;
  esgStatus?: string;
  notesType?: string;
  notes?: string;
  estSigning?: number | null;
  dedXs?: number | null;
  premRate?: number | null;
  riskChange?: number | null;
  tcChange?: number | null;
  otherChange?: number | null;
  modelledLr?: number | null;
  facilityFlag?: boolean;
  lbsFlag?: boolean;
  licFlag?: boolean;
  longTermLossRatio?: number | null;
  rateAdequacy?: number | null;
  technicalIndex?: number | null;
}

@Injectable({ providedIn: 'root' })
export class CaseHubService {

  constructor(private api: ApiService, private auth: AuthService) {}

  listSubmissions(filters: SubmissionListFilters): Observable<PagedResult<Submission>> {
    return this.api.get<PagedResult<Submission>>('/submissions', filters);
  }

  getSubmission(id: number | string): Observable<Submission> {
    return this.api.get<Submission>(`/submissions/${id}`);
  }

  getUnderwriterFile(submissionId: number | string): Observable<any> {
    return this.api.get<any>(`/underwriter-file/${submissionId}`);
  }

  /** POST allowed UW edit fields through Open Box write path. */
  editUnderwriting(submissionId: number | string, body: UwEditRequest): Observable<any> {
    return this.api.post<any>(`/underwriter-file/${submissionId}/edit`, body);
  }

  getRiskAnswers(submissionId: number | string): Observable<RiskAnswer[]> {
    return this.api.get<RiskAnswer[]>(`/submissions/${submissionId}/risk-answers`);
  }

  saveRiskAnswers(submissionId: number | string, answers: RiskAnswer[]): Observable<RiskAnswer[]> {
    return this.api.put<RiskAnswer[]>(`/submissions/${submissionId}/risk-answers`, { answers });
  }

  getQuotes(submissionId: number | string): Observable<Quote[]> {
    return this.api.get<Quote[]>(`/quotes/by-submission/${submissionId}`);
  }

  createQuote(body: {
    submissionId: number;
    sumInsured: number;
    limitOfIndemnity: number;
    deductible: number;
    commissionPercent: number;
  }): Observable<Quote> {
    return this.api.post<Quote>('/quotes', body);
  }

  selectQuote(quoteId: number): Observable<Quote> {
    return this.api.put<Quote>(`/quotes/${quoteId}/select`);
  }

  bindQuote(quoteId: number): Observable<Policy> {
    return this.api.post<Policy>('/policies/bind', { quoteId });
  }

  /**
   * There's no `GET /policies?submissionId=` filter on the API (PolicyDto has a
   * submissionId field, but PoliciesController.List doesn't expose it as a query
   * param), so this pulls a generous page of policies and filters client-side.
   * Tolerates failure (e.g. no bound policy yet) by resolving to an empty array.
   */
  findPolicyForSubmission(submissionId: number | string): Observable<Policy | null> {
    return this.api.get<PagedResult<Policy>>('/policies', { pageSize: 500 }).pipe(
      map(result => {
        const items = (result && result.items) || [];
        return items.find(p => String(p.submissionId) === String(submissionId)) || null;
      }),
      catchError(() => of(null))
    );
  }

  getPolicy(id: number): Observable<Policy> {
    return this.api.get<Policy>(`/policies/${id}`);
  }

  getClaimsForPolicy(policyId: number): Observable<Claim[]> {
    return this.api.get<Claim[]>('/claims', { policyId }).pipe(catchError(() => of([])));
  }

  getDocuments(kind: 'submission' | 'policy' | 'claim', id: number | string): Observable<DocumentItem[]> {
    const path = kind === 'submission' ? `/documents/by-submission/${id}`
      : kind === 'policy' ? `/documents/by-policy/${id}`
      : `/documents/by-claim/${id}`;
    return this.api.get<DocumentItem[]>(path).pipe(catchError(() => of([])));
  }

  /** Audit is restricted to Admin/UnderwritingManager on the API; callers should tolerate a 403. */
  getAudit(entityName: string, entityId: number | string): Observable<AuditLogItem[]> {
    return this.api.get<AuditLogItem[]>('/audit/logs', { entityName, entityId });
  }

  downloadUrl(documentId: number): string {
    const base = `${this.api.baseUrl}/documents/${documentId}/download`;
    const token = this.auth.getToken();
    return token ? `${base}?access_token=${encodeURIComponent(token)}` : base;
  }
}
