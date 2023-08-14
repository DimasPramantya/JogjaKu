const Admin = require("../model/Admin");
const Event = require("../model/Event");
const EventTicket = require("../model/EventTicket");
const Token = require("../model/Token");
const User = require("../model/User");
const Order = require("../model/Order");
const UserTicket = require("../model/UserTicket");
const Transaction = require("../model/Transaction");
const Cart = require("../model/Cart");
const sequelize = require("./db");

//one to one relation between user and token
User.hasOne(Token);
Token.belongsTo(User);

//one to many between event to event ticket
Event.hasMany(EventTicket);
EventTicket.belongsTo(Event);

// one to many between user to order
User.hasMany(Order)
Order.belongsTo(User)

// one to many between user to cart
User.hasMany(Cart)
Cart.belongsTo(User)

// one to many between event ticket to cart
EventTicket.hasMany(Cart)
Cart.belongsTo(EventTicket);

// one to many between product to order
EventTicket.hasMany(Order)
Order.belongsTo(EventTicket)

// one to many between transaction to order
Transaction.hasMany(Order)
Order.belongsTo(Transaction)

// one to many between user to userticket
User.hasMany(UserTicket);
UserTicket.belongsTo(User);

// one to many between event ticket to user ticket
EventTicket.hasMany(UserTicket);
UserTicket.belongsTo(EventTicket);

const association = async ()=>{
    try {
        await sequelize.sync({});
        const admin = await Admin.findOne({where: {id: 1}});
        if(admin===null){
            await Admin.create({
                username: "$2a$12$KEVYY8QnYDcoh9w5PGOGm.88DeQXkAa5kLsQuH4ljkU/UPoHDKcHe",
                password: "$2a$12$huZpTV93LJTCprmxDsqN3eHuXRNhrDtdHj9mmnqJtMz/ITyP05a82"
            })  
        }
    } catch (error) {
        console.log(error.message);
    }
}

module.exports = association; 