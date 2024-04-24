import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Veuillez fournir un titre."],
    minLength: [3, "Le titre doit contenir au moins 3 caractères !"],
    maxLength: [30, "Le titre ne peut pas dépasser 30 caractères !"],
  },
  description: {
    type: String,
    required: [true, "Veuillez fournir une description."],
    minLength: [30, "La description doit contenir au moins 30 caractères !"],
    maxLength: [500, "La description ne peut pas dépasser 500 caractères !"],
  },
  category: {
    type: String,
    required: [true, "Veuillez fournir une catégorie."],
  },
  country: {
    type: String,
    required: [true, "Veuillez fournir un nom de pays."],
  },
  city: {
    type: String,
    required: [true, "Veuillez fournir un nom de ville."],
  },
  location: {
    type: String,
    required: [true, "Veuillez fournir une localisation."],
    minLength: [20, "La localisation doit contenir au moins 20 caractères !"],
  },
  fixedSalary: {
    type: Number,
    min: [100, "Le salaire doit contenir au moins 3 chiffres"],
    max: [999999999, "Le salaire ne peut pas dépasser 9 chiffres"],
  },
  salaryFrom: {
    type: Number,
    min: [100, "Le salaire doit contenir au moins 3 chiffres"],
    max: [999999999, "Le salaire ne peut pas dépasser 9 chiffres"],
  },
  salaryTo: {
    type: Number,
    min: [100, "Le salaire doit contenir au moins 3 chiffres"],
    max: [999999999, "Le salaire ne peut pas dépasser 9 chiffres"],
  },
  expired: {
    type: Boolean,
    default: false,
  },
  jobPostedOn: {
    type: Date,
    default: Date.now,
  },
  postedBy: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
});

export const Job = mongoose.model("Job", jobSchema);
