import React, { useContext, useState } from "react";
import Header from "./Header";
import { AuthContext } from "../context/AuthContext";

const CreateNewNote = () => {
  let { token } = useContext(AuthContext);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [checked, setChecked] = useState(false);
  const handleSaveNote = async () => {
    if (!title || !body) {
      // Ensure that both title and body are provided
      alert("Please fill in both title and note body.");
      return;
    }

    try {
      // Make an API request to save the note to the database
      const response = await fetch("http://localhost:6001/users/create-note", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: title,
          content: body,
          isPublic: checked,
        }),
      });

      if (response.status === 201) {
        // Note saved successfully
        alert("Note saved successfully!");
      } else {
        // Handle errors here, e.g., display an error message
        alert("Failed to save the note. Please try again.");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred while saving the note. Please try again.");
    }
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <div className="w-11/12 max-w-[700px] px-10 py-20 rounded-3xl bg-white border-2 border-gray-100">
          <div className="flex flex-col items-center justify-center">
            <h1 className="text-4xl font-semibold">Create new note!!</h1>
          </div>
          <br />
          <input
            type="text"
            className="w-full border-2 border-gray-100 p-4 mt-1 bg-transparent font-bold"
            placeholder="Enter your title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            maxLength="200"
            className="w-full border-2 border-gray-100 p-4 mt-1 h-50"
            placeholder="Add your note (max 200 characters)"
            rows={10}
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
          <label className="relative inline-flex items-center mr-5 cursor-pointer m-2">
            <input
              type="checkbox"
              value={!checked}
              className="sr-only peer"
              onClick={() => setChecked(!checked)}
            />
            <div class="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-focus:ring-4 peer-focus:ring-yellow-300 dark:peer-focus:ring-yellow-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-yellow-400"></div>
            <span class="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
              Make this note as public
            </span>
          </label>

          <div className="mt-8 flex flex-col gap-y-4">
            <button
              onClick={handleSaveNote}
              className="active:scale-[.98] active:duration-75 transition-all hover:scale-[1.01] ease-in-out transform py-4 bg-green-500 rounded-xl text-white font-bold text-lg"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateNewNote;
