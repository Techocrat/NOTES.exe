import React, { useContext, useEffect, useState } from "react";
import NoteList from "./NoteList";
import { AuthContext } from "../context/AuthContext";

// An array of notes from other users

const PublicNotes = () => {
  let { token } = useContext(AuthContext);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  console.log(token);

  const fetchNotes = async () => {
    try {
      const response = await fetch(
        "http://localhost:6001/users/top-public-notes",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        const data = await response.json();
        setData(data);
        setLoading(false);
        console.log(data);
      } else {
        setError("Error fetching notes");
        setLoading(false);
      }
    } catch (err) {
      setError(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <>
      <br />
      <div className="flex flex-col pl-5 pr-5" items-center justify-center>
        <NoteList notes={data} />
      </div>
    </>
  );
};

export default PublicNotes;
