const Order = require("../model/Order");
const EventTicket = require("../model/EventTicket");
const Transaction = require("../model/Transaction");

let midtransClient = require('midtrans-client');

let coreApi = new midtransClient.CoreApi({
    isProduction: false,
    serverKey: "SB-Mid-server-7gGRQaklp-y4gcBVa4KsguRt",
    clientKey: "SB-Mid-client-5MZY6y3aMv7KUcab"
})

const postCart = async(req,res,next)=>{
    try {
        const {eventTicketId, quantity} = req.body;
        
    } catch (error) {
        next(error)
    }
}

const postOrder = async(req,res,next)=>{
    try {
        const {eventTicket, totalPrice} = req.body;
        for(let ticket of eventTicket){
            await Order.create({
                quantity: ticket.quantity,
                eventTicketId: ticket.id, 
                status: "pending" 
            });
        }


    } catch (error) {
        next(error)
    }
}