const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const errorCode = err.code || 'ERR_500';
  const message = err.message || 'Beklenmeyen bir hata oluştu.';

  const response = {
    success: false,
    code: errorCode,
    message: message,
  };

  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack;
    response.details = err;
  }

  res.status(statusCode).json(response);
};

module.exports = errorHandler;
