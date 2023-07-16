const Sequelize  = require("sequelize");
const sequelize = require("../util/db");

const Token = sequelize.define('tokens',{
    token:{
        type: Sequelize.STRING,
        allowNull: false
    }
})

module.exports = Token