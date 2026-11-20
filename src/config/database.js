const { Sequelize } = require('sequelize');
require('dotenv').config();

const isCloud =
  process.env.DB_HOST &&
  process.env.DB_HOST !== 'localhost' &&
  process.env.DB_HOST !== '127.0.0.1';

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    dialectModule: require('mysql2'),
    logging: false,
    dialectOptions: isCloud
      ? {
          ssl: {
            require: true,
            rejectUnauthorized: true,
          },
        }
      : {},
  }
);

module.exports = sequelize;