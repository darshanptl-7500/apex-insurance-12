import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../core/api.service';
import { DashboardSummary, PremiumVsTargetRow, ConcentrationSummary } from '../../core/models';

export interface PipelinePulse {
  upcoming?: number;
  bound?: number;
  ntuDeclined?: number;
  dayFile?: number;
  queries?: number;
  referrals?: number;
  openTasks?: number;
  delegatedAuthority?: number;
  recentActivity?: number;
  ePlacement?: number;
}

@Injectable({ providedIn: 'root' })
export class DashboardService {
  constructor(private api: ApiService) {}

  getSummary(fromDate?: string, toDate?: string): Observable<DashboardSummary> {
    return this.api.get<DashboardSummary>('/dashboard/summary', { fromDate, toDate });
  }

  getPipelinePulse(): Observable<PipelinePulse> {
    return this.api.get<PipelinePulse>('/pipeline/summary');
  }

  getPremiumTrend(fromDate: string, toDate: string): Observable<PremiumVsTargetRow[]> {
    return this.api.get<PremiumVsTargetRow[]>('/reports/premium-vs-target', { fromDate, toDate });
  }

  getConcentration(): Observable<ConcentrationSummary> {
    return this.api.get<ConcentrationSummary>('/modelling/concentration-summary');
  }
}
