const Sequelize = require('sequelize');
const sequelize = require('../util/db');

const Activity = sequelize.define('activity',{
    id:{
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    name:{
        type: Sequelize.STRING,
        allowNull: false
    },
    description:{
        type: Sequelize.TEXT,
        allowNull: false
    },
    location:{
        type: Sequelize.STRING,
        allowNull: false,
    },
    regency:{
        type: Sequelize.STRING,
        allowNull: false,
    },
    tag:{
        type: Sequelize.TEXT,
        allowNull: false
    },
    imageUrl:{
        type: Sequelize.TEXT,
        allowNull: true,
    }
},{
    timestamps: false
})

module.exports = Activity;