import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import UserView from "./components/UserView";
import PublicNotes from "./components/PublicNotes";
import Header from "./components/Header";
import PrivateRoute from "./utils/PrivateRoute";
import CreateNewNote from "./components/CreateNewNote";
import LandingPage from "./components/LandingPage";
import CreateInvite from "./components/CreateInvite";
import ViewNotes from "./components/ViewAllUsers";
import ViewUsers from "./components/ViewAllUsers";
import AdminView from "./components/AdminView";

function App() {
  return (
    <>
      <Header />
      <Routes>
      <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/view-public-notes"
          element={
            <PrivateRoute>
              <PublicNotes />
            </PrivateRoute>
          }
        />
        <Route
          path="/UserView"
          element={
            <PrivateRoute>
              <UserView />
            </PrivateRoute>
          }
        />
        <Route
          path="/CreateNewNote"
          element={
            <PrivateRoute>
              <CreateNewNote />
            </PrivateRoute>
          }
        />
        <Route
          path="/MyNotes"
          element={
            <PrivateRoute>
              <UserView />
            </PrivateRoute>
          }
        />
        <Route
          path="/CreateInvite"
          element={
            <PrivateRoute>
              <CreateInvite />
            </PrivateRoute>
          }
          
        />

         <Route
          path="/ViewAllUsers"
          element={
            <PrivateRoute>
              <ViewUsers />
            </PrivateRoute>
          }
          />

          <Route
          path="/ViewUserNotes/:userId"
          element={
            <PrivateRoute>
              <AdminView />
            </PrivateRoute>
          }
          />

      </Routes>
    </>
  );
}

export default App;
