import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";

const MyNoteList = ({ notes, setNotes }) => {
  const [editingNote, setEditingNote] = useState(null);
  const [editedNote, setEditedNote] = useState({ title: "", content: "" });
  const { token } = useContext(AuthContext);
  
  const handleDelete = async (noteId) => {
    try {
      const res = await fetch(
        `http://localhost:6001/users/delete-notes/${noteId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status === 200) {
        // Note deleted successfully
        alert("Note deleted successfully!");

        // Update the list of notes in your state by filtering out the deleted note
        setNotes(notes.filter((note) => note._id !== noteId));
      } else {
        // Failed to delete the note
        alert("Failed to delete the note. Please try again.");
      }
    } catch (error) {
      console.error(error);
      // An error occurred while deleting the note
      alert("An error occurred while deleting the note. Please try again.");
    }
  };

  const handleEdit = (noteId) => {
    setEditingNote(noteId);

    // Find the note to edit by its ID and pre-fill the form with its content
    const noteToEdit = notes.find((note) => note._id === noteId);
    if (noteToEdit) {
      setEditedNote({ title: noteToEdit.title, content: noteToEdit.content });
    }
  };

  const handleSaveEdit = async (noteId) => {
    try {
      const res = await fetch(
        `http://localhost:6001/users/update-notes/${noteId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: editedNote.title,
            content: editedNote.content,
          }),
        }
      );

      if (res.status === 200) {
        // Note edited successfully
        alert("Note edited successfully!");

        // You may also want to update the list of notes in your state here
        const updatedNotes = notes.map((note) =>
          note._id === noteId
            ? { ...note, title: editedNote.title, content: editedNote.content }
            : note
        );
        setNotes(updatedNotes);

        // Reset editing state
        setEditingNote(null);
        setEditedNote({ title: "", content: "" });
      } else {
        // Failed to edit the note
        alert("Failed to edit the note. Please try again.");
      }
    } catch (error) {
      console.error(error);
      // An error occurred while editing the note
      alert("An error occurred while editing the note. Please try again.");
    }
  };

  return (
    <div className="text-center">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {notes.map((note) => (
          <div
            key={note._id}
            className="bg-yellow-100 rounded-lg shadow-md p-4 flex flex-col h-full"
          >
            <div>
              {editingNote === note._id ? (
                <input
                  type="text"
                  placeholder="Edit title"
                  value={editedNote.title}
                  onChange={(e) =>
                    setEditedNote({ ...editedNote, title: e.target.value })
                  }
                />
              ) : (
                <h3 className="text-xl font-semibold mb-2">{note.title}</h3>
              )}
              {editingNote === note._id ? (
                <textarea
                  placeholder="Edit content"
                  value={editedNote.content}
                  onChange={(e) =>
                    setEditedNote({ ...editedNote, content: e.target.value })
                  }
                />
              ) : (
                <p className="text-gray-600 mb-2">{note.content}</p>
              )}
            </div>
            <div className="flex-grow"></div>
            <div className="text-yellow-700">
              Owner: {note.ownerName} | Created At: {note.createdAt}
            </div>

            <div className="mt-4 flex space-x-4">
              {editingNote === note._id ? (
                <button
                  onClick={() => handleSaveEdit(note._id)}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
                >
                  Save
                </button>
              ) : (
                <button
                  onClick={() => handleEdit(note._id)}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
                >
                  Edit
                </button>
              )}
              <button
                onClick={() => handleDelete(note._id)}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyNoteList;
