describe('Forum Discussion App E2E', () => {
  beforeEach(() => {
    cy.mockForumApi();
    cy.clearLocalStorage();
  });

  it('login: homepage ke login, submit, redirect home, username tampil', () => {
    cy.visit('/');
    cy.wait(['@getThreads', '@getUsers']);

    cy.contains('a', 'Masuk untuk Buat Thread').click();
    cy.location('pathname').should('eq', '/login');

    cy.get('input[name="email"]').type('e2e@example.test');
    cy.get('input[name="password"]').type('password-e2e');
    cy.contains('button', 'Masuk').click();

    cy.wait(['@login', '@getMe']);
    cy.location('pathname').should('eq', '/');
    cy.contains('button', 'Keluar').should('be.visible');
    cy.contains('body', 'Pengguna E2E').should('exist');
  });

  it('guest guard: akses create thread redirect ke login', () => {
    cy.visit('/threads/new');

    cy.location('pathname').should('eq', '/login');
    cy.contains('Masuk ke akun').should('be.visible');
  });

  it('register: user baru daftar lalu diarahkan ke login', () => {
    cy.visit('/register');

    cy.get('input[name="name"]').type('Pengguna Baru E2E');
    cy.get('input[name="email"]').type('baru-e2e@example.test');
    cy.get('input[name="password"]').type('password-e2e');
    cy.contains('button', 'Daftar').click();

    cy.wait('@register');
    cy.location('pathname').should('eq', '/login');
    cy.contains('Masuk ke akun').should('be.visible');
  });

  it('create thread: user login membuat thread lalu kembali ke home', () => {
    cy.loginByApi();
    cy.wait(['@getMe', '@getThreads', '@getUsers']);

    cy.contains('a', 'Buat Thread').click();
    cy.location('pathname').should('eq', '/threads/new');

    cy.get('input[name="title"]').type('Thread baru dari Cypress');
    cy.get('input[name="category"]').type('cypress');
    cy.get('textarea[name="body"]').type('Isi thread dibuat lewat Cypress.');
    cy.contains('button', 'Buat thread').click();

    cy.wait(['@createThread', '@getThreads', '@getUsers']);
    cy.location('pathname').should('eq', '/');
    cy.contains('Thread Terbaru').should('be.visible');
  });

  it('create comment: user login menulis komentar di detail thread', () => {
    cy.loginByApi();
    cy.wait(['@getMe', '@getThreads', '@getUsers']);

    cy.contains('a', 'Thread E2E React').click();
    cy.wait('@getThreadDetail');

    cy.get('textarea[name="content"]').type('Komentar dibuat lewat Cypress.');
    cy.contains('button', 'Kirim komentar').click();

    cy.wait('@createComment');
    cy.contains('Komentar dibuat lewat Cypress.').should('be.visible');
  });

  it('vote thread dan komentar: up, down, neutral mengubah status/count', () => {
    cy.loginByApi();
    cy.wait(['@getMe', '@getThreads', '@getUsers']);

    cy.visit('/threads/thread-e2e-1');
    cy.wait('@getThreadDetail');

    cy.get('button[aria-label^="Vote suka"]').first().as('threadUpVote').click();
    cy.wait('@upVoteThread');
    cy.get('@threadUpVote').should('have.attr', 'aria-label', 'Vote suka, status saat ini suka');

    cy.get('button[aria-label^="Vote tidak suka"]').first().as('threadDownVote').click();
    cy.wait('@downVoteThread');
    cy.get('@threadDownVote').should(
      'have.attr',
      'aria-label',
      'Vote tidak suka, status saat ini tidak suka',
    );

    cy.get('@threadDownVote').click();
    cy.wait('@neutralVoteThread');
    cy.get('@threadDownVote').should(
      'have.attr',
      'aria-label',
      'Vote tidak suka, status saat ini netral',
    );

    cy.get('button[aria-label^="Vote suka"]').eq(1).as('commentUpVote').click();
    cy.wait('@upVoteComment');
    cy.get('@commentUpVote').should('have.attr', 'aria-label', 'Vote suka, status saat ini suka');

    cy.get('button[aria-label^="Vote tidak suka"]').eq(1).as('commentDownVote').click();
    cy.wait('@downVoteComment');
    cy.get('@commentDownVote').should(
      'have.attr',
      'aria-label',
      'Vote tidak suka, status saat ini tidak suka',
    );

    cy.get('@commentDownVote').click();
    cy.wait('@neutralVoteComment');
    cy.get('@commentDownVote').should(
      'have.attr',
      'aria-label',
      'Vote tidak suka, status saat ini netral',
    );
  });

  it('category filter: pilih kategori lalu reset semua', () => {
    cy.visit('/');
    cy.wait(['@getThreads', '@getUsers']);

    cy.contains('button', 'react').click();
    cy.location('search').should('contain', 'category=react');
    cy.contains('Thread E2E React').should('be.visible');

    cy.contains('button', 'Semua').click();
    cy.location('search').should('eq', '');
    cy.contains('Thread E2E React').should('be.visible');
  });

  it('leaderboard: halaman terbuka dan ranking tampil', () => {
    cy.visit('/leaderboards');
    cy.wait('@getLeaderboards');

    cy.contains('Kontributor Terbaik').should('be.visible');
    cy.contains('Pengguna E2E').should('be.visible');
    cy.contains('120').should('be.visible');
  });

  it('responsive smoke: home, detail, login pada viewport mobile', () => {
    cy.viewport('iphone-x');

    cy.visit('/');
    cy.wait(['@getThreads', '@getUsers']);
    cy.contains('Thread Terbaru').should('be.visible');

    cy.visit('/threads/thread-e2e-1');
    cy.wait('@getThreadDetail');
    cy.contains('Thread E2E React').should('be.visible');

    cy.visit('/login');
    cy.contains('Masuk ke akun').should('be.visible');
  });
});
