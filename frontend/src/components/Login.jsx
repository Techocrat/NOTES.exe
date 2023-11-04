import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
  let { handleLogin, email, setEmail, password, setPassword, error } =
    useContext(AuthContext);

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <div className="w-11/12 max-w-[700px] px-10 py-20 rounded-3xl bg-white border-2 border-gray-100">
          <div className="flex flex-col items-center justify-center">
            <h1 className="text-5xl font-semibold">Welcome Back!!</h1>
            <p className="font-medium text-lg text-gray-500 mt-4">
              Login to explore Notes.exe
            </p>
          </div>
          <div className="mt-8">
            <div className="flex flex-col">
              <label className="text-lg font-medium">Email</label>
              <input
                className="w-full border-2 border-gray-100 rounded-xl p-4 mt-1 bg-transparent"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="flex flex-col mt-4">
              <label className="text-lg font-medium">Password</label>
              <input
                className="w-full border-2 border-gray-100 rounded-xl p-4 mt-1 bg-transparent"
                placeholder="Enter your password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && <p className="text-red-500 mt-2">{error}</p>}

            <div className="mt-8 flex flex-col gap-y-4">
              <button
                onClick={handleLogin}
                className="active:scale-[.98] active:duration-75 transition-all hover:scale-[1.01]  ease-in-out transform py-4 bg-green-500 rounded-xl text-white font-bold text-lg"
              >
                Sign in
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
