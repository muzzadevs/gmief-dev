
// Simple script to start the server
const { spawn } = require('child_process');
const path = require('path');

console.log('Starting GMIEF server...');

// Run the server
const server = spawn('node', ['server/server.js'], {
  stdio: 'inherit',
  shell: true
});

server.on('error', (error) => {
  console.error('Server error:', error);
});

server.on('exit', (code) => {
  console.log(`Server exited with code ${code}`);
});

process.on('SIGINT', () => {
  server.kill('SIGINT');
  process.exit();
});
