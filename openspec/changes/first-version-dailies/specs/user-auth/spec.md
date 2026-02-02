## ADDED Requirements

### Requirement: User can sign in via Supabase Auth
The system SHALL allow a user to sign in using Supabase Auth. Sign-in SHALL use the Supabase Auth API only; the system MUST NOT implement custom sign-in logic.

#### Scenario: Successful sign-in
- **WHEN** the user submits valid credentials on the sign-in page
- **THEN** the system authenticates the user via Supabase Auth and establishes a session

#### Scenario: Sign-in with invalid credentials
- **WHEN** the user submits invalid credentials on the sign-in page
- **THEN** the system MUST NOT establish a session and MUST indicate sign-in failure

### Requirement: User can sign up via Supabase Auth
The system SHALL allow a new user to sign up using Supabase Auth. Sign-up SHALL use the Supabase Auth API only; the system MUST NOT implement custom sign-up logic.

#### Scenario: Successful sign-up
- **WHEN** the user submits valid sign-up data on the sign-up page
- **THEN** the system creates the account via Supabase Auth and establishes a session

### Requirement: User can sign out
The system SHALL allow an authenticated user to sign out. Sign-out SHALL invalidate the session via Supabase Auth.

#### Scenario: Sign-out
- **WHEN** the authenticated user triggers sign-out
- **THEN** the system MUST invalidate the session and the user MUST no longer be considered authenticated

### Requirement: Protected routes require authentication
All app routes that represent the journal experience (e.g. the editor) MUST require an authenticated user. The system SHALL redirect an unauthenticated user to the sign-in page when they attempt to access a protected route.

#### Scenario: Unauthenticated access to protected route
- **WHEN** an unauthenticated user navigates to a protected route
- **THEN** the system MUST redirect the user to the sign-in (or sign-up) page and MUST NOT render protected content

#### Scenario: Authenticated access to protected route
- **WHEN** an authenticated user navigates to a protected route
- **THEN** the system MUST render the protected content

### Requirement: Authenticated user on sign-in page is redirected
When an authenticated user visits the sign-in or sign-up page, the system SHALL redirect them to the editor (or primary app route) so they do not remain on the auth page.

#### Scenario: Authenticated user visits sign-in page
- **WHEN** an authenticated user navigates to the sign-in or sign-up page
- **THEN** the system MUST redirect the user to the editor (primary app) route
