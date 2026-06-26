interface ForumFixture {
  comment: Record<string, unknown>;
  leaderboards: Array<Record<string, unknown>>;
  otherUser: Record<string, unknown>;
  thread: Record<string, unknown> & { id: string; upVotesBy: string[]; downVotesBy: string[] };
  user: Record<string, unknown> & { id: string };
}

const API_BASE_URL = 'https://forum-api.dicoding.dev/v1';

function success<T extends Record<string, unknown>>(data: T, message = 'success') {
  return {
    body: {
      data,
      message,
      status: 'success',
    },
  };
}

function buildDetail(fixture: ForumFixture) {
  return {
    ...fixture.thread,
    owner: fixture.otherUser,
    comments: [fixture.comment],
  };
}

Cypress.Commands.add('mockForumApi', () => {
  cy.fixture<ForumFixture>('forum').then((fixture) => {
    cy.intercept('GET', `${API_BASE_URL}/threads`, success({ threads: [fixture.thread] })).as(
      'getThreads',
    );
    cy.intercept(
      'GET',
      `${API_BASE_URL}/users`,
      success({ users: [fixture.user, fixture.otherUser] }),
    ).as('getUsers');
    cy.intercept(
      'POST',
      `${API_BASE_URL}/login`,
      success({ token: 'token-e2e' }, 'login success'),
    ).as('login');
    cy.intercept('GET', `${API_BASE_URL}/users/me`, success({ user: fixture.user })).as('getMe');
    cy.intercept(
      'POST',
      `${API_BASE_URL}/register`,
      success({ user: fixture.user }, 'register success'),
    ).as('register');
    cy.intercept('GET', `${API_BASE_URL}/threads/${fixture.thread.id}`, (req) => {
      req.reply(success({ detailThread: buildDetail(fixture) }));
    }).as('getThreadDetail');
    cy.intercept('POST', `${API_BASE_URL}/threads`, (req) => {
      const body = req.body as { body: string; category: string; title: string };

      req.reply(
        success(
          {
            thread: {
              ...fixture.thread,
              body: body.body,
              category: body.category,
              id: 'thread-created-e2e',
              ownerId: fixture.user.id,
              title: body.title,
              totalComments: 0,
            },
          },
          'thread created',
        ),
      );
    }).as('createThread');
    cy.intercept('POST', `${API_BASE_URL}/threads/${fixture.thread.id}/comments`, (req) => {
      const body = req.body as { content: string };

      req.reply(
        success(
          {
            comment: {
              ...fixture.comment,
              content: body.content,
              id: 'comment-created-e2e',
              owner: fixture.user,
            },
          },
          'comment created',
        ),
      );
    }).as('createComment');
    cy.intercept(
      'POST',
      `${API_BASE_URL}/threads/${fixture.thread.id}/up-vote`,
      success({ voteType: 1 }, 'thread up voted'),
    ).as('upVoteThread');
    cy.intercept(
      'POST',
      `${API_BASE_URL}/threads/${fixture.thread.id}/down-vote`,
      success({ voteType: -1 }, 'thread down voted'),
    ).as('downVoteThread');
    cy.intercept(
      'POST',
      `${API_BASE_URL}/threads/${fixture.thread.id}/neutral-vote`,
      success({ voteType: 0 }, 'thread neutral voted'),
    ).as('neutralVoteThread');
    cy.intercept(
      'POST',
      `${API_BASE_URL}/threads/${fixture.thread.id}/comments/comment-e2e-1/up-vote`,
      success({ voteType: 1 }, 'comment up voted'),
    ).as('upVoteComment');
    cy.intercept(
      'POST',
      `${API_BASE_URL}/threads/${fixture.thread.id}/comments/comment-e2e-1/down-vote`,
      success({ voteType: -1 }, 'comment down voted'),
    ).as('downVoteComment');
    cy.intercept(
      'POST',
      `${API_BASE_URL}/threads/${fixture.thread.id}/comments/comment-e2e-1/neutral-vote`,
      success({ voteType: 0 }, 'comment neutral voted'),
    ).as('neutralVoteComment');
    cy.intercept(
      'GET',
      `${API_BASE_URL}/leaderboards`,
      success({ leaderboards: fixture.leaderboards }),
    ).as('getLeaderboards');
  });
});

Cypress.Commands.add('loginByApi', () => {
  cy.visit('/', {
    onBeforeLoad(win) {
      win.localStorage.setItem('forum_access_token', 'token-e2e');
    },
  });
});
