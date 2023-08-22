const Sequelize = require('sequelize');
const sequelize = require('../util/db');

const EventTicket = sequelize.define("eventTickets",{
    id:{
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    touristType:{
        type: Sequelize.STRING,
        allowNull: false,
    },
    ageType:{
        type: Sequelize.STRING,
        allowNull: false,
    },
    price:{
        type: Sequelize.INTEGER,
        allowNull: false,
    },    
    dateTime:{
        type: Sequelize.STRING,
        allowNull: false
    }
},{
    timestamps: false
})

module.exports = EventTicket;