const Sequelize = require('sequelize');
const sequelize = require('../util/db');

const Transaction = sequelize.define('transactions',{
    id:{
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false
    },
    price:{
        type: Sequelize.INTEGER,
        allowNull: false
    },
    status:{
        type: Sequelize.ENUM(["settlement", "deny", "cancel", "pending"]),
        allowNull: false
    }
})

module.exports = Transaction;