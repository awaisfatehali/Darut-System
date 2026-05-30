const ErrorHandler = require("../utils/ErrorHandler.js");

module.exports = (err,req,res,next)=>{
    err.statusCode = err.statusCode || 500
    err.message = err.message || "internal Server Error!"


    // Wronge MONGODB id Error
    if(err.name === "CastError"){
        const message = `resouces not found with this id .. Invalid ${err.path}`;
        err = new ErrorHandler(message,400);
    }
    // Duplicate key error
    if(err.code === 11000){
        const  message = `duplicate key ${Object.keys(err.keyValue)} Entered!`
        err = new ErrorHandler(message,400);
    }
    // wronge  JWT error
    if(err.name === "JsonWebTokenError"){
        const message = `your Url is invalid  please try again later`;
        err = new ErrorHandler(message,400);
    }

    // JWT expired
    if(err.name === "TokenExpiredError"){
        const message = "your Url is Expired try Log-in again"
        err = new ErrorHandler(message,400)
    }
    res.status(err.statusCode).json({
        success : false,
        message : err.message,
    })
}