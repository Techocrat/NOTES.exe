import express from "express";
const router = express.Router();
import { verifyToken } from "../middlewares/auth.js";

import {
  createInvitationLink,
  deleteNote,
  editNote,
  listAllUsers,
  promoteToAdmin,
  updateNote,
  viewUserNotes,
} from "../middlewares/admin.js";


// GET ROUTES
// Create an invitation token by an admin
router.get("/create-invitation-link", verifyToken, createInvitationLink);

// get all users
router.get("/users", verifyToken, listAllUsers );
// get all notes of a user
router.get("/users/:userId/notes", verifyToken, viewUserNotes);
// edit a note
router.get("/edit-note/:noteId", verifyToken, editNote);


// PUT ROUTES
// Update user role to admin (accessible to admins only)
router.put("/promote-to-admin/:userId", verifyToken, promoteToAdmin);
// Update Note (accessible to admins only)
router.put("/update-note/:noteId", verifyToken, updateNote);


// DELETE ROUTES
// Delete Note (accessible to admins only)
router.delete("/delete-note/:noteId", verifyToken, deleteNote);

export default router;
