# Smoke Tests

This document describes how to run the smoke tests for Inbox Navigator.

## Overview

Smoke tests are lightweight tests that verify critical functionality is working. They test:

- Health check endpoint
- Stripe checkout session creation
- Webhook simulation
- Onboarding data saving
- Dashboard statistics

## Running Smoke Tests

### Prerequisites

1. Ensure all environment variables are set (see `.env.example`)
2. Start the development server: `npm run dev`
3. Ensure the database is accessible

### Local Development

```bash
# Start the development server
npm run dev

# In another terminal, run smoke tests
npm run smoke
```

### CI/CD

Smoke tests run automatically in GitHub Actions on every push and pull request.

## Test Environment

For CI/CD, the following environment variables are set:

```bash
DATABASE_URL="postgresql://test:test@localhost:5432/test"
STRIPE_SECRET_KEY="sk_test_dummy"
STRIPE_WEBHOOK_SECRET="whsec_dummy"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_dummy"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NODE_ENV="test"
```

## Test Results

The smoke tests will output:

- ✅ Passed tests with duration
- ❌ Failed tests with error messages
- 📊 Summary with pass/fail counts and total duration

## Adding New Tests

To add a new smoke test:

1. Add a new test method to the `SmokeTester` class in `scripts/smoke.ts`
2. Call the test method in `runAllTests()`
3. Follow the existing pattern for error handling and logging

Example:

```typescript
async testNewFeature(): Promise<void> {
  const response = await fetch(`${BASE_URL}/api/new-feature`);
  if (!response.ok) {
    throw new Error(`New feature test failed: ${response.status}`);
  }
  const data = await response.json();
  if (!data.expectedField) {
    throw new Error('New feature returned unexpected data');
  }
}
```

## Troubleshooting

### Common Issues

1. **Database Connection**: Ensure `DATABASE_URL` is correctly set
2. **Stripe Keys**: Ensure Stripe keys are valid (even test keys)
3. **Server Not Running**: Ensure `npm run dev` is running before tests
4. **Port Conflicts**: Ensure port 3000 is available

### Debug Mode

For more detailed logging, set:

```bash
NODE_ENV=development npm run smoke
```

This will show additional debug information from the application.
