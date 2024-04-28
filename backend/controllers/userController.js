import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import { User } from "../models/userSchema.js";
import ErrorHandler from "../middlewares/error.js";
import { sendToken } from "../utils/jwtToken.js";

export const register = catchAsyncErrors(async (req, res, next) => {
  const { name, email, phone, password, role } = req.body;
  if (!name || !email || !phone || !password || !role) {
    return next(new ErrorHandler("Veuillez remplir le formulaire complet !"));
  }
  const isEmail = await User.findOne({ email });
  if (isEmail) {
    return next(new ErrorHandler("Email déjà enregistré !"));
  }
  const user = await User.create({
    name,
    email,
    phone,
    password,
    role,
  });
  sendToken(user, 201, res, "Utilisateur enregistré !");
});

export const login = catchAsyncErrors(async (req, res, next) => {
  const { email, password, role } = req.body;
  if (!email || !password || !role) {
    return next(new ErrorHandler("Veuillez fournir l'email, le mot de passe et le rôle."));
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Email ou mot de passe incorrect.", 400));
  }
  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Email ou mot de passe incorrect.", 400));
  }
  if (user.role !== role) {
    return next(new ErrorHandler(`Utilisateur avec l'email et le rôle ${role} fournis non trouvé !`, 404));
}

  sendToken(user, 201, res, "Utilisateur connecté !");
});

export const logout = catchAsyncErrors(async (req, res, next) => {
  res
    .status(201)
    .cookie("token", "", {
      httpOnly: true,
      expires: new Date(Date.now()),
    })
    .json({
      success: true,
      message: "Déconnecté avec succès.",
    });
});
// userController.js
export const updateUserProfile = catchAsyncErrors(async (req, res, next) => {
  // Fields that can be updated
  const allowedUpdates = ['name', 'phone'];
  const updates = Object.keys(req.body);
  
  // Check if requested updates are allowed
  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));
  
  if (!isValidOperation) {
    return next(new ErrorHandler("Requête de mise à jour invalide", 400));
  }
  
  try {
    updates.forEach((update) => req.user[update] = req.body[update]);
    await req.user.save();
    res.status(200).json({
      success: true,
      message: "Profil mis à jour avec succès",
    });
  } catch (error) {
    next(error);
  }
});

export const getUser = catchAsyncErrors((req, res, next) => {
  const user = req.user;
  res.status(200).json({
    success: true,
    user,
  });
});
