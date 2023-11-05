import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import {toast} from "react-toastify";
const CopyToClipboardTextArea = () => {
  const inviteApiRoute = "http://notes.exe?refer-invitetoken=";

  const { token } = useContext(AuthContext);
  const [inviteToken, setInviteToken] = useState("");
  const [loading , setLoading] = useState(false)

  const fetchInvite = async () => {
    console.log("Fetching invite token");
    setLoading(true)
    try {
      const response = await fetch(
        "http://localhost:6001/admin/create-invitation-link",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        const data = await response.json();
        console.log(data.token);
        setInviteToken(data.token);
      } else {
        console.error("Error fetching invite token");
      }
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(inviteApiRoute + inviteToken)
      .then(() => {
        toast.success("Copied to clipboard!");
      })
      .catch((error) => {
        console.error("Error copying text to clipboard: " + error);
        toast.error("Error copying to clipboard!");
      });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 ">
      <div className="w-full items-center max-w-lg p-8 bg-white shadow-md rounded-lg">
        <h1 className="text-3xl py-4 font-semibold text-center">Invite Link</h1>
        <textarea
          readOnly
          value={loading ? "loading..." : inviteToken  ? inviteApiRoute + inviteToken : null}
          className="w-full border border-gray-300 p-2 rounded-lg resize-none "
          rows="4"
        ></textarea>
        <button
          onClick={copyToClipboard}
          className="bg-blue-500 text-white py-2 px-4 rounded-md my-2 hover:bg-blue-700"
        >
          Copy
        </button>
        <button
          onClick={fetchInvite}
          className="bg-blue-500 text-white py-2 px-4 rounded-md ml-2 hover:bg-blue-700"
        >
          Create Invite
        </button>
      </div>
    </div>
  );
};

const CreateInvite = () => {
  return <CopyToClipboardTextArea />;
};

export default CreateInvite;
