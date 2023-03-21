const {DataTypes} = require('sequelize');

const sequelize = require('../util/database');

const ItemCollection = sequelize.define('item_collection', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    }
});

module.exports = ItemCollection;
