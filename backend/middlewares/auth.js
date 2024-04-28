import { User } from "../models/userSchema.js";
import { catchAsyncErrors } from "./catchAsyncError.js";
import ErrorHandler from "./error.js";
import jwt from "jsonwebtoken";

export const isAuthenticated = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return next(new ErrorHandler("Utilisateur non autorisé", 401));
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

  req.user = await User.findById(decoded.id);

  next();
});

export const isAdmin = (req, res, next) => {
  if (req.user.role !== "Admin" && req.user.role !== "SuperAdmin") {
    return next(new ErrorHandler("Accès non autorisé", 403));
  }
  next();
};

export const isSuperAdmin = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return next(new ErrorHandler("Token non fourni", 401));
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await User.findById(decoded.id);
    if (!user || user.role !== "SuperAdmin") {
      return next(new ErrorHandler("Accès non autorisé", 403));
    }
    req.user = user;
    next();
  } catch (error) {
    return next(
      new ErrorHandler(
        "Erreur lors de la vérification du super administrateur",
        500
      )
    );
  }
};
