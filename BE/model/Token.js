const Sequelize  = require("sequelize");
const sequelize = require("../util/db");

const Token = sequelize.define('tokens',{
    id:{
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    token:{
        type: Sequelize.STRING,
        allowNull: false
    }
})

module.exports = Token