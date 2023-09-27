require('dotenv').config();
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
const Activity = require('../model/Activity');

//one to many between event to event ticket
Event.hasMany(EventTicket);
EventTicket.belongsTo(Event);

//one to many between destination to destination ticket
Destination.hasMany(DestinationTicket);
DestinationTicket.belongsTo(Destination);

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

// one to many between destination User to transaction
User.hasMany(Transaction);
Transaction.belongsTo(User);

// one to many between destination to activity
Destination.hasMany(Activity);
Activity.belongsTo(Destination);

const association = async ()=>{
    try {
        await sequelize.sync({});
        const admin = await Admin.findOne({where: {id: 1}});
        if(admin===null){
            await Admin.create({
                username: process.env.ADMIN_USERNAME,
                password: process.env.ADMIN_PASSWORD
            })  
        }
    } catch (error) {
        console.log(error.message);
    }
}

module.exports = association; 