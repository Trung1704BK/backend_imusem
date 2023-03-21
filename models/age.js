const {DataTypes} = require('sequelize');

const sequelize = require('../util/database');

const Age = sequelize.define('age', {
    age_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING
    }
});

module.exports = Age;
