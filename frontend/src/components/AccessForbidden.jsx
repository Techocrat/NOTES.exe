import React from "react";

function AccessForbidden() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold text-red-500">Access Forbidden</h1>
      <p className="mt-4 text-lg text-gray-500">
        You do not have permission to access this page.
      </p>
    </div>
  );
}

export default AccessForbidden;
