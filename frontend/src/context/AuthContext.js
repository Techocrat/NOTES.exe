import React, { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

const AuthContextProvider = (props) => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please fill in both email and password fields.");
      return;
    }

    try {
      const response = await fetch("http://localhost:6001/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (response.status === 200) {
        // Redirect to UserView after successful login
        let data = await response.json();
        console.log(data);
        const { token, user } = data;
        console.log(token, user);

        setToken(token);
        setUser(user);
        setEmail("");
        setPassword("");
        setError("");

        navigate("/UserView"); // Update with your actual route
      } else {
        setError("Login failed. Please check your credentials.");
        setEmail("");
        setPassword("");
      }
    } catch (error) {
      console.error(error);
      setError("An error occurred. Please try again later.");
      setEmail("");
      setPassword("");
    }
  };

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user: user,
        email: email,
        setEmail: setEmail,
        password: password,
        setPassword: setPassword,
        error: error,
        setError: setError,
        handleLogin: handleLogin,
        handleLogout: handleLogout,
        token: token,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
