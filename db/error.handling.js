exports.customErrorHandler = ((err, request, response, next) => {
    if(err.status && err.message){
      response.status(err.status).send({msg: err.message})
    } else{
      next(err)
    }
  })  
