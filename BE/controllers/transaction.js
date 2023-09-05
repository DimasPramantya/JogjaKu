const { Op } = require('sequelize');

const Order = require("../model/Order");
const EventTicket = require("../model/EventTicket");
const DestinationTicket = require('../model/DestinationTicket');
const Transaction = require("../model/Transaction");
const jwt = require('jsonwebtoken');

let midtransClient = require('midtrans-client');
const User = require("../model/User");
const Event = require("../model/Event");
const Destination = require('../model/Destination');
const Cart = require("../model/Cart");

//extracting secret key from .env
require('dotenv').config();
const secretKey = process.env.SECRET_KEY;

const { v4: uuidv4 } = require('uuid');
const UserTicket = require('../model/UserTicket');


//configuring midtrans snap for payment api 
let snap = new midtransClient.Snap({
    isProduction: false,
    serverKey: process.env.SERVER_MIDTRANS_KEY,
    clientKey: process.env.CLIENT_MIDTRANS_KET
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

const postCart = async (req, res, next) => {
    try {
        const token = getToken(req.headers);
        const decoded = jwt.verify(token, secretKey);

        const loggedUser = await User.findOne({ where: { id: decoded.userId }, attributes: { exclude: ['password', 'email'] } });

        const { ticketId, quantity } = req.body;

        const type = req.query.type;

        if (type === 'event') {
            const currentEventTicket = await EventTicket.findOne({ where: { id: ticketId } });

            const currentEvent = await Event.findOne({ where: { id: currentEventTicket.eventId } })

            const totalPrice = currentEventTicket.price * quantity;

            let currentCartTicket = await Cart.findOne({
                where: {
                    eventTicketId: currentEventTicket.id,
                    userId: loggedUser.id
                }
            })

            if (currentCartTicket === null) {
                currentCartTicket = await loggedUser.createCart({ quantity, totalPrice, eventTicketId: ticketId, date: currentEventTicket.date });
            }
            else {
                currentCartTicket.quantity += quantity;
                currentCartTicket.totalPrice += totalPrice;
                await currentCartTicket.save();
            }

            res.status(200).json({
                status: "Success!!",
                message: "Add To Cart Success!!",
                data: {
                    ticket: currentEvent.name,
                    date: currentEventTicket.date,
                    touristType: currentEventTicket.touristType,
                    age: currentEventTicket.ageType,
                    dateTime: currentEventTicket.dateTime,
                    quantity,
                    totalPrice
                }
            })
        } else {
            const { date } = req.body;
            const currentDestinationTicket = await DestinationTicket.findOne({ where: { id: ticketId } });

            const currentDestination = await Destination.findOne({ where: { id: currentDestinationTicket.destinationId } })

            const totalPrice = currentDestinationTicket.price * quantity;

            let currentCartTicket = await Cart.findOne({
                where: {
                    destinationTicketId: currentDestinationTicket.id,
                    userId: loggedUser.id,
                    date
                }
            })

            if (currentCartTicket === null) {
                currentCartTicket = await loggedUser.createCart({ quantity, totalPrice, destinationTicketId: ticketId, date });
            }
            else {
                currentCartTicket.quantity += quantity;
                currentCartTicket.totalPrice += totalPrice;
                await currentCartTicket.save();
            }

            res.status(200).json({
                status: "Success!!",
                message: "Add To Cart Success!!",
                data: {
                    ticket: currentDestination.name,
                    date: currentDestination.date,
                    touristType: currentDestinationTicket.touristType,
                    age: currentDestinationTicket.ageType,
                    dateTime: currentDestinationTicket.dateTime,
                    quantity,
                    totalPrice,
                    date
                }
            })
        }
    } catch (error) {
        next(error)
    }
}



const deleteCartItem = async (req, res, next) => {
    try {
        const token = getToken(req.headers);
        const decoded = jwt.verify(token, secretKey);

        const { cartId } = req.body;
        const currentCart = await Cart.findOne({ where: { id: cartId } });

        await currentCart.destroy();

        res.json({
            status: "Success!!",
            message: "Delete Cart Item Success!!",
        })

    } catch (error) {
        next(error)
    }
}

const getUserCart = async (req, res, next) => {
    try {
        const token = getToken(req.headers);
        const decoded = jwt.verify(token, secretKey);

        const userEventTicketCart = await Cart.findAll({
            where: {
                userId: decoded.userId,
                eventTicketId: {
                    [Op.not]: null
                }
            },
            include: [
                {
                    model: EventTicket,
                    include: {
                        model: Event,
                        attributes: ['id', 'name', 'date']
                    }
                },
            ]
        });

        const userDestinationTicketCart = await Cart.findAll({
            where: {
                userId: decoded.userId,
                destinationTicketId: {
                    [Op.not]: null
                }
            },
            include: [
                {
                    model: DestinationTicket,
                    include: {
                        model: Destination,
                        attributes: ['id', 'name']
                    }
                },
            ]
        });

        res.status(200).json({
            status: "Success!!",
            message: "Fetch User's Cart Success!!",
            data: {
                userDestinationTicketCart,
                userEventTicketCart
            }
        })

    } catch (error) {
        next(error);
    }
}

const getUserCartByDestinationTicketID = async (req, res, next) => {
    try {
        const { destinationTicketId } = req.params;
        console.log(destinationTicketId);
        const token = getToken(req.headers);
        const decoded = jwt.verify(token, secretKey);
        const userDestinationTicketCart = await Cart.findOne({
            where: {
                userId: decoded.userId,
                destinationTicketId
            },
            include: [
                {
                    model: DestinationTicket,
                    attributes: ['id', 'touristType', 'ageType', 'dateTime'] // Include specific attributes of EventTicket
                }
            ]
        });
        res.status(200).json({
            status: "Success!!",
            message: "Fetch User's Cart By Destination Ticket ID Success!!!",
            data: {
                userDestinationTicketCart,
            }
        })
    } catch (error) {
        next(error);
    }
}

const postOrder = async (req, res, next) => {
    try {
        const token = getToken(req.headers);
        const decoded = jwt.verify(token, secretKey);

        const userCart = await Cart.findAll({ where: { userId: decoded.userId } })
        let totalPrice = userCart.reduce((sum, object) => sum + object.totalPrice, 0);

        let uuid = uuidv4();
        uuid = uuid.slice(0,8);

        const paymentParameter = {
            transaction_details: {
                gross_amount: totalPrice,
                order_id: uuid
            },
            credit_card: {
                secure: false
            }
        };

        const midtransTransactionToken = await snap.createTransactionToken(JSON.stringify(paymentParameter));

        let currentTransaction = await Transaction.create({ id: uuid, price: totalPrice, status: "pending", snapToken: midtransTransactionToken, userId: decoded.userId });

        for (let cart of userCart) {
            await Order.create({
                quantity: cart.quantity,
                status: "pending",
                date: cart.date,
                eventTicketId: cart.eventTicketId,
                destinationTicketId: cart.destinationTicketId,
                transactionId: currentTransaction.id
            })
            await cart.destroy();
        };

        res.json({
            status: "success",
            message: "post order success!!!",
            token: midtransTransactionToken,
        })

    } catch (error) {
        next(error)
    }
}

const hookPaymentStatus = async (req, res, next) => {
    try {
        const midtransUpdateResponse = await snap.transaction.notification(req.body);
        let transactionId = midtransUpdateResponse.order_id;
        let transactionStatus = midtransUpdateResponse.transaction_status;
        console.log(midtransUpdateResponse);

        const currentTransaction = await Transaction.findOne(
            {
                where: { id: transactionId },
                include: [
                    {
                        model: Order
                    }
                ]
            }
        );
        if (transactionStatus === "settlement" && currentTransaction.status !== transactionStatus) {
            for (let order of currentTransaction.orders) {
                if(order.eventTicketId!==null){
                    const currentEventTicket = await EventTicket.findOne({where:{id:order.eventTicketId}});
                    currentEventTicket.seatAvailable -= order.quantity;
                    await currentEventTicket.save();
                }
                for (let i = 0; i < order.quantity; i++) {
                    let uuid = uuidv4();
                    uuid = uuid.slice(0,8);
                    await UserTicket.create({
                        id: uuid,
                        userId: currentTransaction.userId,
                        date: order.date,
                        eventTicketId: order.eventTicketId,
                        destinationTicketId: order.destinationTicketId,
                        status: "valid"
                    })
                }
            }
        }
        if(transactionStatus==='expire'){
            currentTransaction.status = 'deny';
        }else{
            currentTransaction.status = transactionStatus;
        }
        await currentTransaction.save();
        res.status(200).json({
            status: "success"
        })
    } catch (error) {
        next(error);
    }
}

const expiredTicketHandler = async(req,res,next)=>{
    try {
        const {userTicketId} = req.params;
        
        const currentTicket = await UserTicket.findOne({where:{id:userTicketId}});
        currentTicket.status = "expired";
        await currentTicket.save();

        res.json({
            status: "success",
            message: "ticket is used",
            currentTicket
        })
    } catch (error) {
        next(error);
    }
}

const getUserOrderHistory = async(req,res,next)=>{
    try {
        const token = getToken(req.headers);
        const decoded = jwt.verify(token, secretKey);

        const activeTicket = await UserTicket.findAll({
            where: {
                status:"valid",
                userId: decoded.userId
            },
            include:[
                {
                    model: EventTicket,
                    include: {
                        model: Event,
                        attributes: ['id', 'name', 'date']
                    }
                },
                {
                    model: DestinationTicket,
                    include:{
                        model: Destination,
                        attributes: ['id', 'name']
                    }
                }

            ]
        });

        const historyPayment = await Transaction.findAll({
            where: {
                status: {[Op.not]: 'pending'},
                userId: decoded.userId   
            },
            include: {
                model: Order,
                include:[
                    {
                        model: EventTicket,
                        include: {
                            model: Event,
                            attributes: ['id', 'name', 'date']
                        }
                    },
                    {
                        model: DestinationTicket,
                        include:{
                            model: Destination,
                            attributes: ['id', 'name']
                        }
                    }

                ]
            }
        })

        const pendingPayment = await Transaction.findAll({
            where: {
                status: 'pending',
                userId: decoded.userId   
            },
            include: {
                model: Order,
                include:[
                    {
                        model: EventTicket,
                        include: {
                            model: Event,
                            attributes: ['id', 'name', 'date']
                        }
                    },
                    {
                        model: DestinationTicket,
                        include:{
                            model: Destination,
                            attributes: ['id', 'name']
                        }
                    }

                ]
            }
        });

        res.json({
            status: "Success",
            message: "Fetch User's Order Success",
            pendingPayment,
            historyPayment,
            activeTicket
        })

    } catch (error) {
        next(error);
    }
}

module.exports = {
    postCart, deleteCartItem, getUserCart, postOrder, hookPaymentStatus,
    getUserCartByDestinationTicketID, expiredTicketHandler, getUserOrderHistory
}