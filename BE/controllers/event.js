require('dotenv').config();
const Event = require("../model/Event");
const EventTicket = require("../model/EventTicket");
const cloudinary = require('../util/cloudinary');

//--CONFIGURING GOOGLE CLOUD STORAGE BUCKET--
// const { Storage } = require('@google-cloud/storage');
// let keyFileName = "../gcpApiKey.json"
// const storage = new Storage({
//     projectId: process.env.PROJECT_ID,
//     keyFileName
// });
// const bucket = storage.bucket(`${process.env.BUCKET_NAME}`);


const postEventHandler = async (req, res, next) => {
    try {
        const { name, description, location, organizer, date } = req.body;
        if (!req.files || req.files.length === 0) {
            throw new Error('No files uploaded');
        }
        const currentEvent = await Event.create({ name, description, location, organizer, date});
        const uploadResultUrls = [];
        let i = 0;
        const uploadPromises = req.files.map((file) => {
            i+=1;
            return new Promise((resolve, reject) => {
                const uploadOptions = {
                    folder: 'jogjaku_event_images/',
                    public_id: `event_${currentEvent.name}_${i}`,
                    overwrite: true
                };

                const uploadStream = cloudinary.uploader.upload_stream(uploadOptions, (error, result) => {
                    if (error) {
                        console.error("Error uploading file:", error);
                        reject(error);
                    } else {
                        uploadResultUrls.push(result.secure_url);
                        resolve();
                    }
                }).end(file.buffer)
            });
        });
        await Promise.all(uploadPromises);

        console.log(uploadResultUrls);
        currentEvent.imageUrl = uploadResultUrls.join(',');
        await currentEvent.save();
        res.json({
            status: "Success",
            message: "Create Event Success!!!",
            currentEvent
        })
    } catch (error) {
        next(error)
    }
}

const postEventTicketHandler = async (req, res, next) => {
    try {
        //take the data
        const { eventId } = req.params;
        const { seatType, price, date, dateTime, seatAvailable } = req.body;

        //search the event
        const currentEvent = await Event.findOne({ where: { id: eventId } });

        if (!currentEvent) {
            throw new Error("Event is not found");
        }

        //create the event ticket
        const ticket = await currentEvent.createEventTicket({ seatType, price, date, dateTime, seatAvailable });

        res.status(200).json({
            status: "Success!!",
            message: "Create tickets successfull!!",
            data: ticket
        })

    } catch (error) {
        next(error);
    }
}

const postImageLogic = async (req, res, next) => {
    try {
        if (req.file) {
            console.log("req.file exist", req.file);
            const file = req.file;
            const uploadOptions = {
                folder: 'jogjaku_user_profile/', // Specify the folder in Cloudinary where you want to store the images
                public_id: `profile_${Date.now()}`, // Assign a unique public ID for the image
                overwrite: true // Overwrite if the image with the same public ID already exists
            };

            const uploadResult = await cloudinary.uploader.upload_stream(uploadOptions, async (error, result) => {
                if (error) {
                    console.error("Error uploading file:", error);
                    return res.status(500).json({ error: 'Upload failed' });
                }
                
                const imageUrl = result.secure_url;
                res.json({ imageUrl });
            }).end(req.file.buffer);

        } else {
            throw new Error("error when uploading file")
        }
    } catch (error) {
        next(error);
    }
}

const getEvents = async(req,res,next)=>{
    try {
        const events = await Event.findAll({
            attributes:{
                exclude: ['description', 'location']
            }
        })
        res.json({
            status: "Success",
            message: "Successfully Fetch Event Data",
            events
        })
    } catch (error) {
        next(error);
    }
}

const getEventById = async(req,res,next)=>{
    try {
        const {eventId} = req.params;
        const event = await Event.findOne({
            where:{
                id: eventId
            },
            include: [
                {
                  model: EventTicket,
                },
              ],
        })
        res.json({
            status: "Success",
            message: "Successfully Fetch Event Data",
            event
        })
    } catch (error) {
        next(error)
    }
}

const getEventsCalendar = async(req,res,next)=>{
    try {
        const events = await Event.findAll({
            attributes:{
                exclude: ['description', 'location']
            }
        });
        const Agustus = {Agustus: []}, September = {September: []},
        Oktober = {Oktober: []},
        November = {November: []},
        Desember = {Desember: []},
        Januari = {Januari: []};
        events.forEach(e => {
            if(e.date.includes("2023")){
                if(e.date.includes("Agustus")){
                    Agustus.Agustus.push(e);
                }else if(e.date.includes("September")){
                    September.September.push(e);
                }else if(e.date.includes("Oktober")){
                    Oktober.Oktober.push(e);
                }else if(e.date.includes("November")){
                    November.November.push(e);
                }else if(e.date.includes("Desember")){
                    Desember.Desember.push(e);
                }
            }else if(e.date.includes("2024")){  
                if(e.date.includes("Januari")){
                    Januari.Januari.push(e);
                }
            }
        });
        console.log(Agustus, "\n", September, "\n", Oktober);
        const events2023 = [], events2024 = [];
        events2023.push(Agustus);
        events2023.push(September);
        events2023.push(Oktober);
        events2023.push(November);
        events2023.push(Desember);
        events2024.push(Januari)
        res.json({
            status: "Success",
            message: "Successfully Fetch Events\ Data",
            events2023, events2024
        })
    } catch (error) {
        next(error)
    }
}

const updateEvent = async(req,res,next)=>{
    try {
        const {eventId} = req.params;
        const { name, description, location, organizer, date } = req.body;
        const uploadPromises = req.files.map((file) => {
            i+=1;
            return new Promise((resolve, reject) => {
                const uploadOptions = {
                    folder: 'jogjaku_event_images/',
                    public_id: `event_${name}_${i}`,
                    overwrite: true
                };

                const uploadStream = cloudinary.uploader.upload_stream(uploadOptions, (error, result) => {
                    if (error) {
                        console.error("Error uploading file:", error);
                        reject(error);
                    } else {
                        uploadResultUrls.push(result.secure_url);
                        resolve();
                    }
                }).end(file.buffer)
            });
        });
        await Promise.all(uploadPromises);

        const currentEvent = await Event.findOne({where:{id: eventId}});

        await currentEvent.update({
            name, description, location, organizer, date, imageUrl: uploadResultUrls.join(' ')
        })
    } catch (error) {
        next(error);
    }
}

module.exports = {
    postEventHandler, postEventTicketHandler, postImageLogic,
    getEvents, getEventById, getEventsCalendar, updateEvent
}