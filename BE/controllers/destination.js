require('dotenv').config();
const Activity = require('../model/Activity');
const Destination = require('../model/Destination');
const DestinationTicket = require("../model/DestinationTicket");
const cloudinary = require('../util/cloudinary');

const postDestination = async (req, res, next) => {
    try {
        const { name, description, location, regency, category } = req.body;
        if (!req.files || req.files.length === 0) {
            throw new Error('No files uploaded');
        }
        const currentDestination = await Destination.create({ name, description, location, regency, category });
        const uploadResultUrls = [];
        let i = 0;
        const uploadPromises = req.files.map((file) => {
            i+=1;
            return new Promise((resolve, reject) => {
                const uploadOptions = {
                    folder: 'jogjaku_destination_images/',
                    public_id: `destination_${currentDestination.name}_${i}`,
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
        currentDestination.imageUrl = uploadResultUrls.join(',');
        await currentDestination.save();
        res.json({
            status: "Success",
            message: "Create Destination Success!!!",
            currentDestination
        })
    } catch (error) {
        next(error)
    }
}

const postActivity = async(req,res,next)=>{
    try {
        const { name, description, location, regency, tag } = req.body;
        if (!req.files || req.files.length === 0) {
            throw new Error('No files uploaded');
        }
        const currentActivity = await Activity.create({ name, description, location, regency, tag });
        const uploadResultUrls = [];
        let i = 0;
        const uploadPromises = req.files.map((file) => {
            i+=1;
            return new Promise((resolve, reject) => {
                const uploadOptions = {
                    folder: 'jogjaku_activity_images/',
                    public_id: `activity_${currentActivity.name}_${i}`,
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
        currentActivity.imageUrl = uploadResultUrls.join(',');
        await currentActivity.save();
    } catch (error) {
        next(error);
    }
}

const postDestinationTicket = async(req,res,next)=>{
    try {
        //take the data
        const { destinationId } = req.params;
        const { touristType, ageType, price, dateTime } = req.body;

        //search the Destination
        const currentDestination = await Destination.findOne({ where: { id: destinationId } });

        if (!currentDestination) {
            throw new Error("Event is not found");
        }

        //create the destination ticket
        const ticket = await currentDestination.createDestinationTicket({ touristType, ageType, price, dateTime });

        res.status(200).json({
            status: "Success!!",
            message: "Create tickets successfull!!",
            data: ticket
        })

    } catch (error) {
        next(error);
    }
}

const getDestinations = async(req,res,next)=>{
    try {
        const destinations = await Destination.findAll()
        res.json({
            status: "Success",
            message: "Successfully Fetch Destination Data",
            destinations
        })
    } catch (error) {
        next(error);
    }
}

const getDestinationById = async(req,res,next)=>{
    try {
        const {destinationId} = req.params;
        const destination = await Destination.findOne({
            where:{
                id: destinationId
            },
            include: [
                {
                  model: DestinationTicket,
                  attributes: ['id','touristType', 'ageType', 'dateTime', 'price'], // Include specific attributes of DestinationTicket
                },
              ],
        })
        res.json({
            status: "Success",
            message: "Successfully Fetch Destination Data",
            destination
        })
    } catch (error) {
        next(error)
    }
}

module.exports = {
    postDestination, postDestinationTicket, getDestinations, getDestinationById
    ,postActivity
}