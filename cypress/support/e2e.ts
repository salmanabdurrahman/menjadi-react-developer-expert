import './forumApi';

declare global {
  namespace Cypress {
    interface Chainable {
      mockForumApi(): Chainable<void>;
      loginByApi(): Chainable<void>;
    }
  }
}
