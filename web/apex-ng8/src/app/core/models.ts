/**
 * Shared TypeScript models mirroring the ApexInsurance API's actual JSON
 * contracts (see src/ApexInsurance.Api/Controllers + src/ApexInsurance.Api/Models
 * + src/ApexInsurance.Services/Dto) so the Angular 8 islands agree on shape
 * with the real backend.
 *
 * NOTE: WebApiConfig.cs configures CamelCasePropertyNamesContractResolver +
 * StringEnumConverter, so every C# `PascalCase` property crosses the wire as
 * `camelCase`, and every enum crosses the wire as its PascalCase *name*
 * (e.g. "NotTakenUp"), never as a number. Interfaces below use camelCase
 * fields and `string` for enum-typed fields.
 */

export const LOB_OPTIONS = ['Property', 'Liability', 'ProfessionalIndemnity'];

export const LOB_LABELS: { [key: string]: string } = {
  Property: 'Property',
  Liability: 'Liability',
  ProfessionalIndemnity: 'Professional Indemnity'
};

export const SUBMISSION_STATUS_LABELS: { [key: string]: string } = {
  Received: 'Received', Triaged: 'Triaged', Quoted: 'Quoted', Referred: 'Referred',
  Bound: 'Bound', Declined: 'Declined', NotTakenUp: 'Not Taken Up'
};

/** Ordinal order of the submission pipeline, used for "has this stage happened yet" checks. */
export const SUBMISSION_STATUS_ORDER: string[] = [
  'Received', 'Triaged', 'Quoted', 'Referred', 'Bound', 'Declined', 'NotTakenUp'
];

export const POLICY_STATUS_LABELS: { [key: string]: string } = {
  Active: 'Active', Cancelled: 'Cancelled', Expired: 'Expired', PendingRenewal: 'Pending Renewal', Renewed: 'Renewed'
};

export const CLAIM_STATUS_LABELS: { [key: string]: string } = {
  Open: 'Open', ReservedForPayment: 'Reserved for Payment', Paid: 'Paid',
  Closed: 'Closed', Declined: 'Declined', Reopened: 'Reopened'
};

export interface ApexUser {
  id: number;
  username: string;
  displayName: string;
  email?: string;
  role: string;
  teamId?: number;
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
}

/* ---------------- Submissions (SubmissionsController / SubmissionViewModels.cs) ---------------- */

export interface RiskAnswer {
  id?: number;
  questionCode: string;
  questionText?: string;
  answerText?: string;
  answerNumeric?: number;
}

export interface Submission {
  id: number;
  submissionNumber: string;
  brokerId: number;
  brokerName?: string;
  insuredId: number;
  insuredName?: string;
  lineOfBusiness: string;
  status: string;
  targetPremium?: number;
  requestedEffectiveDate: string;
  receivedDate: string;
  underwriterUserId?: number;
  underwriterName?: string;
  dueDate?: string;
  assignedDate?: string;
  renewedFromPolicyId?: number;
  notes?: string;
  riskAnswers?: RiskAnswer[];
}

/* ---------------- Quotes (QuotesController / QuoteDto.cs) ---------------- */

export interface PremiumBreakdown {
  basePremium?: number;
  loadings?: number;
  taxes?: number;
  [key: string]: any;
}

export interface Quote {
  id: number;
  submissionId: number;
  quoteNumber: string;
  versionNumber: number;
  isSelected: boolean;
  sumInsured: number;
  limitOfIndemnity: number;
  deductible: number;
  grossPremium: number;
  netPremium: number;
  commissionAmount: number;
  isReferralRequired: boolean;
  referralReason?: string;
  referralDecision: string;
  createdDate: string;
  expiryDate: string;
  breakdown?: PremiumBreakdown;
}

/* ---------------- Policies (PoliciesController / PolicyDto.cs) ---------------- */

export interface Policy {
  id: number;
  policyNumber: string;
  submissionId: number;
  brokerId: number;
  brokerName?: string;
  insuredId: number;
  insuredName?: string;
  lineOfBusiness: string;
  status: string;
  effectiveDate: string;
  expiryDate: string;
  grossPremium: number;
  netPremium: number;
  sumInsured: number;
  limitOfIndemnity: number;
  deductible: number;
  boundDate?: string;
}

/* ---------------- Claims (ClaimsController / ClaimDto.cs) ---------------- */

export interface Claim {
  id: number;
  claimNumber: string;
  policyId: number;
  policyNumber?: string;
  insuredId: number;
  insuredName?: string;
  brokerId: number;
  brokerName?: string;
  dateOfLoss: string;
  dateReported: string;
  description: string;
  status: string;
  reserveAmount: number;
  paidAmount: number;
  incurred?: number;
  handlerUserId?: number;
  handlerName?: string;
  closedDate?: string;
}

/* ---------------- Documents (DocumentsController / DocumentDto.cs) ---------------- */

export interface DocumentItem {
  id: number;
  fileName: string;
  contentType?: string;
  fileSizeBytes: number;
  documentType: string;
  submissionId?: number;
  policyId?: number;
  claimId?: number;
  uploadedByUserId: number;
  uploadedDate: string;
  versionNumber: number;
  isLatestVersion: boolean;
  notes?: string;
}

/* ---------------- Audit (AuditController / AuditDto.cs) ---------------- */

