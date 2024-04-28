import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import { User } from "../models/userSchema.js";
import ErrorHandler from "../middlewares/error.js";
import { sendToken } from "../utils/jwtToken.js";
import { Job } from "../models/jobSchema.js";
import mongoose from 'mongoose';

export const createAdminAccount = catchAsyncErrors(async (req, res, next) => {
  const { name, email, phone, password, role } = req.body;

  // Vérification si l'email n'est pas déjà utilisé
  const isEmailExist = await User.findOne({ email });
  if (isEmailExist) {
    return next(new ErrorHandler("Cet email est déjà utilisé !", 400));
  }

  // Création du compte administrateur
  const admin = await User.create({
    name,
    email,
    phone,
    password,
    role,
  });

  // Envoi du token JWT pour le nouvel administrateur créé
  sendToken(admin, 201, res, "Compte administrateur créé avec succès !");
});

// Gérer les utilisateurs (CRUD)

// Afficher tous les utilisateurs
export const getAllUsers = catchAsyncErrors(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    success: true,
    users,
  });
});

// Mettre à jour un utilisateur
export const updateUser = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const userData = req.body;

  const user = await User.findByIdAndUpdate(id, userData, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    return next(new ErrorHandler("Utilisateur non trouvé.", 404));
  }

  res.status(200).json({
    success: true,
    message: "Utilisateur mis à jour avec succès.",
    user,
  });
});

// Supprimer un utilisateur
export const deleteUser = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  const user = await User.findById(id);

  if (!user) {
    return next(new ErrorHandler("Utilisateur non trouvé.", 404));
  }

  await user.remove();

  res.status(200).json({
    success: true,
    message: "Utilisateur supprimé avec succès.",
  });
});

// Gérer les offres d’emploi (CRUD)

// Afficher toutes les offres d'emploi
export const getAllJobs = catchAsyncErrors(async (req, res, next) => {
  try {
    const jobs = await Job.find();
    res.status(200).json({
      success: true,
      jobs,
    });
  } catch (error) {
    next(error);
  }
});
export const getJob = catchAsyncErrors(async (req, res, next) => {
  try {
    const jobId = req.params.id;
    
    // Check if the job ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(jobId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Job ID"
      });
    }

    // Find the job by its ID and populate the 'postedBy' field
    const job = await Job.findById(jobId).populate('postedBy', 'name email'); // Adjust the fields you want to populate

    // If no job is found, send a 404 response
    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found"
      });
    }

    // Respond with the job details
    res.status(200).json({
      success: true,
      job
    });
  } catch (error) {
    // Pass the error to your error-handling middleware
    next(error);
  }
});

// Mettre à jour une offre d'emploi
export const updateJob = catchAsyncErrors(async (req, res, next) => {
  try {
    const { id } = req.params;
    const job = await Job.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });
    if (!job) {
      return next(new ErrorHandler("OOPS ! Emploi non trouvé.", 404));
    }
    res.status(200).json({
      success: true,
      message: "Emploi mis à jour !",
      job,
    });
  } catch (error) {
    next(error);
  }
});

// Supprimer une offre d'emploi
export const deleteJob = catchAsyncErrors(async (req, res, next) => {
  try {
    const { id } = req.params;
    const job = await Job.findById(id);
    if (!job) {
      return next(new ErrorHandler("OOPS ! Emploi non trouvé.", 404));
    }
    await job.remove();
    res.status(200).json({
      success: true,
      message: "Emploi supprimé !",
    });
  } catch (error) {
    next(error);
  }
});

