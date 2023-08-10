const Sequelize = require('sequelize');
const sequelize = require('../util/db');

const UserTicket = sequelize.define('usertickets',{
    id:{
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false
    },
})

module.exports = UserTicket;