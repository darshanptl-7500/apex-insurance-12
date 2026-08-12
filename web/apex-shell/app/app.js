(function () {
    'use strict';

    var apexApp = angular.module('apexApp', ['ngRoute', 'ngAnimate']);

    // Runtime config injected via config.js -> window.APEX_CONFIG
    apexApp.constant('API_BASE_URL', (window.APEX_CONFIG && window.APEX_CONFIG.apiBaseUrl) || 'http://localhost:52840/api');
    apexApp.constant('APEX_CONFIG', window.APEX_CONFIG || {});

    // Lookup tables shared across controllers/views for enum -> label/badge mapping.
    apexApp.constant('APEX_ENUMS', {
        submissionStatus: {
            0: { label: 'Received', badge: 'neutral' },
            1: { label: 'Triaged', badge: 'info' },
            2: { label: 'Quoted', badge: 'gold' },
            3: { label: 'Referred', badge: 'warn' },
            4: { label: 'Bound', badge: 'success' },
            5: { label: 'Declined', badge: 'danger' },
            6: { label: 'Not Taken Up', badge: 'neutral' },
            Received: { label: 'Received', badge: 'neutral' },
            Triaged: { label: 'Triaged', badge: 'info' },
            Quoted: { label: 'Quoted', badge: 'gold' },
            Referred: { label: 'Referred', badge: 'warn' },
            Bound: { label: 'Bound', badge: 'success' },
            Declined: { label: 'Declined', badge: 'danger' },
            NotTakenUp: { label: 'Not Taken Up', badge: 'neutral' }
        },
        submissionPipeline: ['Received', 'Triaged', 'Quoted', 'Bound'],
        policyStatus: {
            0: { label: 'Active', badge: 'success' },
            1: { label: 'Cancelled', badge: 'danger' },
            2: { label: 'Expired', badge: 'neutral' },
            3: { label: 'Pending Renewal', badge: 'warn' },
            Active: { label: 'Active', badge: 'success' },
            Cancelled: { label: 'Cancelled', badge: 'danger' },
            Expired: { label: 'Expired', badge: 'neutral' },
            PendingRenewal: { label: 'Pending Renewal', badge: 'warn' }
        },
        claimStatus: {
            0: { label: 'Open', badge: 'info' },
            1: { label: 'Reserved for Payment', badge: 'gold' },
            2: { label: 'Paid', badge: 'success' },
            3: { label: 'Closed', badge: 'neutral' },
            4: { label: 'Declined', badge: 'danger' },
            5: { label: 'Reopened', badge: 'warn' },
            Open: { label: 'Open', badge: 'info' },
            ReservedForPayment: { label: 'Reserved for Payment', badge: 'gold' },
            Paid: { label: 'Paid', badge: 'success' },
            Closed: { label: 'Closed', badge: 'neutral' },
            Declined: { label: 'Declined', badge: 'danger' },
            Reopened: { label: 'Reopened', badge: 'warn' }
        },
        lineOfBusiness: {
            0: 'Property',
            1: 'Liability',
            2: 'Professional Indemnity',
            Property: 'Property',
            Liability: 'Liability',
            ProfessionalIndemnity: 'Professional Indemnity'
        },
        userRole: {
            0: 'Underwriter',
            1: 'Underwriting Manager',
            2: 'Broker Ops',
            3: 'Claims Handler',
            4: 'Admin'
        },
        documentType: {
            0: 'Proposal Form',
            1: 'Statement of Values',
            2: 'Loss Runs',
            3: 'Schedule',
            4: 'Quote',
            5: 'Policy',
            6: 'Endorsement',
            7: 'Claim Document',
            8: 'Other',
            ProposalForm: 'Proposal Form',
            SOV: 'Statement of Values',
            LossRuns: 'Loss Runs',
            Schedule: 'Schedule',
            Quote: 'Quote',
            Policy: 'Policy',
            Endorsement: 'Endorsement',
            ClaimDoc: 'Claim Document',
            Other: 'Other'
        },
        workflowTaskStatus: {
            0: { label: 'Open', badge: 'neutral' },
            1: { label: 'In Progress', badge: 'info' },
            2: { label: 'Completed', badge: 'success' },
            3: { label: 'Overdue', badge: 'danger' },
            Open: { label: 'Open', badge: 'neutral' },
            InProgress: { label: 'In Progress', badge: 'info' },
            Completed: { label: 'Completed', badge: 'success' },
            Overdue: { label: 'Overdue', badge: 'danger' }
        }
    });
})();
