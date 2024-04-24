import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";
import { Job } from "../models/jobSchema.js";
import ErrorHandler from "../middlewares/error.js";

// Middleware to check if the user is an employer
const checkEmployerRole = (req, res, next) => {
  const { role } = req.user;
  if (role !== "Employeur") {
    return next(new ErrorHandler("Operation not allowed. Only employers are permitted.", 403));
  }
  next();
};

// Middleware to find a job by ID and attach it to the request
const findJob = async (req, res, next) => {
  const job = await Job.findById(req.params.id);
  if (!job) {
    return next(new ErrorHandler("Job not found.", 404));
  }
  req.job = job; // Attach job to request
  next();
};

export const getAllJobs = catchAsyncErrors(async (req, res) => {
  const jobs = await Job.find({ expired: false });
  if (!jobs.length) {
    throw new ErrorHandler("No jobs found.", 404);
  }
  res.status(200).json({ success: true, jobs });
});

export const postJob = [checkEmployerRole, catchAsyncErrors(async (req, res) => {
  const { title, description, category, country, city, location, fixedSalary, salaryFrom, salaryTo } = req.body;

  if (!title || !description || !category || !country || !city || !location ||
      ((!salaryFrom || !salaryTo) && !fixedSalary) ||
      (salaryFrom && salaryTo && fixedSalary)) {
    throw new ErrorHandler("Please provide all required fields correctly.", 400);
  }

  const job = await Job.create({
    ...req.body, postedBy: req.user._id
  });

  res.status(201).json({ success: true, message: "Job posted successfully.", job });
})];

export const getMyJobs = [checkEmployerRole, catchAsyncErrors(async (req, res) => {
  const myJobs = await Job.find({ postedBy: req.user._id });
  if (!myJobs.length) {
    throw new ErrorHandler("No published jobs found.", 404);
  }
  res.status(200).json({ success: true, myJobs });
})];

export const updateJob = [checkEmployerRole, findJob, catchAsyncErrors(async (req, res) => {
  const updatedJob = await Job.findByIdAndUpdate(req.job._id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({ success: true, message: "Job updated successfully.", job: updatedJob });
})];

export const deleteJob = [checkEmployerRole, findJob, catchAsyncErrors(async (req, res) => {
  await req.job.deleteOne();
  res.status(200).json({ success: true, message: "Job deleted successfully." });
})];

export const getSingleJob = [findJob, catchAsyncErrors(async (req, res) => {
  res.status(200).json({ success: true, job: req.job });
})];
