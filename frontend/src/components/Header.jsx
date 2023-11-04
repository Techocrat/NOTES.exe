import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";


const Header = () => {
  const { user, handleLogout } = useContext(AuthContext);
  return (
    <nav className="bg-white-200 border-b border-gray-300 text-black font-segoe-ui p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <h4 className="m-1">
            <img
              src="../assets/logo.png"
              alt="#"
              className="w-10 h-10 ml-4 mr-4"
            />
          </h4>
          <h1 className="text-2xl font-semibold">Notes.exe</h1>
        </div>

        {user ? (
          <>
            <div className="flex items-center pr-10 justify-between">
  <div className="flex flex-row items-center justify-center space-x-4">
    <Link to="/MyNotes">
      <button className="flex-1 w-32 h-12 bg-green-500 hover:bg-pink-500 text-white font-bold border-b-4 border-pink-700 hover:border-pink-700 rounded">
        My Notes
      </button>
    </Link>

    <Link to="/CreateNewNote">
      <button className="flex-1 w-32 h-12 bg-green-500 hover:bg-blue-500 text-white font-bold border-b-4 border-blue-700 hover:border-blue-700 rounded">
        New Note
      </button>
    </Link>

    <Link to="/view-public-notes">
      <button className="flex-1 w-32 h-12 bg-green-500 hover:bg-violet-500 text-white font-bold border-b-4 border-violet-700 hover:border-violet-700 rounded">
        Public Notes
      </button>
    </Link>

    <button
      onClick={handleLogout}
      className="flex-1 w-32 h-12 bg-green-500 hover:bg-red-500 text-white font-bold border-b-4 border-red-700 hover:border-red-700 rounded"
    >
      Logout
    </button>
  </div>
</div>

          </>
        ) : (
          <></>
        )}
      </div>
    </nav>
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
      <h2 className="text-2xl font-semibold">Hi {user.username} !</h2>
      {/* Add avatar image or styling here if needed */}
    </div>
  );
};

export default Header;
