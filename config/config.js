require('dotenv').config();

const config = {
  csvFilePath: process.env.CSV_FILE_PATH,
  db: {
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'mydatabase',
    password: process.env.DB_PASSWORD || 'password123',
    port: process.env.DB_PORT || 3306,
  }
};

module.exports = config;
