const Sequelize = require('sequelize');
const sequelize = require('../util/db');

const Order = sequelize.define('orders',{
    id:{
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    quantity:{
        type: Sequelize.INTEGER,
        allowNull: false
    }
})

module.exports = Order;