const Sequelize = require('sequelize');
const sequelize = require('../util/db');

const Admin = sequelize.define('admin',{
    id:{
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    username:{
        type: Sequelize.STRING,
        allowNull: false,
    },
    password:{
        type: Sequelize.STRING,
        allowNull: false
    }
},{
    timestamps: false
})

module.exports = Admin;