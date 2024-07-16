exports.customErrorHandler = (err, request, response, next) => {
  if (err.status && err.message) {
    response.status(err.status).send({ msg: err.message });
  } else {
    next(err);
  }
};

exports.InternalServerError = (err, request, response, next) => {
  response.status(500).send({ msg: "Internal Server Error" });
};
