import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import AccessForbidden from "../components/AccessForbidden";

const PrivateRoute = ({ children, isAdmin }) => {
  let { user } = useContext(AuthContext);
  let userIsAdmin = user && user.isAdmin;
  return user ? (
    isAdmin ? (
      userIsAdmin ? (
        children
      ) : (
        <AccessForbidden />
      )
    ) : (
      children
    )
  ) : (
    <Navigate to={"/login"} />
  );
};

export default PrivateRoute;
