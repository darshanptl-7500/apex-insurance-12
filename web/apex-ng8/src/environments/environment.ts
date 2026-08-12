export const environment = {
  production: false,
  apiBaseUrl: 'http://localhost:52840/api',
  // Same origin as the AngularJS shell when hosted under /ng8/ on port 4200.
  shellBaseUrl: '',
  shellLoginPath: '/#!/login',

  /** UW Pricing portal (external). Override for real staging URL. */
  pricingUrl: 'https://example.invalid/pricing',

  /** Shared demo password for seeded accounts with a NULL PasswordHash. */
  demoPassword: 'Password1!',

  /**
   * Clickable demo personas. Keep in sync with web/apex-shell/config.js
   * and database seed users. To add a role: seed the user, then append here.
   */
  demoAccounts: [
    { username: 'uw1',   role: 'Underwriter',          name: 'Uma Underwriter',  home: '/dashboard' },
    { username: 'mgr1',  role: 'Underwriting Manager', name: 'Morgan Manager',   home: '/dashboard' },
    { username: 'bro1',  role: 'Broker Ops',           name: 'Blair Broker Ops', home: '/dashboard' },
    { username: 'cl1',   role: 'Claims Handler',       name: 'Casey Claims',     home: '/dashboard' },
    { username: 'admin', role: 'Admin',                name: 'System Admin',     home: '/admin' }
  ]
};
