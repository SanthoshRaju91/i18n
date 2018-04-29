import { Router } from "express";

import {
  authenticateUserSCM,
  decryptPassword,
  readSalt
} from "../../utils/connection";

const authRoutes = new Router();

authRoutes.post("/authenticate", async (req, res, next) => {
  try {
    let { username, password } = req.body;

    if (username && password) {
      let { name, token } = await authenticateUserSCM(username, password);

      if (token) {
        res.status(200).json({
          success: true,
          token,
          name
        });
      } else {
        throw "Authentication failure";
      }
    } else {
      throw "Username and password blank";
    }
  } catch (err) {
    next(err);
  }
});

export default authRoutes;
