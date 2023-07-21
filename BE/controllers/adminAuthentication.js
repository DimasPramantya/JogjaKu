const Admin = require("../model/Admin");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//extracting secret key from .env
require('dotenv').config();
const secretKey = process.env.SECRET_KEY;

const adminLoginHandler = async(req,res,next)=>{
    try {
        //take the data
        const {username, password} = req.body;

        //take the admin data from database
        const admin = await Admin.findAll();

        console.log(admin[0].username, username);

        //validate email & password
        if(!bcrypt.compareSync(username, admin[0].username) || !bcrypt.compareSync(password, admin[0].password)){
            throw new Error("Wrong Email or Password");
        }

        //generate the token
        const token = jwt.sign({adminId: admin[0].id, role: "admin"}, secretKey, {
            algorithm: "HS256",
            //expires in 1 hour
            expiresIn: '1h'
        })

        res.json({
            message: "Login Success",
            token
        })
    } catch (error) {
        next(error);
    }
}

module.exports = adminLoginHandler;