
const { spawn } = require('child_process');
const path = require('path');

// Start the backend server
const server = spawn('node', [path.join(__dirname, 'server.js')], {
  stdio: 'inherit',
  shell: true
});

console.log('Starting server...');

// Handle server process events
server.on('error', (error) => {
  console.error('Server error:', error);
});

server.on('exit', (code) => {
  console.log(`Server exited with code ${code}`);
});

// This allows signals like SIGTERM to be passed to child processes properly
process.on('SIGINT', () => {
  server.kill('SIGINT');
  process.exit();
});

process.on('SIGTERM', () => {
  server.kill('SIGTERM');
  process.exit();
});