export interface AuditLogItem {
  id: number;
  entityName: string;
  entityId: number;
  action: string;
  userId?: number;
  username?: string;
  timestamp: string;
  oldValue?: string;
  newValue?: string;
  details?: string;
}

export interface NoteItem {
  id?: number;
  author?: string;
  createdAt?: string;
  text: string;
}

/* ==================================================================
 * Aggregate/reporting view models mirroring Dashboard/Modelling/
 * Reports/Admin controllers field-for-field.
 * ================================================================== */

/* ---------------- Dashboard (DashboardController / DashboardDto.cs) ---------------- */

export interface UnderwriterQueues {
  newSubmissions: number;
  referrals: number;
  renewalsDue: number;
  outstandingQuotes: number;
  boundAwaitingDocs: number;
}

export interface DashboardKpis {
  premiumWritten: number;
  premiumTarget: number;
  percentOfTarget: number;
  hitRatio: number;
  averageTurnaroundDays: number;
  boundCount: number;
  declinedCount: number;
}

export interface BrokerPerformanceWidget {
  brokerId: number;
  brokerName: string;
  submissionCount: number;
  quoteCount: number;
  boundCount: number;
  grossWrittenPremium: number;
  hitRatio: number;
}

export interface DashboardSummary {
  queues: UnderwriterQueues;
  kpis: DashboardKpis;
  topBrokers: BrokerPerformanceWidget[];
}

/* ---------------- Modelling (ModellingController) ---------------- */

export interface ExposureRow {
  dimension: string;
  key: string;
  sumInsured: number;
  grossPremium: number;
  policyCount: number;
}

export interface ConcentrationSummary {
  totalSumInsured: number;
  totalGrossPremium: number;
  activePolicyCount: number;
  largestSingleRiskSumInsured: number;
  largestRiskPolicyNumber?: string;
  topLob?: string;
  topLobSharePercent: number;
}

/* ---------------- Reports (ReportsController / ReportingDto.cs) ---------------- */

export interface PremiumVsTargetRow {
  year: number;
  month: number;
  periodLabel: string;
  premiumWritten: number;
  target: number;
  variancePercent: number;
}

export interface BrokerLeagueRow {
  rank: number;
  brokerId: number;
  brokerName: string;
  submissionCount: number;
  boundCount: number;
  hitRatio: number;
  grossWrittenPremium: number;
}

export interface PipelineAgingRow {
  status: string;
  ageBucket: string;
  count: number;
}

export interface LossRatioRow {
  lineOfBusiness: string;
  earnedPremium: number;
  incurredLosses: number;
  lossRatioPercent: number;
}

/* ---------------- Admin (AdminController / AdminDto.cs) ---------------- */

export interface AdminUserApi {
  id: number;
  username: string;
  email: string;
  fullName: string;
  role: string;
  teamId?: number;
  teamName?: string;
  isActive: boolean;
  authorityLimit: number;
  lastLoginDate?: string;
}

export interface CreateUserRequest {
  username: string;
  email: string;
  fullName: string;
  password: string;
  role: string;
  teamId?: number;
  authorityLimit: number;
}

export interface UpdateUserRequest {
  id?: number;
  email: string;
  fullName: string;
  role: string;
  teamId?: number;
  authorityLimit: number;
  isActive: boolean;
}

export interface TradeApi {
  id: number;
  code: string;
  name: string;
  riskCategory: string;
  isRestricted: boolean;
  loadingPercent: number;
}

export interface TeamApi {
  id: number;
  name: string;
  description?: string;
  managerUserId?: number;
  managerName?: string;
  isActive: boolean;
  memberCount: number;
}

export interface RateTableApi {
  id: number;
  lineOfBusiness: string;
  tradeId?: number;
  tradeName?: string;
  baseRatePer1000: number;
  minPremium: number;
  isActive: boolean;
}

export interface RateTableRequest {
  id?: number;
  lineOfBusiness: string;
  tradeId?: number;
  baseRatePer1000: number;
  minPremium: number;
  isActive: boolean;
}

export interface ReferralRuleApi {
  id: number;
  lineOfBusiness: string;
  tradeId?: number;
  tradeName?: string;
  minSumInsured?: number;
  maxSumInsured?: number;
  minLimit?: number;
  maxLimit?: number;
  triggersOnRestrictedTrade: boolean;
  reason: string;
  isActive: boolean;
}

export interface ReferralRuleRequest {
  id?: number;
  lineOfBusiness: string;
  tradeId?: number;
  minSumInsured?: number;
  maxSumInsured?: number;
  minLimit?: number;
  maxLimit?: number;
  triggersOnRestrictedTrade: boolean;
  reason: string;
  isActive: boolean;
}

export interface AuthorityRuleApi {
  id: number;
  role: string;
  lineOfBusiness: string;
  maxPremium: number;
  maxSumInsured: number;
  maxLimit: number;
  isActive: boolean;
}

export interface AuthorityRuleRequest {
  id?: number;
  role: string;
  lineOfBusiness: string;
  maxPremium: number;
  maxSumInsured: number;
  maxLimit: number;
  isActive: boolean;
}

export interface SystemParameterApi {
  id: number;
  key: string;
  value: string;
  description?: string;
  dataType?: string;
}

export interface HolidayApi {
  id: number;
  holidayDate: string;
  description: string;
  countryCode?: string;
}
