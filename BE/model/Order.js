const Sequelize = require('sequelize');
const sequelize = require('../util/db');

const Order = sequelize.define('orders',{
    id:{
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false
    },
    quantity:{
        type: Sequelize.INTEGER,
        allowNull: false
    },    
    status:{
        type: Sequelize.ENUM(["settlement", "deny", "cancel", "pending"]),
        allowNull: false
    }
})

module.exports = Order;