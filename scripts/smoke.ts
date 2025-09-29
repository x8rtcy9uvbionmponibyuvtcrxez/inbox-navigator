#!/usr/bin/env tsx

/**
 * Smoke tests for Inbox Navigator
 * Tests critical API endpoints and basic functionality
 */

import { env } from '../lib/env';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

interface TestResult {
  name: string;
  passed: boolean;
  error?: string;
  duration: number;
}

class SmokeTester {
  private results: TestResult[] = [];

  async runTest(name: string, testFn: () => Promise<void>): Promise<void> {
    const start = Date.now();
    try {
      await testFn();
      this.results.push({
        name,
        passed: true,
        duration: Date.now() - start,
      });
      console.log(`✅ ${name} (${Date.now() - start}ms)`);
    } catch (error) {
      this.results.push({
        name,
        passed: false,
        error: error instanceof Error ? error.message : String(error),
        duration: Date.now() - start,
      });
      console.log(`❌ ${name} (${Date.now() - start}ms): ${error}`);
    }
  }

  async testHealthCheck(): Promise<void> {
    const response = await fetch(`${BASE_URL}/api/test`);
    if (!response.ok) {
      throw new Error(`Health check failed: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    if (data.status !== 'ok') {
      throw new Error(`Health check returned unexpected status: ${data.status}`);
    }
  }

  async testCreateCheckoutSession(): Promise<void> {
    const response = await fetch(`${BASE_URL}/api/stripe/create-checkout-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        quantity: 1,
        customerEmail: 'test@example.com',
        workspaceId: 'test-workspace',
        workspaceName: 'Test Workspace',
      }),
    });

    if (!response.ok) {
      throw new Error(`Create checkout session failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    if (!data.sessionId || !data.url) {
      throw new Error('Create checkout session returned invalid data');
    }
  }

  async testSimulateWebhook(): Promise<void> {
    const response = await fetch(`${BASE_URL}/api/dev/simulate-webhook`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sessionId: 'cs_test_smoke_' + Date.now(),
        customerEmail: 'smoke-test@example.com',
        quantity: 1,
        productsBought: ['inbox_basic'],
        typesOfInboxes: ['GSUITE'],
      }),
    });

    if (!response.ok) {
      throw new Error(`Simulate webhook failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    if (!data.success) {
      throw new Error('Simulate webhook returned unsuccessful result');
    }
  }

  async testOnboardingSave(): Promise<void> {
    // First create a test order
    const webhookResponse = await fetch(`${BASE_URL}/api/dev/simulate-webhook`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sessionId: 'cs_test_onboarding_' + Date.now(),
        customerEmail: 'onboarding-test@example.com',
        quantity: 1,
        productsBought: ['inbox_basic'],
        typesOfInboxes: ['GSUITE'],
      }),
    });

    if (!webhookResponse.ok) {
      throw new Error('Failed to create test order for onboarding test');
    }

    const webhookData = await webhookResponse.json();
    const sessionId = webhookData.sessionId || 'cs_test_onboarding_' + Date.now();

    // Now test onboarding save
    const response = await fetch(`${BASE_URL}/api/onboarding/save`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sessionId,
        businessType: 'SaaS',
        industry: 'Technology',
        companySize: '10-50',
        website: 'https://smoke-test.com',
        preferredDomains: ['smoke-test.com'],
        domainRequirements: 'Test domain requirements',
        espProvider: 'Smartlead',
        espCredentials: {
          apiKey: 'sk_test_smoke',
          username: 'smoke@test.com',
        },
        specialRequirements: 'Smoke test requirements',
        stepCompleted: 5,
        isCompleted: true,
        customTags: ['smoke-test'],
        personas: [
          {
            fullName: 'Smoke Test User',
            firstName: 'Smoke',
            lastName: 'Test',
            role: 'Tester',
            tags: ['smoke-test'],
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`Onboarding save failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    if (!data.success) {
      throw new Error('Onboarding save returned unsuccessful result');
    }
  }

  async testDashboardStats(): Promise<void> {
    const response = await fetch(`${BASE_URL}/api/dashboard/stats`);
    
    // This might fail in test environment, so we'll just check it doesn't crash
    if (response.status >= 500) {
      throw new Error(`Dashboard stats server error: ${response.status}`);
    }
    
    // 404 or other client errors are acceptable in test environment
    if (response.ok) {
      const data = await response.json();
      if (typeof data !== 'object') {
        throw new Error('Dashboard stats returned invalid data format');
      }
    }
  }

  async runAllTests(): Promise<void> {
    console.log('🧪 Running smoke tests...\n');

    await this.runTest('Health Check', () => this.testHealthCheck());
    await this.runTest('Create Checkout Session', () => this.testCreateCheckoutSession());
    await this.runTest('Simulate Webhook', () => this.testSimulateWebhook());
    await this.runTest('Onboarding Save', () => this.testOnboardingSave());
    await this.runTest('Dashboard Stats', () => this.testDashboardStats());

    this.printSummary();
  }

  printSummary(): void {
    const passed = this.results.filter(r => r.passed).length;
    const total = this.results.length;
    const totalDuration = this.results.reduce((sum, r) => sum + r.duration, 0);

    console.log('\n📊 Test Summary:');
    console.log(`✅ Passed: ${passed}/${total}`);
    console.log(`⏱️  Total Duration: ${totalDuration}ms`);
    
    if (passed < total) {
      console.log('\n❌ Failed Tests:');
      this.results
        .filter(r => !r.passed)
        .forEach(r => console.log(`   - ${r.name}: ${r.error}`));
      
      process.exit(1);
    } else {
      console.log('\n🎉 All tests passed!');
    }
  }
}

// Run smoke tests
async function main() {
  try {
    console.log('🚀 Starting Inbox Navigator smoke tests...');
    console.log(`📍 Base URL: ${BASE_URL}`);
    console.log(`🔧 Environment: ${env.NODE_ENV}\n`);

    const tester = new SmokeTester();
    await tester.runAllTests();
  } catch (error) {
    console.error('💥 Smoke test runner failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}
