import express from "express";
import {
  createAdminAccount,
  getAllUsers,
  updateUser,
  deleteUser,
  getAllJobs,
  updateJob,
  deleteJob,
  getJob,
} from "../controllers/adminController.js";
import { isAuthenticated, isAdmin, isSuperAdmin } from "../middlewares/auth.js";

const router = express.Router();

// Route pour la création de compte administrateur (accessible uniquement par un super administrateur)
router.post("/create-admin", isAuthenticated, isSuperAdmin, createAdminAccount);
//router.get("/admins", isAuthenticated, isAdmin, getAllAdmins);


// Routes pour la gestion des utilisateurs (CRUD)
router.get("/users", isAuthenticated, isAdmin, getAllUsers);
//router.get("/users/:id", isAuthenticated, isAdmin, getUser);
router.put("/users/:id", isAuthenticated, isAdmin, updateUser);
router.delete("/users/:id", isAuthenticated, isAdmin, deleteUser);

// Routes pour la gestion des offres d'emploi (CRUD)
router.get("/jobs",  getAllJobs);
router.put("/jobs/:id", isAuthenticated, isAdmin, updateJob);
router.delete("/jobs/:id", isAuthenticated, isAdmin, deleteJob);
router.get("/jobs/:id", isAuthenticated, isAdmin, getJob);

export default router;
