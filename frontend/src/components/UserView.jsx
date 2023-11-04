import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import MyNoteList from "./MyNoteList";

const UserView = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { user, token } = useContext(AuthContext);

  const fetchNotes = async () => {
    try {
      const response = await fetch("http://localhost:6001/users/my-notes", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
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
      <div className="flex flex-col items-center justify-center py-2">
        <Avatar user={user} />
        <div className="flex flex-col items-center justify-center">
          <div className="flex flex-col pl-5 pr-5" items-center justify-center>
            <MyNoteList notes={data} setNotes={setData} /> {/* Pass setNotes */}
          </div>
        </div>
      </div>
    </>
  );
};

const Avatar = ({ user }) => {
  const sizes = {
    sm: "h-8 w-8",
    md: "h-12 w-12",
    lg: "h-16 w-16",
  };

  return (
    <div className="flex items-center pr-4">
      <h1 className="text-4xl font-semibold m-4">Hi {user.username} !</h1>
      {/* Add avatar image or styling here if needed */}
    </div>
  );
};

export default UserView;
