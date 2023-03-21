const {DataTypes} = require('sequelize');

const sequelize = require('../util/database');

const Item = sequelize.define('item', {
    item_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    collector_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    ownerType: {
        type: DataTypes.INTEGER
    },
    materialId: {
        type: DataTypes.INTEGER
    },
    original: {
        type: DataTypes.STRING
    },
    ageId: {
        type: DataTypes.INTEGER
    },
    itemType: {
        type: DataTypes.INTEGER
    },
    dimension: {
        type: DataTypes.STRING
    },
    weight: {
        type: DataTypes.FLOAT
    },
    status: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    description: {
        type: DataTypes.STRING
    },
    audio: {
        type: DataTypes.STRING
    },
    collected_date: {
        type: DataTypes.DATE
    },
    feature_image: {
        type: DataTypes.STRING
    }
});

module.exports = Item;
