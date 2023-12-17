const Sequelize = require('sequelize');
const sequelize = require('../util/db');

const EventTicket = sequelize.define("eventTickets",{
    id:{
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    seatType:{
        type: Sequelize.STRING,
        allowNull: true,
    },
    price:{
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    date:{
        type: Sequelize.STRING,
        allowNull: false
    },    
    dateTime:{
        type: Sequelize.STRING,
        allowNull: false
    },
    seatAvailable:{
        type: Sequelize.INTEGER,
        allowNull: true,
    }
},{
    timestamps: false
})

module.exports = EventTicket;