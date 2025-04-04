
const mysql = require("mysql2");

const pool = mysql.createPool({
  host: "lldn637.servidoresdns.net",
  user: "qakw743",
  password: "Gmief2024!",
  database: "qakw743",
  port: 3306,
});

module.exports = pool.promise(); // Exporta la conexión como una Promesa para usar `async/await`
