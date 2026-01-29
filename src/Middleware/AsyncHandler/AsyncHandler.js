


export const AsyncHandler = (fn)=>{
  
 return(req,res,next)=>{
    fn(req,res,next).catch((err)=>{
        next(err)
    })
 }

}

export const GlobleErrorHandeler = (err,req,res,next)=>{
    err.statusCode = err.statusCode || 500;

    res.status(err.statusCode).json({status: err.status || 'error',message: err.message, 
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined 
  });
}