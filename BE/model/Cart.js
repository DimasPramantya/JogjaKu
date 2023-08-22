const Sequelize = require('sequelize');
const sequelize = require('../util/db');

const Cart = sequelize.define('carts',{
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    quantity:{
        type: Sequelize.INTEGER,
        allowNull: false
    },    
    totalPrice:{
        type: Sequelize.INTEGER,
        allowNull: false
    },
    date:{
        type: Sequelize.STRING,
        allowNull: false
    }
})

module.exports = Cart;