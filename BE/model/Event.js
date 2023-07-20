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
    organizer:{
        type: Sequelize.STRING,
        allowNull: false,
    },
    date:{
        type: Sequelize.STRING,
        allowNull: false,
    },
    place:{
        type: Sequelize.STRING,
        allowNull: false,
    },
    seatAvailable:{
        type: Sequelize.INTEGER,
        allowNull: true
    },
    imageUrl:{
        type: Sequelize.STRING,
        allowNull: true,
    }
},{
    timestamps: false
})

module.exports = Event;