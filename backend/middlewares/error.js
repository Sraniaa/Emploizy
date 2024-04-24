class ErrorHandler extends Error {
  constructor(message, statusCode, errors = []) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors; // An array to store individual field errors
  }
}


export const errorMiddleware = (err, req, res, next) => {
  err.message = err.message || "Erreur interne du serveur";
  err.statusCode = err.statusCode || 500;

  if (err.name === "CastError") {
    const message = `Ressource non trouvée. ${err.path} invalide`,
      err = new ErrorHandler(message, 400);
  }
  if (err.code === 11000) {
    const message = `Entrée en double pour ${Object.keys(err.keyValue)}`,
      err = new ErrorHandler(message, 400);
  }
  if (err.name === "JsonWebTokenError") {
    const message = `Le jeton Web JSON est invalide, veuillez réessayer !`;
    err = new ErrorHandler(message, 400);
  }
  if (err.name === "TokenExpiredError") {
    const message = `Le jeton Web JSON a expiré, veuillez réessayer !`;
    err = new ErrorHandler(message, 400);
  }
  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map(val => val.message);
    err = new ErrorHandler("La validation a échoué", 400, errors);
  }
  // Modify the response to include the errors array if it exists
  const response = {
    success: false,
    message: err.message,
  };

  // Include errors array in response if it is not empty
  if (err.errors && err.errors.length > 0) {
    response.errors = err.errors;
  }

  return res.status(err.statusCode).json(response);
};


export default ErrorHandler;
