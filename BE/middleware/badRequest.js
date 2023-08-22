const errorBadRequestHandler = (err,req,res,next)=>{
    res.status(400).json({status: "error",message: err.message})
}

module.exports = errorBadRequestHandler;