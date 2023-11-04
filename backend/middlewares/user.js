import Note from "../models/Notes.js";

export const getMyNotes = async (req, res) => {
  try {
    // Check if the user is authenticated
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required." });
    }

    const page = parseInt(req.query.page) || 1; // Current page
    const pageSize = parseInt(req.query.pageSize) || 10; // Number of notes per page

    // Calculate the starting index for notes on the current page
    const startIndex = (page - 1) * pageSize;

    // Get the user ID from the authenticated user
    const userId = req.user.id;

    // Fetch the user's notes with pagination
    const userNotes = await Note.find({ user: userId })
      .skip(startIndex) // Skip notes on previous pages
      .limit(pageSize); // Limit the number of notes on the current page

    // Count the total number of notes for the user
    const totalUserNotes = await Note.countDocuments({ user: userId });

    return res.status(200).json(
      userNotes
    );
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getNoteById = async (req, res) => {
  try {
    const { noteId } = req.params;

    // Find the note by ID
    const note = await Note.findById(noteId);

    if (!note) {
      return res.status(404).json({ message: "Note not found." });
    }

    // Check if the note belongs to the authenticated user (you should implement this check)
    if (!isNoteBelongsToCurrentUser(req.user, note)) {
      return res
        .status(403)
        .json({ message: "You are not authorized to access this note." });
    }

    return res.status(200).json(note);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const createNote = async (req, res) => {
  try {
    // Check if the user is authenticated
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required." });
    }

    // Extract note data from the request body
    const { title, content, isPublic } = req.body;

    // Create a new note
    const newNote = new Note({
      user: req.user.id, // Associate the note with the authenticated user
      title,
      content,
      isPublic, // You can set this value as needed
    });

    // Save the new note to the database
    await newNote.save();

    return res
      .status(201)
      .json({ message: "Note created successfully.", note: newNote });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateNoteById = async (req, res) => {
  try {
    const { noteId } = req.params;

    // Find the note by ID
    const note = await Note.findById(noteId);

    if (!note) {
      return res.status(404).json({ message: "Note not found." });
    }

    // Check if the note belongs to the authenticated user
    if (!isNoteBelongsToCurrentUser(req.user, note)) {
      return res
        .status(403)
        .json({ message: "You are not authorized to update this note." });
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

export const deleteNoteById = async (req, res) => {
  try {
    const { noteId } = req.params;

    // Find the note by ID
    const note = await Note.findById(noteId);

    if (!note) {
      return res.status(404).json({ message: "Note not found." });
    }

    // Check if the note belongs to the authenticated user
    if (!isNoteBelongsToCurrentUser(req.user, note)) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this note." });
    }

    // Delete the note
    await note.remove();

    return res.status(200).json({ message: "Note deleted successfully." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Function to check if the note belongs to the authenticated user
function isNoteBelongsToCurrentUser(user, note) {
  return user && note.user.equals(user.id);
}

export const getTopPublicNotes = async (req, res) => {
  try {
    // Query the database to find the top 10 public notes sorted by the most recent
    const publicNotes = await Note.find({ isPublic: true })
      .sort({ createdAt: -1 }) // Sort by createdAt in descending order (most recent first)
      .limit(10); // Limit the result to the top 10 notes

    return res.status(200).json(publicNotes);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
