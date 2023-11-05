import React from "react";

const UserList = ({ users }) => {
  return (
    <div className="text-center">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {users.map((user) => (
          <div
            key={user.id}
            className="bg-blue-100 rounded-lg shadow-md p-4 flex flex-col h-full"
          >
            <div>
              <h3 className="text-xl font-semibold mb-2">{user.username}</h3>
              <p className="text-gray-600 mb-2">Email: {user.email}</p>
              {/* Add other user details as needed */}
            </div>
            <div className="flex-grow"></div>
            {/* Additional user-specific information */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserList;
