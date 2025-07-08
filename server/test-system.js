#!/usr/bin/env node

/**
 * System Testing Script
 * Tests the improved backend functionality
 */

import fetch from 'node-fetch';
import { performance } from 'perf_hooks';

const SERVER_URL = 'http://localhost:3001';

class SystemTester {
  constructor() {
    this.results = {
      passed: 0,
      failed: 0,
      tests: []
    };
  }

  async test(name, testFn) {
    console.log(`\n🧪 Testing: ${name}`);
    const start = performance.now();
    
    try {
      await testFn();
      const duration = performance.now() - start;
      console.log(`✅ PASSED: ${name} (${duration.toFixed(2)}ms)`);
      this.results.passed++;
      this.results.tests.push({ name, status: 'PASSED', duration });
    } catch (error) {
      const duration = performance.now() - start;
      console.log(`❌ FAILED: ${name} (${duration.toFixed(2)}ms)`);
      console.log(`   Error: ${error.message}`);
      this.results.failed++;
      this.results.tests.push({ name, status: 'FAILED', duration, error: error.message });
    }
  }

  async run() {
    console.log('🚀 Starting System Tests...');
    console.log('============================');

    // Test 1: Health Check
    await this.test('Health Check Endpoint', async () => {
      const response = await fetch(`${SERVER_URL}/health`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(`Health check failed: ${response.status}`);
      }
      
      if (!data.status || !data.timestamp) {
        throw new Error('Invalid health check response format');
      }
      
      console.log(`   Status: ${data.status}`);
      console.log(`   Uptime: ${data.uptime}`);
      console.log(`   Environment: ${data.environment}`);
    });

    // Test 2: Performance Metrics
    await this.test('Performance Metrics Endpoint', async () => {
      const response = await fetch(`${SERVER_URL}/api/metrics`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(`Metrics endpoint failed: ${response.status}`);
      }
      
      if (!data.uptime || !data.requests || !data.memory) {
        throw new Error('Invalid metrics response format');
      }
      
      console.log(`   Total Requests: ${data.requests.total}`);
      console.log(`   Success Rate: ${data.requests.successRate}%`);
      console.log(`   Memory Usage: ${data.memory.formatted.heapUsed}`);
    });

    // Test 3: Session Analytics
    await this.test('Session Analytics Endpoint', async () => {
      const response = await fetch(`${SERVER_URL}/api/analytics`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(`Analytics endpoint failed: ${response.status}`);
      }
      
      console.log(`   Total Sessions: ${data.total}`);
      console.log(`   Average Duration: ${data.avgDuration}ms`);
      console.log(`   Phase Types: ${Object.keys(data.phases).length}`);
    });

    // Test 4: Rate Limiting
    await this.test('Rate Limiting', async () => {
      const promises = [];
      
      // Make multiple requests quickly to test rate limiting
      for (let i = 0; i < 15; i++) {
        promises.push(fetch(`${SERVER_URL}/health`));
      }
      
      const responses = await Promise.all(promises);
      const rateLimited = responses.filter(r => r.status === 429);
      
      console.log(`   Made 15 requests, ${rateLimited.length} were rate limited`);
      
      if (rateLimited.length === 0) {
        console.log('   ⚠️  Rate limiting might not be working properly');
      }
    });

    // Test 5: Error Handling
    await this.test('Error Handling', async () => {
      const response = await fetch(`${SERVER_URL}/api/nonexistent-endpoint`);
      
      if (response.status !== 404) {
        throw new Error(`Expected 404, got ${response.status}`);
      }
      
      console.log('   ✅ 404 handling works correctly');
    });

    // Test 6: CORS Headers
    await this.test('CORS Headers', async () => {
      const response = await fetch(`${SERVER_URL}/health`, {
        method: 'OPTIONS'
      });
      
      const corsHeader = response.headers.get('access-control-allow-origin');
      
      if (!corsHeader) {
        throw new Error('CORS headers not present');
      }
      
      console.log(`   CORS Origin: ${corsHeader}`);
    });

    // Test 7: Security Headers
    await this.test('Security Headers', async () => {
      const response = await fetch(`${SERVER_URL}/health`);
      
      const securityHeaders = [
        'x-frame-options',
        'x-content-type-options',
        'x-xss-protection'
      ];
      
      let foundHeaders = 0;
      securityHeaders.forEach(header => {
        if (response.headers.get(header)) {
          foundHeaders++;
        }
      });
      
      console.log(`   Found ${foundHeaders}/${securityHeaders.length} security headers`);
      
      if (foundHeaders === 0) {
        throw new Error('No security headers found');
      }
    });

    // Test Results Summary
    console.log('\n📊 Test Results Summary');
    console.log('========================');
    console.log(`✅ Passed: ${this.results.passed}`);
    console.log(`❌ Failed: ${this.results.failed}`);
    console.log(`📈 Total: ${this.results.passed + this.results.failed}`);
    console.log(`🎯 Success Rate: ${((this.results.passed / (this.results.passed + this.results.failed)) * 100).toFixed(1)}%`);
    
    // Detailed Results
    console.log('\n📋 Detailed Results:');
    this.results.tests.forEach(test => {
      const status = test.status === 'PASSED' ? '✅' : '❌';
      console.log(`${status} ${test.name}: ${test.duration.toFixed(2)}ms`);
      if (test.error) {
        console.log(`   Error: ${test.error}`);
      }
    });

    if (this.results.failed > 0) {
      console.log('\n⚠️  Some tests failed. Please check the server configuration.');
      process.exit(1);
    } else {
      console.log('\n🎉 All tests passed! System is working correctly.');
      process.exit(0);
    }
  }
}

// Check if server is running
async function checkServerStatus() {
  try {
    const response = await fetch(`${SERVER_URL}/health`);
    if (response.ok) {
      console.log('🟢 Server is running and accessible');
      return true;
    } else {
      console.log('🔴 Server is not responding correctly');
      return false;
    }
  } catch (error) {
    console.log('🔴 Server is not running or not accessible');
    console.log('   Please start the server with: npm run dev');
    return false;
  }
}

// Main execution
async function main() {
  console.log('🔍 DevPilotAI System Testing');
  console.log('============================');
  
  const serverRunning = await checkServerStatus();
  
  if (!serverRunning) {
    process.exit(1);
  }
  
  const tester = new SystemTester();
  await tester.run();
}

main().catch(error => {
  console.error('❌ Test execution failed:', error);
  process.exit(1);
});
