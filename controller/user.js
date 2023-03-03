import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import pkg from "jsonwebtoken";
import validator from "validator";

dotenv.config();
const prisma = new PrismaClient();
const { decode, verify, sign } = pkg;
const createToken = (id) => {
  return sign({ id }, process.env.SECRET, { expiresIn: "1h" });
};

export const LogInUser = async (req, res) => {
  const { username, password } = req.body;

  console.log(username, password);
  try {
    const finduser = await prisma.user.findUnique({
      where: {
        Username: username,
      },
    });

    if (finduser === null) {
      throw Error("Incorrect id");
    }
    console.log(password, finduser.Password_Hash);
    const match = await bcrypt.compare(password, finduser.Password_Hash);
    if (match) {
      const token = createToken(finduser.Username);
      //   throw Error(JSON.stringify({ user: finduser, token }));
      return res.json({ user: finduser, token });
    } else {
      throw Error("Incorrect password");
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
export const SignUpUser = async (req, res) => {
  const { firstName, lastName, Username, email, password } = req.body;
  console.log(firstName, lastName, Username, email, password);
  try {
    if (!email || !password) {
      throw Error("All fields must be filled");
    }
    if (!validator.isEmail(email)) {
      throw Error("Email not valid");
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    const user = await prisma.user.create({
      data: {
        User_ID: 122235,
        First_Name: firstName,
        Last_Name: lastName,
        Mobile: 1122,
        Email: email,
        Username: Username,
        Password_Hash: hash,
        Registtered: new Date(),
        Last_Login: new Date(),
        profile_picture: "",
        roleid: 4,
      },
    });

    const token = createToken(user.Username);
    console.log(user, token);
    const returndata = { user, token };
    res.json(returndata);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
