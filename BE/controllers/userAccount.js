const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../model/User');
const Token = require('../model/Token');

//extracting secret key from .env
require('dotenv').config();
const secretKey = process.env.SECRET_KEY;

const loginHandler = async(req,res,next)=>{
    try {
        //take the data
        const {email, password} = req.body;

        //check the existed user based on email
        const loggedUser = await User.findOne({where: {email}});
        if(!loggedUser){
            throw new Error('Wrong email or password!!!')
        }

        //validate the password
        const validatePassword = await bcrypt.compare(password,loggedUser.password);
        if (!validatePassword) {
            throw new Error("Wrong email or password!!!")
        }

        //generate the token
        const token = jwt.sign({userId: loggedUser.id, username: loggedUser.username}, secretKey, {
            algorithm: "HS256",
            //expires in 1 hour
            expiresIn: '1h'
        })

        //updating the token in database
        const loggedUserToken = await Token.findOne({where: {userId: loggedUser.id}});
        loggedUserToken.token = token;
        await loggedUserToken.save();
        
        //sending response data
        res.json({
            message: "Login Success!!!",
            token
        })

    } catch (error) {
        next(error)
    }
}

const signUpHandler = async(req,res,next)=>{
    try {
        //take the data
        let {username, email, password, fullName, phoneNumber} = req.body;
        
        //check if email is unique
        const duplicateUser = await User.findOne({where: {email}});
        if(duplicateUser){
            throw new Error("email has been registered")
        }
        
        //hashing the password before goes to database
        password = await bcrypt.hash(password, 10);
        
        //create new user in database
        const newUser = await User.create({
            username, email, password, fullName, phoneNumber
        })

        //generate user token
        const token = jwt.sign({userId: newUser.id, username: newUser.username}, secretKey, {
            algorithm: "HS256",
            //expires in 1 hour
            expiresIn: '1h'
        })

        //storing the token in database
        await Token.create({
            token, userId: newUser.id
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

module.exports = {
    signUpHandler, loginHandler
}