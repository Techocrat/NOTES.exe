import Note from "../models/Notes.js";
import InviteToken from "../models/Token.js";
import User from "../models/User.js";

export const createInvitationLink = async (req, res) => {
  try {
    // Check if the user making the request is an admin
    console.log(req.user);
    let fetch_user = await User.findOne({ _id: req.user.id });
    if (!fetch_user.isAdmin) {
      return res
        .status(403)
        .json({ message: "You are not authorized to create invitations." });
    }

    // Generate a unique invite token
    const token = await generateUniqueToken(); // You need to implement this function
    console.log(token);

    // Set the token's expiration date (e.g., one week from now)
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 7);

    // Create the invitation token in the database
    const inviteToken = new InviteToken({
      admin: fetch_user,
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
};

export const listAllUsers = async (req, res) => {
  try {
    // Check if the user making the request is an admin
    let fetch_user = await User.findOne({ _id: req.user.id });
    if (!fetch_user.isAdmin) {
      return res
        .status(403)
        .json({ message: "You are not authorized view all users." });
    }

    const page = parseInt(req.query.page) || 1; // Current page
    const pageSize = parseInt(req.query.pageSize) || 10; // Number of users per page

    // Calculate the starting index for users on the current page
    const startIndex = (page - 1) * pageSize;

    // Fetch users with pagination
    const users = await User.find({})
      .skip(startIndex) // Skip users on previous pages
      .limit(pageSize); // Limit the number of users on the current page

    // Count the total number of users in the database
    const totalUsers = await User.countDocuments();

    return res.status(200).json({
      users,
      currentPage: page,
      totalPages: Math.ceil(totalUsers / pageSize),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const viewUserNotes = async (req, res) => {
  try {
    // Check if the user making the request is an admin
    let fetch_user = await User.findOne({ _id: req.user.id });
    if (!fetch_user.isAdmin) {
      return res.status(403).json({
        message: "You are not authorized to view notes of other users",
      });
    }

    // Get the user ID from the route parameter
    const { userId } = req.params;

    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const page = parseInt(req.query.page) || 1; // Current page
    const pageSize = parseInt(req.query.pageSize) || 10; // Number of notes per page

    // Calculate the starting index for notes on the current page
    const startIndex = (page - 1) * pageSize;

    // Fetch the user's notes with pagination
    const userNotes = await Note.find({ user: userId })
      .skip(startIndex) // Skip notes on previous pages
      .limit(pageSize); // Limit the number of notes on the current page

    // Count the total number of notes for the user
    const totalUserNotes = await Note.countDocuments({ user: userId });

    return res.status(200).json({
      userNotes,
      currentPage: page,
      totalPages: Math.ceil(totalUserNotes / pageSize),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const editNote = async (req, res) => {
  try {
    // Check if the user making the request is an admin
    let fetch_user = await User.findOne({ _id: req.user.id });
    if (!fetch_user.isAdmin) {
      return res.status(403).json({
        message: "You are not authorized to edit notes of other users.",
      });
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
};

export const promoteToAdmin = async (req, res) => {
  try {
    // Check if the user making the request is an admin
    let fetch_user = await User.findOne({ _id: req.user.id });
    if (!fetch_user.isAdmin) {
      return res
        .status(403)
        .json({ message: "You are not authorized to promote users!" });
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
};

export const updateNote = async (req, res) => {
  try {
    // Check if the user making the request is an admin
    let fetch_user = await User.findOne({ _id: req.user.id });
    if (!fetch_user.isAdmin) {
      return res
        .status(403)
        .json({ message: "You are not authorized to update." });
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
};

export const deleteNote = async (req, res) => {
  try {
    // Check if the user making the request is an admin
    let fetch_user = await User.findOne({ _id: req.user.id });
    if (!fetch_user.isAdmin) {
      return res
        .status(403)
        .json({ message: "You are not authorized to create invitations." });
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
};
