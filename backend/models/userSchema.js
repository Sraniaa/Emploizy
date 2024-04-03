import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Veuillez entrer votre nom !"],
    minLength: [3, "Le nom doit contenir au moins 3 caractères !"],
    maxLength: [30, "Le nom ne peut pas dépasser 30 caractères !"],
  },
  email: {
    type: String,
    required: [true, "Veuillez entrer votre adresse e-mail !"],
    validate: [
      validator.isEmail,
      "Veuillez fournir une adresse e-mail valide !",
    ],
  },
  phone: {
    type: Number,
    required: [true, "Veuillez entrer votre numéro de téléphone !"],
  },
  password: {
    type: String,
    required: [true, "Veuillez fournir un mot de passe !"],
    minLength: [8, "Le mot de passe doit contenir au moins 8 caractères !"],
    maxLength: [32, "Le mot de passe ne peut pas dépasser 32 caractères !"],
    select: false,
  },
  role: {
    type: String,
    required: [true, "Veuillez sélectionner un rôle"],
    enum: ["Chercheur d'emploi", "Employeur"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Encrypting the password when the user registers or modifies his password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 10);
});

// Comparing the user password entered by user with the user saved password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generating a JWT token when a user registers or logs in
userSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};

export const User = mongoose.model("User", userSchema);
