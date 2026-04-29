const mysql = require('mysql2');
require('dotenv').config();

// Use Railway's MySQL URL
const connectionString = process.env.MYSQL_URL || 
                        process.env.DATABASE_URL || 
                        `mysql://${process.env.MYSQLUSER}:${process.env.MYSQLPASSWORD}@${process.env.MYSQLHOST}:${process.env.MYSQLPORT}/${process.env.MYSQLDATABASE}`;

const pool = mysql.createPool(connectionString).promise();

module.exports = pool;
