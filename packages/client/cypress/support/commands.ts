/**
 * Typed Cypress custom commands for this project.
 * This file is an ES module (export {}) so the `declare global` augmentation is allowed.
 */

export {}; // make this file a module for the `declare global` block to work

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Login using credentials; defaults are used when no args provided.
       */
      login(email?: string, password?: string): Chainable;

      /**
       * Convenience commands to log in as roles used in tests.
       */
      loginAsInvestor(): Chainable;
      loginAsAdmin(): Chainable;
      loginAsCollector(): Chainable;
    }
  }
}

// Implementation of the commands
Cypress.Commands.add('login', (email?: string, password?: string) => {
  const userEmail = email ?? 'client@demo.com';
  const pwd = password ?? 'password';

  // ensure fields exist and then type
  cy.get('input[name="email"]').clear().type(String(userEmail));
  cy.get('input[name="password"]').clear().type(String(pwd));
  cy.get('button[type="submit"]').click();
});

Cypress.Commands.add('loginAsInvestor', () => {
  cy.login('investor@test.com', 'InvestorPass123!');
});

Cypress.Commands.add('loginAsAdmin', () => {
  cy.login('admin@test.com', 'AdminPass123!');
});

Cypress.Commands.add('loginAsCollector', () => {
  cy.login('collector@test.com', 'CollectorPass123!');
});
