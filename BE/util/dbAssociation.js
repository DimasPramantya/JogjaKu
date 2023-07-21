const Admin = require("../model/Admin");
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
        await sequelize.sync({});
        // await Admin.create({
        //     username: "$2a$12$KEVYY8QnYDcoh9w5PGOGm.88DeQXkAa5kLsQuH4ljkU/UPoHDKcHe",
        //     password: "$2a$12$huZpTV93LJTCprmxDsqN3eHuXRNhrDtdHj9mmnqJtMz/ITyP05a82"
        // })
    } catch (error) {
        console.log(error.message);
    }
}

module.exports = association;