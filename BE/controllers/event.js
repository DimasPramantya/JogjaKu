const Event = require("../model/Event");
const EventTicket = require("../model/EventTicket");

const fs = require('fs');
const cloudinary = require('../util/cloudinaryConfig');

const postEventHandler = async(req,res,next)=>{
    try {
        //take the data
        const {name, organizer, date, place, seatAvailable} = req.body;

        let imageUrl = null;

        if(req.file){
            const file = req.file;
            console.log('test');
            const uploadOptions = {
                folder: 'event_images/', // Specify the folder in Cloudinary where you want to store the images
                public_id: `event_${name}_${date}`, // Assign a unique public ID for the image
                overwrite: true // Overwrite if the image with the same public ID already exists
            };

            // Upload the image to Cloudinary
            const uploadResult = await cloudinary.uploader.upload(file.path, uploadOptions);

            // Retrieve the URL of the uploaded image
            imageUrl = uploadResult.secure_url;;

            // Delete the temporary file from the server
            fs.unlinkSync(file.path);
        }

        //input the data to the event database
        await Event.create({name, organizer, date, place, seatAvailable, imageUrl});

        res.json({
            status: "Success!!",
            message: "Create event successfull!!"
        })

    } catch (error) {
        next(error)
    }
}

module.exports = {
    postEventHandler
}