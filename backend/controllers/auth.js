import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import InviteToken from "../models/Token.js";

/* REGISTER USER */
export const register = async (req, res) => {
  try {
    const { username, email, password, token } = req.body;
    console.log(req.body);
    let fetch_token = await InviteToken.findOne({ token: token });
    if (!fetch_token) {
      return res.status(403).send("Access Denied");
    }
    let { expiryDate, status } = fetch_token;
    if (status !== "pending") {
      return res.status(403).send("Invite token already used!");
    }
    if (expiryDate < Date.now()) {
      return res.status(403).send("Invite token expired!");
    }

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);
    //console.log(passwordHash);
    const newUser = new User({
      username,
      email,
      password: passwordHash,
    });
    console.log(newUser);
    const savedUser = await newUser.save();
    console.log(savedUser);
    fetch_token.status = "used";
    await fetch_token.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* LOGGING IN */
export const login = async (req, res) => {
  // console.log("Called");
  try {
    console.log(req.body);
    const { email, password } = req.body;
    console.log(email, password);

    const user = await User.findOne({ email: email });
    if (!user) return res.status(400).json({ msg: "User does not exist. " });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials. " });

    const token = jwt.sign({ id: user._id, user:user }, process.env.JWT_SECRET);
    delete user.password;
    res.status(200).json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const checkToken = async (req, res) => {
  try {
      const { invite } = req.body;
      let fetch_token = await InviteToken.findOne({ token: invite });
      if (!fetch_token) {
        return res.status(404).json({message:"Invite token not found!"})
      }
      let { expiryDate, status } = fetch_token;
      if (status !== "pending") {
        return res.status(400).send("Invite token already used!");
      }
      if (expiryDate < Date.now()) {
        return res.status(400).send("Invite token expired!");
      }

      return res.status(200).json({message:"Invite token valid!"});

  }catch (err) {
    res.status(500).json({ error: err.message });
  }
};