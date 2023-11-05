import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const AdminUserList = ({ users, fetchUsers }) => {
  let { token, user : puser } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  let navigate = useNavigate();

  const handleMakeAdmin = async (user) => {
    // Check if the user is already an admin
    setLoading(true);
    if (user.isAdmin) {
      const updatedUser = { ...user, isAdmin: false };

      fetch(`http://localhost:6001/admin/promote-to-admin/${user._id}`, {
        method: "PUT", // Use the appropriate HTTP method for updating data
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          // Include any authentication headers if required
        },
        body: JSON.stringify(updatedUser),
      })
        .then((response) => {
          if (response.status === 200) {
            fetchUsers();
            setLoading(false);
            // You may also update the user's isAdmin status in your component state here.
          } else {
            setLoading(false);
            toast.error("Failed to update user's admin status");
          }
        })
        .catch((error) => {
          setLoading(false);
          console.error("Error updating user's admin status:", error);
        });
    } else {
      // Make a request to update the user's isAdmin status
      const updatedUser = { ...user, isAdmin: true };

      fetch(`http://localhost:6001/admin/promote-to-admin/${user._id}`, {
        method: "PUT", // Use the appropriate HTTP method for updating data
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          // Include any authentication headers if required
        },
        body: JSON.stringify(updatedUser),
      })
        .then((response) => {
          if (response.status === 200) {
            fetchUsers();
            setLoading(false);
            // You may also update the user's isAdmin status in your component state here.
          } else {
            setLoading(false);
            toast.error("Failed to update user's admin status");
          }
        })
        .catch((error) => {
          setLoading(false);
          console.error("Error updating user's admin status:", error);
        });
    }
  };

  return (
    <div className="text-center">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {users.map((user) => {
          if (user.email !== puser.email) {
            
            return (
              <div
                key={user._id}
                className="bg-yellow-100 rounded-lg shadow-md p-4 flex flex-col border-2 border-gray-100 p-4 mt-1 h-50"
              >
                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    {user.username}
                  </h3>
                </div>
                <div className="flex-grow"></div>

                <div className="mt-4 flex space-x-4">
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
                    onClick={() => {
                      navigate(`/ViewUserNotes/${user._id}`);
                    }}
                  >
                    View Notes
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg disabled:opacity-75"
                    onClick={() => handleMakeAdmin(user)}
                    disabled={loading}
                  >
                    {user.isAdmin ? "Demote" : "Make Admin"}
                  </button>
                </div>
              </div>
            );
          }
        })}
      </div>
    </div>
  );
};

export default AdminUserList;
//
