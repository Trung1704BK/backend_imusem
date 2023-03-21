const {DataTypes} = require('sequelize');

const sequelize = require('../util/database');

const Material = sequelize.define('material', {
    material_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING
    }
});

module.exports = Material;
