const express = require("express");
const router = express.Router();
const InviteToken = require("../models/InviteToken");
const User = require("../models/User");

const generateUniqueToken = require("../utils/generateUniqueToken");

// Create an invitation token by an admin
router.post("/create-invitation-link", async (req, res) => {
  try {
    // Check if the user making the request is an admin
    const { adminId } = req.body; // Assuming you have admin's user ID in the request body
    const admin = await User.findById(adminId);

    if (!admin || !admin.isAdmin) {
      return res
        .status(403)
        .json({ message: "You are not authorized to create invitations." });
    }

    // Generate a unique invite token
    const token = generateUniqueToken(); // You need to implement this function

    // Set the token's expiration date (e.g., one week from now)
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 7);

    // Create the invitation token in the database
    const inviteToken = new InviteToken({
      admin: adminId,
      token: token,
      expiryDate: expiryDate,
    });

    await inviteToken.save();

    return res
      .status(201)
      .json({ message: "Invitation created successfully.", token: token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// Update user role to admin (accessible to admins only)
router.put("/promote-to-admin/:userId", async (req, res) => {
  try {
    // Check if the user making the request is an admin
    if (!req.user.isAdmin) {
      return res
        .status(403)
        .json({ message: "You are not authorized to perform this action." });
    }

    // Get the user ID from the route parameter
    const { userId } = req.params;

    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Update the user's role to admin
    user.isAdmin = true;

    // Save the updated user
    await user.save();

    return res
      .status(200)
      .json({ message: "User promoted to admin successfully." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// List all users (accessible to admins only)
router.get("/users", async (req, res) => {
  try {
    // Check if the user making the request is an admin
    if (!req.user.isAdmin) {
      return res
        .status(403)
        .json({ message: "You are not authorized to view users." });
    }

    // Fetch all users
    const users = await User.find({}, "_id username isAdmin");

    return res.status(200).json(users);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// View user's notes (accessible to admins only)
router.get("/users/:userId/notes", async (req, res) => {
  try {
    // Check if the user making the request is an admin
    if (!req.user.isAdmin) {
      return res
        .status(403)
        .json({ message: "You are not authorized to view notes." });
    }

    // Get the user ID from the route parameter
    const { userId } = req.params;

    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Fetch the user's notes
    const userNotes = await Note.find({ user: userId });

    return res.status(200).json(userNotes);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// Edit Note (accessible to admins only)
router.get("/edit-note/:noteId", async (req, res) => {
  try {
    // Check if the user making the request is an admin
    if (!req.user.isAdmin) {
      return res
        .status(403)
        .json({ message: "You are not authorized to edit notes." });
    }

    // Get the note ID from the route parameter
    const { noteId } = req.params;

    // Find the note by ID
    const note = await Note.findById(noteId);

    if (!note) {
      return res.status(404).json({ message: "Note not found." });
    }

    return res.status(200).json(note);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// Update Note (accessible to admins only)
router.put("/update-note/:noteId", async (req, res) => {
  try {
    // Check if the user making the request is an admin
    if (!req.user.isAdmin) {
      return res
        .status(403)
        .json({ message: "You are not authorized to update notes." });
    }

    // Get the note ID from the route parameter
    const { noteId } = req.params;

    // Find the note by ID
    const note = await Note.findById(noteId);

    if (!note) {
      return res.status(404).json({ message: "Note not found." });
    }

    // Update note fields (e.g., title and content)
    if (req.body.title) {
      note.title = req.body.title;
    }
    if (req.body.content) {
      note.content = req.body.content;
    }

    // Save the updated note
    await note.save();

    return res.status(200).json({ message: "Note updated successfully." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// Delete Note (accessible to admins only)
router.delete("/delete-note/:noteId", async (req, res) => {
  try {
    // Check if the user making the request is an admin
    if (!req.user.isAdmin) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete notes." });
    }

    // Get the note ID from the route parameter
    const { noteId } = req.params;

    // Find the note by ID
    const note = await Note.findById(noteId);

    if (!note) {
      return res.status(404).json({ message: "Note not found." });
    }

    // Delete the note
    await note.remove();

    return res.status(200).json({ message: "Note deleted successfully." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
