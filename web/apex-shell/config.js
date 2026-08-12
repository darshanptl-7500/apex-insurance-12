/**
 * Runtime configuration for the Apex Insurance portal.
 *
 * To add another demo role:
 *   1. Insert a Users row (NULL password hash → accepts Password1!)
 *   2. Append an entry to demoAccounts below
 */
window.APEX_CONFIG = {
    apiBaseUrl: 'http://localhost:52840/api',

    // Same-origin Angular 8 screens under /ng8.
    ng8BaseUrl: '/ng8',

    ng8Routes: {
        dashboard: '/dashboard',
        caseHub: '/case-hub',
        reporting: '/reporting',
        admin: '/admin',
        modelling: '/modelling'
    },

    /** UW Pricing portal deep-link (external). */
    pricingUrl: 'https://example.invalid/pricing',
    /** Open Box PAS portal — lab mirror in this workbench. */
    openBoxUrl: '/#!/openbox',
    ePlacementUrl: 'https://example.invalid/e-placement',
    selfServiceUrl: 'https://example.invalid/self-service',

    tokenStorageKey: 'apex_token',
    userStorageKey: 'apex_user',

    /** Shared demo password for all seeded accounts with a NULL PasswordHash. */
    demoPassword: 'Password1!',

    /**
     * Clickable demo personas on the login screen.
     * Add a row here whenever you seed a new demo user.
     */
    demoAccounts: [
        { username: 'uw1',   role: 'Underwriter',            name: 'Uma Underwriter',  home: '/pipeline/upcoming' },
        { username: 'mgr1',  role: 'Underwriting Manager',   name: 'Morgan Manager',   home: '/pipeline/referrals' },
        { username: 'bro1',  role: 'Broker Ops',             name: 'Blair Broker Ops', home: '/connect' },
        { username: 'cl1',   role: 'Claims Handler',         name: 'Casey Claims',     home: '/claims' },
        { username: 'admin', role: 'Admin',                  name: 'System Admin',     home: '/pipeline/upcoming' }
    ]
};
