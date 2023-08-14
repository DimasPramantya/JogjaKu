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
    midtransResponse:{
        type: Sequelize.STRING,
        allowNull: false
    }
})

module.exports = Transaction;