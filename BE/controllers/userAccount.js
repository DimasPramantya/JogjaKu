const cloudinary = require('../util/cloudinary');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../model/User');

//extracting secret key from .env
require('dotenv').config();
const secretKey = process.env.SECRET_KEY;

const getToken = (headers) => {
    const authorizationHeader = headers.authorization;
    if (authorizationHeader && authorizationHeader.startsWith('Bearer ')) {
        return (authorizationHeader.substring(7)); // Remove 'Bearer ' from the header
    }
    else {
        throw new Error("You need to login");
    }
}

const loginHandler = async (req, res, next) => {
    try {
        //take the data
        const { email, password } = req.body;

        //check the existed user based on email
        const loggedUser = await User.findOne({ where: { email } });
        if (!loggedUser) {
            throw new Error('Wrong email or password!!!')
        }

        //validate the password
        const validatePassword = await bcrypt.compare(password, loggedUser.password);
        if (!validatePassword) {
            throw new Error("Wrong email or password!!!")
        }

        //generate the token
        const token = jwt.sign({ userId: loggedUser.id, username: loggedUser.username }, secretKey, {
            algorithm: "HS256",
            //expires in 1 hour
            expiresIn: '1d'
        })

        //sending response data
        res.json({
            message: "Login Success!!!",
            token
        })

    } catch (error) {
        next(error)
    }
}

const signUpHandler = async (req, res, next) => {
    try {
        //take the data
        let { username, email, password, fullName, phoneNumber } = req.body;

        //check if email is unique
        const duplicateUser = await User.findOne({ where: { email } });
        if (duplicateUser) {
            throw new Error("email has been registered")
        }

        //hashing the password before goes to database
        password = await bcrypt.hash(password, 10);

        //create new user in database
        const newUser = await User.create({
            username, email, password, fullName, phoneNumber
        })

        if (req.file) {
            console.log("req.file exist", req.file);
            const uploadOptions = {
                folder: 'jogjaku_user_profile/', // Specify the folder in Cloudinary where you want to store the images
                public_id: `user_${newUser.id}`, // Assign a unique public ID for the image
                overwrite: true // Overwrite if the image with the same public ID already exists
            };

            const uploadResult = await cloudinary.uploader.upload_stream(uploadOptions, async (error, result) => {
                if (error) {
                    console.error("Error uploading file:", error);
                    return res.status(500).json({ error: 'Upload failed' });
                }

                const imageUrl = result.secure_url;
                newUser.profilePict = imageUrl;
                await newUser.save();
            }).end(req.file.buffer);
        }
        else {
            console.log("error when uploading file")
        }

        //generate user token
        const token = jwt.sign({ userId: newUser.id, username: newUser.username }, secretKey, {
            algorithm: "HS256",
            //expires in 3 day
            expiresIn: '1d'
        })

        //sending response data
        res.json({
            message: "Sign Up Success!!!",
            token
        })

    } catch (error) {
        next(error);
    }
}

const getUserData = async(req,res,next)=>{
    try {
        const token = getToken(req.headers);
        const decoded = jwt.verify(token, secretKey);
        const loggedUser = await User.findOne({ where: { id: decoded.userId }, attributes: { exclude: ['id','email'] } });
        res.json({
            status: "success",
            message: "Successfully Fetch User Data",
            user: loggedUser
        })
    } catch (error) {
        next(error)
    }
}

const editUserAccount = async(req,res,next)=>{
    try {
        const token = getToken(req.headers);
        const decoded = jwt.verify(token, secretKey);
        const { fullName, username, password, email } = req.body;
        const user = await User.findOne({where: {id: decoded.userId}})
        if (!user) {
            throw new Error(`User with ${decoded.userId} doesn't exist!!!`)
        }
        await user.update({
            fullName, username, password, email
        });
        if (req.file) {
            console.log("req.file exist", req.file);
            const file = req.file;
            const uploadOptions = {
                folder: 'jogjaku_user_profile/', // Specify the folder in Cloudinary where you want to store the images
                public_id: `profile_${user.username}_${decoded.userId}`, // Assign a unique public ID for the image
                overwrite: true // Overwrite if the image with the same public ID already exists
            };

            const uploadResult = await cloudinary.uploader.upload_stream(uploadOptions, async (error, result) => {
                if (error) {
                    console.error("Error uploading file:", error);
                    return res.status(500).json({ error: 'Upload failed' });
                }
                const profilePict = result.secure_url;
                await user.update({
                    profilePict
                });
            }).end(req.file.buffer);
        }
        res.status(200).json({ status: "success", message: "Successfully update user" });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    signUpHandler, loginHandler, getUserData, editUserAccount
}