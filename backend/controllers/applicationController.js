import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/error.js";
import { Application } from "../models/applicationSchema.js";
import { Job } from "../models/jobSchema.js";
import cloudinary from "cloudinary";

export const postApplication = catchAsyncErrors(async (req, res, next) => {
  const { role } = req.user;
  if (role === "Employeur") {
    return next(
      new ErrorHandler("L'employeur n'est pas autorisé à accéder à cette ressource.", 400)
    );
  }
  if (!req.files || Object.keys(req.files).length === 0) {
    return next(new ErrorHandler("Fichier de CV requis !", 400));
  }

  const { resume } = req.files;
  const allowedFormats = ["image/png", "image/jpeg", "image/webp"];
  if (!allowedFormats.includes(resume.mimetype)) {
    return next(
      new ErrorHandler("Type de fichier invalide. Veuillez télécharger un fichier PNG.", 400)
    );
  }
  const cloudinaryResponse = await cloudinary.uploader.upload(
    resume.tempFilePath
  );

  if (!cloudinaryResponse || cloudinaryResponse.error) {
    console.error(
      "Erreur Cloudinary:",
      cloudinaryResponse.error || "Erreur Cloudinary inconnue"
    );
    return next(new ErrorHandler("Échec du téléchargement du CV sur Cloudinary", 500));
  }
  const { name, email, coverLetter, phone, address, jobId } = req.body;
  const applicantID = {
    user: req.user._id,
    role: "Chercheur d'emploi",
  };
  if (!jobId) {
    return next(new ErrorHandler("Emploi non trouvé !", 404));
  }
  const jobDetails = await Job.findById(jobId);
  if (!jobDetails) {
    return next(new ErrorHandler("Emploi non trouvé !", 404));
  }

  const employerID = {
    user: jobDetails.postedBy,
    role: "Employeur",
  };
  if (
    !name ||
    !email ||
    !coverLetter ||
    !phone ||
    !address ||
    !applicantID ||
    !employerID ||
    !resume
  ) {
    return next(new ErrorHandler("Veuillez remplir tous les champs.", 400));
  }
  const application = await Application.create({
    name,
    email,
    coverLetter,
    phone,
    address,
    applicantID,
    employerID,
    resume: {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    },
  });
  res.status(200).json({
    success: true,
    message: "Candidature soumise !",
    application,
  });
});

export const employerGetAllApplications = catchAsyncErrors(
  async (req, res, next) => {
    const { role } = req.user;
    if (role === "Chercheur d'emploi") {
      return next(
        new ErrorHandler("Le chercheur d'emploi n'est pas autorisé à accéder à cette ressource.", 400)
      );
    }
    const { _id } = req.user;
    const applications = await Application.find({ "employerID.user": _id });
    res.status(200).json({
      success: true,
      applications,
    });
  }
);

export const jobseekerGetAllApplications = catchAsyncErrors(
  async (req, res, next) => {
    const { role } = req.user;
    if (role === "Employeur") {
      return next(
        new ErrorHandler("L'employeur n'est pas autorisé à accéder à cette ressource.", 400)
      );
    }
    const { _id } = req.user;
    const applications = await Application.find({ "applicantID.user": _id });
    res.status(200).json({
      success: true,
      applications,
    });
  }
);

export const jobseekerDeleteApplication = catchAsyncErrors(
  async (req, res, next) => {
    const { role } = req.user;
    if (role === "Employeur") {
      return next(
        new ErrorHandler("L'employeur n'est pas autorisé à accéder à cette ressource.", 400)
      );
    }
    const { id } = req.params;
    const application = await Application.findById(id);
    if (!application) {
      return next(new ErrorHandler("Candidature non trouvée !", 404));
    }
    await application.deleteOne();
    res.status(200).json({
      success: true,
      message: "Candidature supprimée !",
    });
  }
);
export const updateJobseekerApplication = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params; // Assume 'id' is the application ID
  const { role, _id } = req.user;
  
  if (role !== "Chercheur d'emploi") {
    return next(new ErrorHandler("Seul le chercheur d'emploi est autorisé à mettre à jour la candidature.", 400));
  }
  
  const application = await Application.findOne({ _id: id, "applicantID.user": _id });
  if (!application) {
    return next(new ErrorHandler("Candidature non trouvée !", 404));
  }

  const fieldsToUpdate = req.body;
  if (req.files && req.files.resume) {
    const resumeFile = req.files.resume;
    // Validate file type or other constraints here

    const cloudinaryResponse = await cloudinary.uploader.upload(resumeFile.tempFilePath, {
      folder: "resume_uploads" // assuming you want to organize in a folder
    });
    fieldsToUpdate.resume = {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url
    };
  }

  const updatedApplication = await Application.findByIdAndUpdate(
    id,
    { $set: fieldsToUpdate },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    message: "Candidature mise à jour avec succès.",
    application: updatedApplication
  });
});