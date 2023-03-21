const {DataTypes} = require('sequelize');

const sequelize = require('../util/database');

const Collection = sequelize.define('collection', {
    collection_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    title: {
        type: DataTypes.STRING
    },
    type: {
        type: DataTypes.INTEGER
    },
    status: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    }
});

module.exports = Collection;
