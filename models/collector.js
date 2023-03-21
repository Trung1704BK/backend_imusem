const {DataTypes} = require('sequelize');

const sequelize = require('../util/database');

const Collector = sequelize.define('collector', {
    collector_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    full_name: {
        type: DataTypes.STRING
    },
    mobile: {
        type: DataTypes.STRING,
    },
    email: {
        type: DataTypes.STRING,
    },
    provinceId: {
        type: DataTypes.INTEGER
    },
    districtId: {
        type: DataTypes.INTEGER
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    address: {
        type: DataTypes.STRING
    },
    sex: {
        type: DataTypes.INTEGER
    },
    avatar: {
        type: DataTypes.STRING
    },
    introduction: {
        type: DataTypes.STRING
    },
    birth_date: {
        type: DataTypes.DATE
    },
    otp: {
        type: DataTypes.STRING
    },
    otp_expired: {
        type: DataTypes.DATE
    },
    status: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    }
});

module.exports = Collector;
