import React, { useContext, useState, useEffect } from "react";
import Header from "./Header";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
const Register = () => {
  let navigate = useNavigate();
  let { inviteToken, setInviteToken } = useContext(AuthContext);
  console.log(inviteToken);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    token: inviteToken,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    let temp = { ...formData };
    temp[name] = value;
    setFormData(temp);
  };

  const handleRegistration = async () => {
    console.log("Registering...");
    try {
      const response = await fetch("http://localhost:6001/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.status === 201) {
        toast.success("Registration successful!");
        setInviteToken("");
        setFormData({
          username: "",
          email: "",
          password: "",
          token: "",
        });

        navigate("/login");
      } else {
        const data = await response.json();
        toast.error(data.error || "Registration failed. Please try again.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Registration failed. Please try again.");
    }
  };

  useEffect(() => {
    if (!inviteToken) {
      navigate("/");
    }
  }, []);

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <div className=" w-11/12 max-w-[700px] px-10 py-20 rounded-3xl bg-white border-2 border-gray-100">
          <div className="flex flex-col items-center justify-center">
            <h1 className="text-5xl font-semibold">Registration Form</h1>

            <p className="font-medium text-lg text-gray-500 mt-4">
              Please create you account to continue
            </p>
          </div>
          <div className="mt-8">
            <div className="flex flex-col">
              <label className="text-lg font-medium">Username</label>
              <input
                className="w-full border-2 border-gray-100 rounded-xl p-4 mt-1 bg-transparent"
                placeholder="Enter your username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
              />
            </div>
            <div className="flex flex-col">
              <label className="text-lg font-medium">email</label>
              <input
                className="w-full border-2 border-gray-100 rounded-xl p-4 mt-1 bg-transparent"
                placeholder="Enter your email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
            <div className="flex flex-col mt-4">
              <label className="text-lg font-medium">Password</label>
              <input
                className="w-full border-2 border-gray-100 rounded-xl p-4 mt-1 bg-transparent"
                placeholder="Enter your email"
                type={"password"}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
              />
            </div>

            <div className="mt-8 flex flex-col gap-y-4">
              <button
                onClick={handleRegistration}
                className="active:scale-[.98] active:duration-75 transition-all hover:scale-[1.01]  ease-in-out transform py-4 bg-green-500 rounded-xl text-white font-bold text-lg"
              >
                Register
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
