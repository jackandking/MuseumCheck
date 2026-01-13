#!/usr/bin/env node
const { spawn } = require('child_process');
const path = require('path');

const args = process.argv.slice(2);
const mode = args[0] || 'default';

const modes = {
  default: { command: 'npx', args: ['playwright', 'test', 'e2e/sanity.spec.ts'], description: 'Run full sanity suite' },
  watch:   { command: 'npx', args: ['playwright', 'test', 'e2e/sanity.spec.ts', '--ui'], description: 'Run in watch mode' },
  ci:      { command: 'npx', args: ['playwright', 'test', 'e2e/sanity.spec.ts', '--reporter=html,json,list', '--retries=2'], description: 'Run in CI mode' },
  mobile:  { command: 'npx', args: ['playwright', 'test', 'e2e/sanity.spec.ts', '--project=mobile-chrome', '--project=mobile-safari'], description: 'Run mobile-only tests' },
  debug:   { command: 'npx', args: ['playwright', 'test', 'e2e/sanity.spec.ts', '--debug', '--headed'], description: 'Debug mode with browser visible' },
  quick:   { command: 'npx', args: ['playwright', 'test', 'e2e/sanity.spec.ts', '--project=chromium', '--grep=SANITY-0[1-4]'], description: 'Quick smoke: homepage+modal' },
};

if (!modes[mode]) {
  console.log('Usage: node scripts/run-sanity-agent.js [default|watch|ci|mobile|debug|quick]');
  process.exit(0);
}

const config = modes[mode];
console.log(`🚀 Starting E2E Sanity Tests in ${mode.toUpperCase()} mode...`);
console.log(`📝 ${config.description}`);

const testProcess = spawn(config.command, config.args, {
  cwd: path.resolve(__dirname, '..'),
  stdio: 'inherit',
  shell: true,
});

testProcess.on('error', (error) => {
  console.error('❌ Failed to start test process:', error);
  process.exit(1);
});

testProcess.on('close', (code) => {
  if (code === 0) console.log('✅ All sanity tests passed!');
  else console.log('❌ Some tests failed. Exit code:', code);
  process.exit(code);
});
