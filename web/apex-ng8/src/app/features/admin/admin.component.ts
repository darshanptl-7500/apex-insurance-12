import { Component, OnInit } from '@angular/core';
import { AdminService } from './admin.service';
import { AuthService } from '../../core/auth.service';
import { ApiError } from '../../core/api.service';
import {
  AdminUserApi, CreateUserRequest, UpdateUserRequest,
  RateTableApi, RateTableRequest,
  ReferralRuleApi, ReferralRuleRequest,
  AuthorityRuleApi, AuthorityRuleRequest,
  SystemParameterApi, HolidayApi,
  TradeApi, TeamApi
} from '../../core/models';

type AdminTab = 'users' | 'rateTables' | 'referralRules' | 'authorityRules' | 'parameters' | 'holidays';

export const ROLE_OPTIONS = ['Underwriter', 'UnderwritingManager', 'BrokerOps', 'ClaimsHandler', 'Admin'];
export const AUTHORITY_ROLE_OPTIONS = ['Underwriter', 'UnderwritingManager'];
export const LOB_OPTIONS = ['Property', 'Liability', 'ProfessionalIndemnity'];

@Component({
  selector: 'apex-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  activeTab: AdminTab = 'users';
  roleOptions = ROLE_OPTIONS;
  authorityRoleOptions = AUTHORITY_ROLE_OPTIONS;
  lobOptions = LOB_OPTIONS;

  // Users
  users: AdminUserApi[] = [];
  usersLoading = true;
  usersError: string | null = null;
  usersSearch = '';
  teams: TeamApi[] = [];
  editingUserId: number | null = null;
  showNewUserForm = false;
  userForm: CreateUserRequest & UpdateUserRequest = this.blankUserForm();
  userSaving = false;
  userFormError: string | null = null;

  // Rate tables
  rateTables: RateTableApi[] = [];
  rateTablesLoading = true;
  rateTablesError: string | null = null;
  trades: TradeApi[] = [];
  rateTableForm: RateTableRequest = this.blankRateTableForm();
  rateTableSaving = false;
  rateTableFormError: string | null = null;

  // Referral rules
  referralRules: ReferralRuleApi[] = [];
  referralRulesLoading = true;
  referralRulesError: string | null = null;
  referralRuleForm: ReferralRuleRequest = this.blankReferralRuleForm();
  referralRuleSaving = false;
  referralRuleFormError: string | null = null;

  // Authority rules
  authorityRules: AuthorityRuleApi[] = [];
  authorityRulesLoading = true;
  authorityRulesError: string | null = null;
  authorityRuleForm: AuthorityRuleRequest = this.blankAuthorityRuleForm();
  authorityRuleSaving = false;
  authorityRuleFormError: string | null = null;

  // Parameters
  parameters: SystemParameterApi[] = [];
  parametersLoading = true;
  parametersError: string | null = null;
  editingParamKey: string | null = null;
  paramEditValue = '';
  paramSaving = false;

  // Holidays
  holidays: HolidayApi[] = [];
  holidaysLoading = true;
  holidaysError: string | null = null;
  holidayForm = { holidayDate: '', description: '', countryCode: 'GB' };
  holidaySaving = false;
  holidayFormError: string | null = null;

  constructor(private adminService: AdminService, public auth: AuthService) {}

  ngOnInit(): void {
    this.loadUsers();
    this.loadTeams();
    this.loadTrades();
    this.loadRateTables();
    this.loadReferralRules();
    this.loadAuthorityRules();
    this.loadParameters();
    this.loadHolidays();
  }

  setTab(tab: AdminTab): void {
    this.activeTab = tab;
  }

  get canEdit(): boolean {
    return this.auth.hasRole('Admin');
  }

  // ---------- Users ----------

  private blankUserForm(): CreateUserRequest & UpdateUserRequest {
    return { username: '', email: '', fullName: '', password: '', role: 'Underwriter', teamId: undefined, authorityLimit: 0, isActive: true };
  }

  loadUsers(): void {
    this.usersLoading = true;
    this.usersError = null;
    this.adminService.listUsers().subscribe(
      (users: AdminUserApi[]) => { this.users = users; this.usersLoading = false; },
      (err: ApiError) => { this.usersError = err.message; this.usersLoading = false; }
    );
  }

  loadTeams(): void {
    this.adminService.listTeams().subscribe(
      (teams: TeamApi[]) => { this.teams = teams; },
      () => { this.teams = []; }
    );
  }

  get filteredUsers(): AdminUserApi[] {
    const term = this.usersSearch.trim().toLowerCase();
    if (!term) { return this.users; }
    return this.users.filter(u =>
      (u.username || '').toLowerCase().indexOf(term) !== -1 ||
      (u.fullName || '').toLowerCase().indexOf(term) !== -1 ||
      (u.email || '').toLowerCase().indexOf(term) !== -1
    );
  }

  startNewUser(): void {
    this.editingUserId = null;
    this.userForm = this.blankUserForm();
    this.userFormError = null;
    this.showNewUserForm = true;
  }

  startEditUser(user: AdminUserApi): void {
    this.editingUserId = user.id;
    this.userForm = {
      username: user.username, email: user.email, fullName: user.fullName, password: '',
      role: user.role, teamId: user.teamId, authorityLimit: user.authorityLimit, isActive: user.isActive
    };
    this.userFormError = null;
    this.showNewUserForm = true;
  }

  cancelUserForm(): void {
    this.showNewUserForm = false;
    this.editingUserId = null;
    this.userFormError = null;
  }

  saveUser(): void {
    if (!this.userForm.email || !this.userForm.fullName || (!this.editingUserId && (!this.userForm.username || !this.userForm.password))) {
      this.userFormError = 'Please fill in all required fields.';
      return;
    }
    this.userSaving = true;
    this.userFormError = null;

    const onError = (err: ApiError) => { this.userFormError = err.message; this.userSaving = false; };
    const onSuccess = () => { this.userSaving = false; this.showNewUserForm = false; this.editingUserId = null; this.loadUsers(); };

    if (this.editingUserId) {
      const req: UpdateUserRequest = {
        id: this.editingUserId, email: this.userForm.email, fullName: this.userForm.fullName,
        role: this.userForm.role, teamId: this.userForm.teamId, authorityLimit: this.userForm.authorityLimit,
        isActive: this.userForm.isActive
      };
      this.adminService.updateUser(this.editingUserId, req).subscribe(onSuccess, onError);
    } else {
      const req: CreateUserRequest = {
        username: this.userForm.username, email: this.userForm.email, fullName: this.userForm.fullName,
        password: this.userForm.password, role: this.userForm.role, teamId: this.userForm.teamId,
        authorityLimit: this.userForm.authorityLimit
      };
      this.adminService.createUser(req).subscribe(onSuccess, onError);
    }
  }

  deactivateUser(user: AdminUserApi): void {
    if (!window.confirm(`Deactivate ${user.fullName || user.username}?`)) { return; }
    this.adminService.deactivateUser(user.id).subscribe(
      () => this.loadUsers(),
      (err: ApiError) => { this.usersError = err.message; }
    );
  }

  teamName(teamId?: number): string {
    if (!teamId) { return '—'; }
    const team = this.teams.find(t => t.id === teamId);
    return team ? team.name : `#${teamId}`;
  }

  // ---------- Rate tables ----------

  private blankRateTableForm(): RateTableRequest {
    return { lineOfBusiness: 'Property', tradeId: undefined, baseRatePer1000: 0, minPremium: 0, isActive: true };
  }

  loadTrades(): void {
    this.adminService.listTrades().subscribe(
      (trades: TradeApi[]) => { this.trades = trades; },
      () => { this.trades = []; }
    );
  }

  loadRateTables(): void {
    this.rateTablesLoading = true;
    this.rateTablesError = null;
    this.adminService.listRateTables().subscribe(
      (rows: RateTableApi[]) => { this.rateTables = rows; this.rateTablesLoading = false; },
      (err: ApiError) => { this.rateTablesError = err.message; this.rateTablesLoading = false; }
    );
  }

  saveRateTable(): void {
    this.rateTableSaving = true;
    this.rateTableFormError = null;
    this.adminService.saveRateTable(this.rateTableForm).subscribe(
      () => { this.rateTableSaving = false; this.rateTableForm = this.blankRateTableForm(); this.loadRateTables(); },
      (err: ApiError) => { this.rateTableFormError = err.message; this.rateTableSaving = false; }
    );
  }

  editRateTable(row: RateTableApi): void {
    this.rateTableForm = {
      id: row.id, lineOfBusiness: row.lineOfBusiness, tradeId: row.tradeId,
      baseRatePer1000: row.baseRatePer1000, minPremium: row.minPremium, isActive: row.isActive
    };
  }

  cancelRateTableEdit(): void {
    this.rateTableForm = this.blankRateTableForm();
  }

  // ---------- Referral rules ----------

  private blankReferralRuleForm(): ReferralRuleRequest {
    return {
      lineOfBusiness: 'Property', tradeId: undefined, minSumInsured: undefined, maxSumInsured: undefined,
      minLimit: undefined, maxLimit: undefined, triggersOnRestrictedTrade: false, reason: '', isActive: true
    };
  }

  loadReferralRules(): void {
    this.referralRulesLoading = true;
    this.referralRulesError = null;
    this.adminService.listReferralRules().subscribe(
      (rows: ReferralRuleApi[]) => { this.referralRules = rows; this.referralRulesLoading = false; },
      (err: ApiError) => { this.referralRulesError = err.message; this.referralRulesLoading = false; }
    );
  }

  saveReferralRule(): void {
    if (!this.referralRuleForm.reason) {
      this.referralRuleFormError = 'Please provide a reason for this referral rule.';
      return;
    }
    this.referralRuleSaving = true;
    this.referralRuleFormError = null;
    this.adminService.saveReferralRule(this.referralRuleForm).subscribe(
      () => { this.referralRuleSaving = false; this.referralRuleForm = this.blankReferralRuleForm(); this.loadReferralRules(); },
      (err: ApiError) => { this.referralRuleFormError = err.message; this.referralRuleSaving = false; }
    );
  }

  editReferralRule(row: ReferralRuleApi): void {
    this.referralRuleForm = {
      id: row.id, lineOfBusiness: row.lineOfBusiness, tradeId: row.tradeId,
      minSumInsured: row.minSumInsured, maxSumInsured: row.maxSumInsured,
      minLimit: row.minLimit, maxLimit: row.maxLimit,
      triggersOnRestrictedTrade: row.triggersOnRestrictedTrade, reason: row.reason, isActive: row.isActive
    };
  }

  cancelReferralRuleEdit(): void {
    this.referralRuleForm = this.blankReferralRuleForm();
  }

  // ---------- Authority rules ----------

  private blankAuthorityRuleForm(): AuthorityRuleRequest {
    return {
      role: 'Underwriter', lineOfBusiness: 'Property',
      maxPremium: 50000, maxSumInsured: 2000000, maxLimit: 2000000, isActive: true
    };
  }

  loadAuthorityRules(): void {
    this.authorityRulesLoading = true;
    this.authorityRulesError = null;
    this.adminService.listAuthorityRules().subscribe(
      (rows: AuthorityRuleApi[]) => { this.authorityRules = rows; this.authorityRulesLoading = false; },
      (err: ApiError) => { this.authorityRulesError = err.message; this.authorityRulesLoading = false; }
    );
  }

  saveAuthorityRule(): void {
    this.authorityRuleSaving = true;
    this.authorityRuleFormError = null;
    this.adminService.saveAuthorityRule(this.authorityRuleForm).subscribe(
      () => {
        this.authorityRuleSaving = false;
        this.authorityRuleForm = this.blankAuthorityRuleForm();
        this.loadAuthorityRules();
      },
      (err: ApiError) => { this.authorityRuleFormError = err.message; this.authorityRuleSaving = false; }
    );
  }

  editAuthorityRule(row: AuthorityRuleApi): void {
    this.authorityRuleForm = {
      id: row.id, role: row.role, lineOfBusiness: row.lineOfBusiness,
      maxPremium: row.maxPremium, maxSumInsured: row.maxSumInsured,
      maxLimit: row.maxLimit, isActive: row.isActive
    };
  }

  cancelAuthorityRuleEdit(): void {
    this.authorityRuleForm = this.blankAuthorityRuleForm();
  }

  // ---------- Parameters ----------

  loadParameters(): void {
    this.parametersLoading = true;
    this.parametersError = null;
    this.adminService.listParameters().subscribe(
      (rows: SystemParameterApi[]) => { this.parameters = rows; this.parametersLoading = false; },
      (err: ApiError) => { this.parametersError = err.message; this.parametersLoading = false; }
    );
  }

  startEditParam(param: SystemParameterApi): void {
    this.editingParamKey = param.key;
    this.paramEditValue = param.value;
  }

  cancelEditParam(): void {
    this.editingParamKey = null;
    this.paramEditValue = '';
  }

  saveParam(param: SystemParameterApi): void {
    this.paramSaving = true;
    this.adminService.saveParameter(param.key, this.paramEditValue, param.description, param.dataType).subscribe(
      () => { this.paramSaving = false; this.editingParamKey = null; this.loadParameters(); },
      (err: ApiError) => { this.parametersError = err.message; this.paramSaving = false; }
    );
  }

  // ---------- Holidays ----------

  loadHolidays(): void {
    this.holidaysLoading = true;
    this.holidaysError = null;
    this.adminService.listHolidays().subscribe(
      (rows: HolidayApi[]) => {
        this.holidays = rows.slice().sort((a, b) => a.holidayDate.localeCompare(b.holidayDate));
        this.holidaysLoading = false;
      },
      (err: ApiError) => { this.holidaysError = err.message; this.holidaysLoading = false; }
    );
  }

  addHoliday(): void {
    if (!this.holidayForm.holidayDate || !this.holidayForm.description) {
      this.holidayFormError = 'Please provide a date and description.';
      return;
    }
    this.holidaySaving = true;
    this.holidayFormError = null;
    this.adminService.addHoliday(this.holidayForm.holidayDate, this.holidayForm.description, this.holidayForm.countryCode).subscribe(
      () => {
        this.holidaySaving = false;
        this.holidayForm = { holidayDate: '', description: '', countryCode: 'GB' };
        this.loadHolidays();
      },
      (err: ApiError) => { this.holidayFormError = err.message; this.holidaySaving = false; }
    );
  }
}
