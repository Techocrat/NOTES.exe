import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom"; // Import Link for routing

const LandingPage = () => {
  let { handleGo, url, setUrl, homeError } = useContext(AuthContext);

  return (
    <div className="flex flex-col items-center justify-center p-20">
      <div className="bg-gray-100 px-20 py-8 rounded-lg shadow-lg text-center">
        <h1 className="text-3xl font-bold mb-4">
          Welcome to
          <div className="flex items-center justify-center">
            <img
              src="../assets/logo.png"
              alt="#"
              className="w-10 h-10 ml-2 mr-2"
            />
            <span className="text-2xl font-semibold m-4">Notes.exe</span>
          </div>
        </h1>
        <input
          type="text"
          placeholder="Paste the invite link"
          className="border border-gray-400 rounded-lg px-16 pl-10 py-5 mb-4" // Add margin-bottom
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
          <button
            onClick={handleGo}
            className="bg-green-500 hover:bg-green-700 text-white font-bold m-4 py-5 px-6 rounded-lg"
          >
            Create account
          </button>
          {homeError && <p className="text-red-500 mt-2">{homeError}</p>}
      </div>
    </div>
  );
};

export default LandingPage;
