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
        const { name, description, location, organizer, date, seatAvailable } = req.body;
        if (!req.files || req.files.length === 0) {
            throw new Error('No files uploaded');
        }
        const currentEvent = await Event.create({ name, description, location, organizer, date, seatAvailable });
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
        const { touristType, ageType, price } = req.body;

        //search the event
        const currentEvent = await Event.findOne({ where: { id: eventId } });

        if (!currentEvent) {
            throw new Error("Event is not found");
        }

        //create the event ticket
        const ticket = await currentEvent.createEventTicket({ touristType, ageType, price });

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
            //--USING CLOUD STORAGE BUCKET--
            // const blob = bucket.file(req.file.originalname);
            // const blobStream = blob.createWriteStream();
            // blobStream.on("finish",()=>{
            //     res.status(200).send("upload file success");
            // });
            // blobStream.end(req.file.buffer);

            //--USING CLOUDINARY--
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

module.exports = {
    postEventHandler, postEventTicketHandler, postImageLogic
}