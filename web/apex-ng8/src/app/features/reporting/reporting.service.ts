import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../core/api.service';
import { BrokerLeagueRow, LossRatioRow, PipelineAgingRow, PremiumVsTargetRow } from '../../core/models';

@Injectable({ providedIn: 'root' })
export class ReportingService {
  constructor(private api: ApiService) {}

  getPremiumVsTarget(fromDate: string, toDate: string): Observable<PremiumVsTargetRow[]> {
    return this.api.get<PremiumVsTargetRow[]>('/reports/premium-vs-target', { fromDate, toDate });
  }

  getBrokerLeague(fromDate: string, toDate: string, top = 20): Observable<BrokerLeagueRow[]> {
    return this.api.get<BrokerLeagueRow[]>('/reports/broker-league', { fromDate, toDate, top });
  }

  getPipeline(): Observable<PipelineAgingRow[]> {
    return this.api.get<PipelineAgingRow[]>('/reports/pipeline');
  }

  getLossRatio(fromDate: string, toDate: string): Observable<LossRatioRow[]> {
    return this.api.get<LossRatioRow[]>('/reports/loss-ratio', { fromDate, toDate });
  }

  premiumVsTargetExportUrl(fromDate: string, toDate: string): string {
    return `${this.api.baseUrl}/reports/premium-vs-target/export?fromDate=${fromDate}&toDate=${toDate}`;
  }

  brokerLeagueExportUrl(fromDate: string, toDate: string): string {
    return `${this.api.baseUrl}/reports/broker-league/export?fromDate=${fromDate}&toDate=${toDate}`;
  }
}
