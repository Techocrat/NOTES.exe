import React, { useState, useEffect, useContext, useCallback } from "react";
import { AuthContext } from "../context/AuthContext";
import AdminUserList from "./AdminUserList";

const ViewUsers = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reload , setReload] = useState(false);

  const { token } = useContext(AuthContext);

  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:6001/admin/users", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        console.log(response);
        const users = await response.json();
        setData(users.users);
        setLoading(false); // Set loading to false once the data is fetched successfully.
      } else {
        setLoading(false);
      }
    } catch (err) {
      console.error("Error fetching users: " + err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [token]); // Include 'token' as a dependency for useEffect to refetch users when the token changes.

  return (
    <div className="flex flex-col items-center justify-center py-2">
      <div className="flex flex-col items-center justify-center">
        <div className="flex flex-col pl-5 pr-5" items-center justify-center>
          {loading ? <p>Loading users...</p> : <AdminUserList users={data} fetchUsers={fetchUsers} />}
        </div>
      </div>
    </div>
  );
};

export default ViewUsers;
