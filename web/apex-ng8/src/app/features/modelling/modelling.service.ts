import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from '../../core/api.service';
import { ConcentrationSummary, ExposureRow } from '../../core/models';
import { environment } from '../../../environments/environment';

export type ExposureGroupBy = 'lob' | 'territory' | 'broker';

export interface PricingTask {
  id: number;
  title?: string;
  taskType?: string;
  status?: string;
  submissionId?: number;
  submissionNumber?: string;
  insuredName?: string;
  assignedToName?: string;
  dueDate?: string;
  createdUtc?: string;
}

@Injectable({ providedIn: 'root' })
export class ModellingService {
  constructor(private api: ApiService) {}

  /** External UW Pricing portal URL (deep-link / embed target). */
  pricingPortalUrl(context?: { reference?: string; submissionId?: number | string }): string {
    const base = (environment as any).pricingUrl
      || 'https://example.invalid/pricing';
    const params: string[] = [];
    if (context && context.reference) {
      params.push('ref=' + encodeURIComponent(String(context.reference)));
    }
    if (context && context.submissionId != null) {
      params.push('submissionId=' + encodeURIComponent(String(context.submissionId)));
    }
    params.push('source=apex-workbench');
    return base + (base.indexOf('?') >= 0 ? '&' : '?') + params.join('&');
  }

  getExposure(groupBy: ExposureGroupBy): Observable<ExposureRow[]> {
    return this.api.get<ExposureRow[]>('/modelling/exposure', { groupBy });
  }

  getConcentrationSummary(): Observable<ConcentrationSummary> {
    return this.api.get<ConcentrationSummary>('/modelling/concentration-summary');
  }

  getUnderwriterFile(submissionId: number | string): Observable<any> {
    return this.api.get<any>(`/underwriter-file/${submissionId}`);
  }

  /** Open modelling / pricing-related workflow tasks for the current UW. */
  getModellingTasks(): Observable<PricingTask[]> {
    return this.api.get<any[]>('/workflow/tasks', { status: 'Open', pageSize: 100 }).pipe(
      map((tasks: any[]) => {
        const list = tasks || [];
        return list
          .filter((t: any) => {
            const type = String(t.taskType || t.type || t.title || '').toLowerCase();
            return type.indexOf('model') >= 0
              || type.indexOf('pricing') >= 0
              || type.indexOf('second sight') >= 0
              || type.indexOf('rate') >= 0;
          })
          .map((t: any) => ({
            id: t.id,
            title: t.title || t.taskType || 'Modelling',
            taskType: t.taskType || t.type,
            status: t.status,
            submissionId: t.submissionId,
            submissionNumber: t.submissionNumber || t.reference,
            insuredName: t.insuredName || t.accountName,
            assignedToName: t.assignedToName || t.assignedTo,
            dueDate: t.dueDate,
            createdUtc: t.createdUtc || t.createdDate
          } as PricingTask));
      })
    );
  }
}
