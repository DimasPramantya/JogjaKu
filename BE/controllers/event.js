const Event = require("../model/Event");
const EventTicket = require("../model/EventTicket");

const postEventHandler = async(req,res,next)=>{
    try {
        //take the data
        const {name, organizer, date, place, seatAvailable, imageUrl} = req.body;

        //input the data to the event database
        const currEvent = await Event.create({name, organizer, date, place, seatAvailable, imageUrl});

        if(seatAvailable){

        }
    } catch (error) {
        next(error)
    }
}