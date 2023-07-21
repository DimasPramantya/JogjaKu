const jwt = require('jsonwebtoken');

//extracting secret key from .env
require('dotenv').config();
const secretKey = process.env.SECRET_KEY;

const adminAuthorization = async(req,res,next)=>{
    try {
        //get token
        let token;
        const authorizationHeader = req.headers.authorization;
        if (authorizationHeader && authorizationHeader.startsWith('Bearer ')) {
            token = authorizationHeader.substring(7); // Remove 'Bearer ' from the header

            //verify credentials
            const decoded = jwt.verify(token, secretKey);
            if(decoded.role==='admin'){
                return next();
            }
        }
        throw new Error();
    } catch (error) {
        res.status(401).json({
            message: "You don't have permission!!!"
        })
    }
}

module.exports = adminAuthorization;