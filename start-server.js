
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('Verificando conexión a la base de datos GMIEF...');

// Comprobar que el archivo de conexión existe
try {
  fs.accessSync(path.join(__dirname, 'server/dbConnection.js'), fs.constants.R_OK);
  console.log('Archivo de conexión a la base de datos encontrado');
} catch (err) {
  console.error('Error: No se pudo encontrar el archivo de conexión a la base de datos');
  process.exit(1);
}

// Iniciar el servidor
const server = spawn('node', [path.join(__dirname, 'server/server.js')], {
  stdio: 'inherit',
  shell: true
});

console.log('Iniciando servidor GMIEF...');

// Manejar eventos del proceso del servidor
server.on('error', (error) => {
  console.error('Error en el servidor:', error);
});

server.on('exit', (code) => {
  if (code !== 0) {
    console.error(`El servidor se detuvo con código de error: ${code}`);
  } else {
    console.log('Servidor detenido correctamente');
  }
});

// Permitir que las señales como SIGTERM se pasen correctamente a los procesos hijos
process.on('SIGINT', () => {
  console.log('Deteniendo el servidor...');
  server.kill('SIGINT');
  process.exit();
});

process.on('SIGTERM', () => {
  console.log('Deteniendo el servidor...');
  server.kill('SIGTERM');
  process.exit();
});
