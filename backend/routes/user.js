import express from 'express';
const router = express.Router();


// Get all notes of the currently authenticated user
router.get("/my-notes", async (req, res) => {
  try {
    // Check if the user is authenticated
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required." });
    }

    // Get the user ID from the authenticated user
    const userId = req.user._id;

    // Fetch all notes for the authenticated user
    const userNotes = await Note.find({ user: userId });

    return res.status(200).json(userNotes);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

// Get one specific note by ID
router.get("/notes/:noteId", async (req, res) => {
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
});

// Update one specific note by ID
router.put("/notes/:noteId", async (req, res) => {
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
});

// Delete one specific note by ID
router.delete("/notes/:noteId", async (req, res) => {
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
});

// Function to check if the note belongs to the authenticated user
function isNoteBelongsToCurrentUser(user, note) {
  return user && note.user.equals(user._id);
}

// Create a new note
router.post("/create-note", async (req, res) => {
  try {
    // Check if the user is authenticated
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required." });
    }

    // Extract note data from the request body
    const { title, content } = req.body;

    // Create a new note
    const newNote = new Note({
      user: req.user._id, // Associate the note with the authenticated user
      title,
      content,
      isPublic: false, // You can set this value as needed
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
});

// View the top 10 recently posted public notes
router.get("/top-public-notes", async (req, res) => {
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
});

export default router;
