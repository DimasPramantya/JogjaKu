const Token = require("../model/Token");
const User = require("../model/User");
const sequelize = require("./db");

User.hasOne(Token);
Token.belongsTo(User);

const association = async ()=>{
    try {
        await sequelize.sync({})
    } catch (error) {
        console.log(error.message);
    }
}

module.exports = association;