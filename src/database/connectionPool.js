const { Pool } = require("pg");
const { DB_CONFIG } = require("../../configs/config");

require("dotenv").config();
const connectionString = process.env.URL_DB_POSTGRES;

const pool = new Pool({
  connectionString, ssl: true,
  max: 90,
  allowExitOnIdle: true
}); // creo pool de conexiones

// EVENTOS DEL POOL
pool.on("connect", function (connection) {
  // evento cuando se crea una nueva conexion
  // console.log(new Date(), `📸 ✔️ Picmont: Created new client,count:  ${pool.totalCount}`)
  connection.on('error', function (err) {
    //console.log('Error in cliente');
  })
});

pool.on("error", function (err) {
  // console.log(`📸 ERROR: ${err.message} `);
});

pool.on("acquire", function (connection) {
  // evento cuando se obtiene una conexion existente
  //console.log("📸 Connection has been acquired", pool.totalCount);
});

pool.on("release", function (connection) {
  //console.log("📸 Connection has been released");
});

module.exports = pool;
