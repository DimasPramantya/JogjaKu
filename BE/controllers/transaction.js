const Order = require("../model/Order");
const EventTicket = require("../model/EventTicket");
const Transaction = require("../model/Transaction");
const jwt = require('jsonwebtoken');

let midtransClient = require('midtrans-client');
const User = require("../model/User");
const Event = require("../model/Event");
const Cart = require("../model/Cart");

//extracting secret key from .env
require('dotenv').config();
const secretKey = process.env.SECRET_KEY;

const { v4: uuidv4 } = require('uuid');


//configuring midtrans coreApi for payment api 
let coreApi = new midtransClient.CoreApi({
    isProduction: false,
    serverKey: "SB-Mid-server-7gGRQaklp-y4gcBVa4KsguRt",
    clientKey: "SB-Mid-client-5MZY6y3aMv7KUcab"
})

const getToken = (headers) => {
    const authorizationHeader = headers.authorization;
    if (authorizationHeader && authorizationHeader.startsWith('Bearer ')) {
        return (authorizationHeader.substring(7)); // Remove 'Bearer ' from the header
    }
    else {
        throw new Error("You need to login");
    }
}

const postCart = async(req,res,next)=>{
    try {
        const token = getToken(req.headers);
        const decoded = jwt.verify(token, secretKey);

        const loggedUser = await User.findOne({ where: { id: decoded.userId }, attributes: { exclude: ['password', 'email'] } });

        const {eventTicketId, quantity} = req.body;

        const currentEventTicket = await EventTicket.findOne({where: {id: eventTicketId}});

        const currentEvent = await Event.findOne({where: {id: currentEventTicket.eventId}})

        const totalPrice = currentEventTicket.price*quantity;

        const currentCartTicket = await loggedUser.createCart({quantity, totalPrice, eventTicketId});

        res.status(200).json({
            status: "Success!!",
            message: "Add To Cart Success!!",
            data: {
                ticket: currentEvent.name,
                date: currentEvent.date,
                touristType: currentEventTicket.touristType,
                age: currentEventTicket.ageType,
                quantity,
                totalPrice
            }
        })
    } catch (error) {
        next(error)
    }
}

const deleteCartItem = async(req,res,next)=>{
    try {
        const token = getToken(req.headers);
        const decoded = jwt.verify(token, secretKey);

        const {cartId} = req.body;
        const currentCart = await Cart.findOne({where: {id: cartId}});

        await currentCart.destroy();

        res.json({
            status: "Success!!",
            message: "Delete Cart Item Success!!",
        })

    } catch (error) {
        next(error)
    }
}

const getUserCart = async(req,res,next)=>{
    try {
        const token = getToken(req.headers);
        const decoded = jwt.verify(token, secretKey);

        const userCart = await Cart.findAll({
            where: { userId: decoded.userId },
            attributes: { exclude: ['id'] },
            include: [
                {
                    model: EventTicket,
                    attributes: ['touristType', 'ageType'] // Include specific attributes of EventTicket
                }
            ]
        });
        
        res.status(200).json({
            status: "Success!!",
            message: "Fetch User's Cart Success!!",
            data: userCart
        })

    } catch (error) {
        next(error);
    }
}

const postOrder = async(req,res,next)=>{
    try {
        const token = getToken(req.headers);
        const decoded = jwt.verify(token, secretKey);
        
        const userCart = await Cart.findAll({where: {userId: decoded.userId}})
        let totalPrice = userCart.reduce((sum, object) => sum + object.totalPrice, 0);

        const uuid = uuidv4();

        const {bank_name} = req.body;
        const paymentParameter = {
            payment_type: "bank_transfer",
            transaction_details:{
                gross_amount: totalPrice,
                order_id: uuid
            },
            bank_transfer:{
                bank: bank_name
            }
        };

        const midtransResponse = await coreApi.charge(JSON.stringify(paymentParameter));

        let currentTransaction = await Transaction.create({id: uuid, price: totalPrice, midtransResponse: JSON.stringify(midtransResponse)});

        for(let cart of userCart){
            await Order.create({
                quantity: cart.quantity, 
                status: "pending", 
                userId: decoded.userId, 
                eventTicketId: cart.eventTicketId,
                transactionId: currentTransaction.id
            })
            await cart.destroy();
        }

        res.json({
            status: "success"
        })

    } catch (error) {
        next(error)
    }
}

const hookPaymentStatus = async(req,res,next)=>{
    try {
        const midtransUpdateResponse = await coreApi.transaction.notification(req.body);
        let orderId = midtransUpdateResponse.order_id;
        let transactionStatus = midtransUpdateResponse.transaction_status;
        console.log(`Transaction notification received. Order ID: ${orderId}. Transaction status: ${transactionStatus}.`);
        
        const currentTransaction = await Transaction.findOne({where: {id: orderId}});
        currentTransaction.midtransResponse = JSON.stringify(midtransUpdateResponse);
        await currentTransaction.save();

        const currentOrders = await Order.findAll({where: {transactionId: orderId}});
        for(let order of currentOrders){
            order.status = transactionStatus;
            await order.save();
        }
        console.log(`Transaction notification received. Order ID: ${orderId}. Transaction status: ${transactionStatus}.`);
    } catch (error) {
        next(error);
    }
}

module.exports = {
    postCart, deleteCartItem, getUserCart, postOrder, hookPaymentStatus
}