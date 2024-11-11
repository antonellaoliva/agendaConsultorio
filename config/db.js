require('dotenv').config(); 

const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'bar6ish29esfnipb8osk-mysql.services.clever-cloud.com',       
  user: 'ukmunm3qiegba0tw',
  password: 'swozAuG062Sx8bOZoOdv',
  database: 'bar6ish29esfnipb8osk',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;


// const mysql = require('mysql2/promise');

// const pool = mysql.createPool({
//   host: 'localhost',
//   user: 'root',
//   password: '',
//   database: 'ac',
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0
// });


// module.exports = pool;
