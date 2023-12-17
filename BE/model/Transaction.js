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
        type: Sequelize.ENUM(["settlement", "expired", "cancel", "pending", "deny"]),
        allowNull: false
    },
    snapToken:{
        type: Sequelize.STRING,
        allowNull: true
    }
})

module.exports = Transaction;