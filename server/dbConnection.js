
const mysql = require("mysql2");

// Configuración de la conexión a la base de datos
const pool = mysql.createPool({
  host: "lldn637.servidoresdns.net",
  user: "qakw743",
  password: "Gmief2024!",
  database: "qakw743",
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Mensaje para confirmar si la conexión se ha establecido correctamente
pool.getConnection((err, connection) => {
  if (err) {
    console.error('Error al conectar con la base de datos:', err);
    return;
  }
  console.log('Conexión a la base de datos establecida correctamente');
  connection.release();
});

module.exports = pool.promise();
