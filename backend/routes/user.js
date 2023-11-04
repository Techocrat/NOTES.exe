import express from "express";
import { verifyToken } from "../middlewares/auth.js";
import {
  createNote,
  deleteNoteById,
  getMyNotes,
  getNoteById,
  getTopPublicNotes,
  updateNoteById,
} from "../middlewares/user.js";
const router = express.Router();

// POST ROUTES
// Create a new note
router.post("/create-note", verifyToken, createNote);


// GET ROUTES
// Get all notes of the authenticated user
router.get("/my-notes", verifyToken, getMyNotes);
// Get a note by ID
router.get("/notes/:noteId", verifyToken, getNoteById);
// Get top public notes
router.get("/top-public-notes", verifyToken, getTopPublicNotes);


// PUT ROUTES
// Update a note by ID
router.put("/update-notes/:noteId", verifyToken, updateNoteById);

// DELETE ROUTES
// Delete a note by ID
router.delete("/delete-notes/:noteId", verifyToken, deleteNoteById);

export default router;
