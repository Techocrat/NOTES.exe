const { v4: uuidv4 } = require("uuid");

// Function to generate a unique token
export const generateUniqueToken = () => {
  // Generate a unique UUID (version 4)
  const token = uuidv4();
  // check if the token already exists in the database
  let tokens = fetch(token.find({ token: token }));
  if (tokens) {
    // If the token exists, generate a new one
    return generateUniqueToken();
  }

  return token;
};
