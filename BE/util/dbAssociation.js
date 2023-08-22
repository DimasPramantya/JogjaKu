const Admin = require("../model/Admin");
const Event = require("../model/Event");
const EventTicket = require("../model/EventTicket");
const User = require("../model/User");
const Order = require("../model/Order");
const UserTicket = require("../model/UserTicket");
const Transaction = require("../model/Transaction");
const Cart = require("../model/Cart");
const Destination = require("../model/Destination");
const DestinationTicket = require("../model/DestinationTicket");
const sequelize = require("./db");

//one to many between event to event ticket
Event.hasMany(EventTicket);
EventTicket.belongsTo(Event);

//one to many between destination to destination ticket
Destination.hasMany(DestinationTicket);
DestinationTicket.belongsTo(Destination);

// one to many between user to order
User.hasMany(Order)
Order.belongsTo(User)

// one to many between user to cart
User.hasMany(Cart)
Cart.belongsTo(User)

// one to many between event ticket to cart
EventTicket.hasMany(Cart)
Cart.belongsTo(EventTicket);

// one to many between event ticket to order
EventTicket.hasMany(Order)
Order.belongsTo(EventTicket)

// one to many between destination ticket to cart
DestinationTicket.hasMany(Cart)
Cart.belongsTo(DestinationTicket);

// one to many between destination ticket to order
DestinationTicket.hasMany(Order)
Order.belongsTo(DestinationTicket)

// one to many between transaction to order
Transaction.hasMany(Order)
Order.belongsTo(Transaction)

// one to many between user to userticket
User.hasMany(UserTicket);
UserTicket.belongsTo(User);

// one to many between event ticket to user ticket
EventTicket.hasMany(UserTicket);
UserTicket.belongsTo(EventTicket);

// one to many between destination ticket to user ticket
DestinationTicket.hasMany(UserTicket);
UserTicket.belongsTo(DestinationTicket);

const association = async ()=>{
    try {
        await sequelize.sync({force:true});
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