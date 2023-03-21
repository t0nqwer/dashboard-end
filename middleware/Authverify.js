import pkg from "jsonwebtoken";
const { verify, sign } = pkg;
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
const createToken = (id) => {
  return sign({ id }, process.env.SECRET, { expiresIn: "15m" });
};
export const requireAuth = async (req, res, next) => {
  // verify user is authenticated
  const { authorization, username } = req.headers;
  // console.log(req.headers);
  // console.log("username", username);
  if (!username) {
    return res.status(401).json({ error: "Request timeout" });
  }
  if (!authorization) {
    return res.status(401).json({ error: "Authorization token required" });
  }

  const token = authorization.split(" ")[1];

  try {
    const tooo = verify(token, process.env.SECRET);
    // console.log(tooo);
    next();
  } catch (error) {
    // console.log(error.message);
    // console.log(username);
    if (error.message === "jwt expired") {
      const refreshToken = await prisma.refreshToken.findUnique({
        where: {
          Username: username,
        },
      });
      console.log("refreshToken", refreshToken);
      try {
        const data = verify(refreshToken.Token, process.env.SECRETREFRESH);

        const finduser = await prisma.user.findUnique({
          where: {
            Username: data.id,
          },
          select: {
            Email: true,
            First_Name: true,
            role: true,
            Mobile: true,
            Last_Name: true,
            Username: true,
          },
        });
        console.log("finduser", finduser);
        const token = createToken(username);
        req.user = { user: finduser, token, username: username };
        next();
      } catch (error) {
        res.status(401).json({ error: "Request timeout" });
      }
    } else {
      res.status(401).json({ error: "Request is not authorized" });
    }
  }
};
