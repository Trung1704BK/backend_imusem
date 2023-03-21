const {DataTypes} = require('sequelize');

const sequelize = require('../util/database');

const Token = sequelize.define('collector_token', {
    token_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    collectorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    token: {
        type: DataTypes.STRING(1024),
        allowNull: false
    },
    expired_time: {
        type: DataTypes.DATE
    },
    status: {
        type: DataTypes.INTEGER
    }
});

module.exports = Token;
