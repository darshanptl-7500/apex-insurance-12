import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../core/api.service';
import {
  AdminUserApi, CreateUserRequest, UpdateUserRequest,
  RateTableApi, RateTableRequest,
  ReferralRuleApi, ReferralRuleRequest,
  AuthorityRuleApi, AuthorityRuleRequest,
  SystemParameterApi, HolidayApi,
  TradeApi, TeamApi
} from '../../core/models';

@Injectable({ providedIn: 'root' })
export class AdminService {
  constructor(private api: ApiService) {}

  // Users
  listUsers(activeOnly = false): Observable<AdminUserApi[]> {
    return this.api.get<AdminUserApi[]>('/admin/users', { activeOnly });
  }
  createUser(request: CreateUserRequest): Observable<AdminUserApi> {
    return this.api.post<AdminUserApi>('/admin/users', request);
  }
  updateUser(id: number, request: UpdateUserRequest): Observable<AdminUserApi> {
    return this.api.put<AdminUserApi>(`/admin/users/${id}`, request);
  }
  deactivateUser(id: number): Observable<void> {
    return this.api.post<void>(`/admin/users/${id}/deactivate`);
  }
  resetPassword(id: number, newPassword: string): Observable<void> {
    return this.api.post<void>(`/admin/users/${id}/reset-password`, newPassword);
  }

  // Teams (needed for the user form's team dropdown)
  listTeams(): Observable<TeamApi[]> {
    return this.api.get<TeamApi[]>('/admin/teams');
  }

  // Trades (needed for rate table / referral rule dropdowns)
  listTrades(): Observable<TradeApi[]> {
    return this.api.get<TradeApi[]>('/admin/trades');
  }

  // Rate tables
  listRateTables(lob?: string): Observable<RateTableApi[]> {
    return this.api.get<RateTableApi[]>('/admin/rate-tables', { lob });
  }
  saveRateTable(request: RateTableRequest): Observable<RateTableApi> {
    return this.api.post<RateTableApi>('/admin/rate-tables', request);
  }

  // Referral rules
  listReferralRules(): Observable<ReferralRuleApi[]> {
    return this.api.get<ReferralRuleApi[]>('/admin/referral-rules');
  }
  saveReferralRule(request: ReferralRuleRequest): Observable<ReferralRuleApi> {
    return this.api.post<ReferralRuleApi>('/admin/referral-rules', request);
  }

  // Authority rules
  listAuthorityRules(): Observable<AuthorityRuleApi[]> {
    return this.api.get<AuthorityRuleApi[]>('/admin/authority-rules');
  }
  saveAuthorityRule(request: AuthorityRuleRequest): Observable<AuthorityRuleApi> {
    return this.api.post<AuthorityRuleApi>('/admin/authority-rules', request);
  }

  // Parameters
  listParameters(): Observable<SystemParameterApi[]> {
    return this.api.get<SystemParameterApi[]>('/admin/parameters');
  }
  saveParameter(key: string, value: string, description?: string, dataType?: string): Observable<SystemParameterApi> {
    return this.api.put<SystemParameterApi>(`/admin/parameters/${encodeURIComponent(key)}`, { key, value, description, dataType });
  }

  // Holidays
  listHolidays(year?: number): Observable<HolidayApi[]> {
    return this.api.get<HolidayApi[]>('/admin/holidays', { year });
  }
  addHoliday(holidayDate: string, description: string, countryCode?: string): Observable<HolidayApi> {
    return this.api.post<HolidayApi>('/admin/holidays', { holidayDate, description, countryCode });
  }
}
