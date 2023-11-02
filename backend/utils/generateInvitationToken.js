import { v4 as uuidv4 } from 'uuid';
import InviteToken from "../models/Token.js"


// Function to generate a unique token
const generateInvitationToken = async () => {
  // Generate a unique UUID (version 4)
  const token = uuidv4();
  // check if the token already exists in the database
  let tokens = await InviteToken.findOne({ token: token });
  // If the token already exists, generate a new one
  if(tokens){
    console.log("Token exists");
  }
  console.log(token);

  return token;
};

export default generateInvitationToken;