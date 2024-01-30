import mysql from 'mysql2'
import 'dotenv/config'

const dbConfig = {
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    database: process.env.MYSQL_DB,
    password: process.env.MYSQL_PASS,
};

const connection = mysql.createConnection(dbConfig);
export default connection;