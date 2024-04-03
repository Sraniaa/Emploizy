import mongoose from "mongoose";
import validator from "validator";

const applicationSchema = new mongoose.Schema({
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
  coverLetter: {
    type: String,
    required: [true, "Veuillez fournir une lettre de motivation !"],
  },
  phone: {
    type: Number,
    required: [true, "Veuillez entrer votre numéro de téléphone !"],
  },
  address: {
    type: String,
    required: [true, "Veuillez entrer votre adresse !"],
  },
  resume: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  applicantID: {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    role: {
      type: String,
      enum: ["Chercheur d'emploi"],
      required: true,
    },
  },
  employerID: {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    role: {
      type: String,
      enum: ["Employeur"],
      required: true,
    },
  },
});

export const Application = mongoose.model("Application", applicationSchema);
