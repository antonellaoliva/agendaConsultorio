const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'by62i47p3qjbnexxa36y-mysql.services.clever-cloud.com',
  user: 'u7xrfbccis2wmgfb',
  password: 'kRMxIb6RSfeLJKhBusbf',
  database: 'by62i47p3qjbnexxa36y',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});


module.exports = pool;


