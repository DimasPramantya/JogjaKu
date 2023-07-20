const Event = require("../model/Event");
const EventTicket = require("../model/EventTicket");
const Token = require("../model/Token");
const User = require("../model/User");
const sequelize = require("./db");

//one to one relation between user and token
User.hasOne(Token);
Token.belongsTo(User);

//one to many between event to event ticket
Event.hasMany(EventTicket);
EventTicket.belongsTo(Event);

const association = async ()=>{
    try {
        await sequelize.sync({})
    } catch (error) {
        console.log(error.message);
    }
}

module.exports = association;