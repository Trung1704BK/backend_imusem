require('dotenv/config');
const {Sequelize} = require('sequelize');

const {DB_HOST, DB_PASSWORD, DB_USERNAME, DB_CONNECTION, DB_DATABASE, DB_PORT} = process.env;

const sequelize = new Sequelize(DB_DATABASE, DB_USERNAME, DB_PASSWORD, {
    dialect: DB_CONNECTION, host: DB_HOST, port: DB_PORT
});

module.exports = sequelize;
