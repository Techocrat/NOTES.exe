import React, { createContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

const AuthContextProvider = (props) => {
  const navigate = useNavigate();

  const [url, setUrl] = useState("");
  const [homeError, setHomeError] = useState("");
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [token, setToken] = useState("");
  const [inviteToken, setInviteToken] = useState("");
  const [loading, setLoading] = useState(false);
  let location = useLocation();
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
        localStorage.setItem("token", token);
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

  const handleGo = async () => {
    const startIndex = url.indexOf("invitetoken=");
    console.log(startIndex);

    if (startIndex !== -1) {
      const endIndex = url.indexOf("&", startIndex);
      const invite = url.slice(
        startIndex + "invitetoken=".length,
        endIndex !== -1 ? endIndex : undefined
      );

      console.log(invite); // Output: "abc123"
      try {
        const response = await fetch("http://localhost:6001/auth/checkToken", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            invite: invite,
          }),
        });
        if (response.status === 200) {
          let data = await response.json();
          console.log(data);
          setInviteToken(invite);
          setUrl("");
          navigate("/Register"); // Update with your actual route
        } else {
          let data = await response.json();
          let { message } = data;
          setHomeError(message);
          setInviteToken("");
          setUrl("");
          navigate("/");
        }
      } catch (error) {
        console.error(error);
        setHomeError("An error occurred. Please try again later.");
        setInviteToken("");
        setUrl("");
        navigate("/");
      }
    } else {
      console.log("Invalid token!");
    }
  };

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    navigate("/");
    localStorage.removeItem("token");
  };

  useEffect(() => {
    let token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwtDecode(token);
      console.log(decodedToken);

      setUser(decodedToken.user);
      setToken(token);
      const currentTime = Math.floor(Date.now() / 1000); // Convert milliseconds to seconds
      const expirationTime = decodedToken.iat + 7 * 24 * 60 * 60;

      if (expirationTime < currentTime) {
        console.log("Token expired!");
        handleLogout();
      }

      let currentUrl = location.pathname;

      console.log(currentUrl);
      if (
        currentUrl === "/login" ||
        currentUrl === "/register" ||
        currentUrl === "/"
      ) {
        navigate("/UserView");
      } else {
        navigate(currentUrl);
      }
    }
  }, []);

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
        homeError: homeError,
        url: url,
        setUrl: setUrl,
        handleGo: handleGo,
        inviteToken: inviteToken,
        setInviteToken: setInviteToken,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
