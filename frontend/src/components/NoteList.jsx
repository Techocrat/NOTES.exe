
import React from "react";

const NoteList = ({ notes }) => {
  return (
    <div className="text-center">
      {" "}
      {/* Center-align the content */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {notes.map((note) => (
          <div
            key={note.id}
            className="bg-yellow-100 rounded-lg shadow-md p-4 flex flex-col h-full"
          >
            <div>
              <h3 className="text-xl font-semibold mb-2">{note.title}</h3>
              <p className="text-gray-600 mb-2">{note.content}</p>
            </div>
            <div className="flex-grow"></div>{" "}
            <div className="text-yellow-700">
              Owner: {note.ownerName} | Created At: {note.createdAt}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NoteList;
