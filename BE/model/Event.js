const Sequelize = require('sequelize');
const sequelize = require('../util/db');

const Event = sequelize.define("events",{
    id:{
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    name:{
        type: Sequelize.STRING,
        allowNull: false,
    },
    description:{
        type: Sequelize.TEXT,
        allowNull: true
    },
    organizer:{
        type: Sequelize.STRING,
        allowNull: false,
    },
    date:{
        type: Sequelize.STRING,
        allowNull: false,
    },
    location:{
        type: Sequelize.STRING,
        allowNull: false,
    },
    imageUrl:{
        type: Sequelize.TEXT,
        allowNull: true,
    }
},{
    timestamps: false
})

module.exports = Event;