const errorBadRequestHandler = (err,req,res,next)=>{
    res.status(400).json({status: "error",err: err.message})
}

module.exports = errorBadRequestHandler;