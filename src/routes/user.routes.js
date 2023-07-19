import { Router } from "express";
import getConnection from "../db/database.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const userRouter = Router();

userRouter.post("/auth", async (req, res) => {
  try {
    const con = await getConnection();
    const { username, password } = req.body;
    const user = { username, password };

    const [existsUser] = await con.execute(
      "SELECT * FROM users WHERE username=?",
      [username]
    );

    if (existsUser.length > 0) {
      return res.status(409).send("El nombre de usuario ya está en uso.");
    }

    const [result] = await con.execute(
      "INSERT INTO users (username, password) VALUES (?,?)",
      [username, password]
    );

    if (result.affectedRows !== 1) {
      return res.status(500).send("No se pudo crear el usuario.");
    }

    const accessToken = generateAccessToken(user);
    res.cookie("authorization", accessToken, { httpOnly: true });

    res.send("Usuario registrado y autenticado correctamente");
  } catch (error) {
    res.status(401).send(error);
  }
});

userRouter.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const con = await getConnection();

    const [rows] = await con.execute(
      "SELECT user_id, username, password FROM users WHERE username=? AND password=?",
      [username, password]
    );

    if (rows.length >= 1) {
      const { user_id } = rows[0];
      const user = { user_id, username, password };
      const accessToken = generateAccessToken(user);

      res.cookie("authorization", accessToken, { httpOnly: true });

      res.send("Usuario autenticado correctamente.");
    } else {
      res.status(401).send("Usuario o contraseña incorrectos.");
    }
  } catch (error) {
    res.status(500).send("Error en el servidor.");
  }
});

function generateAccessToken(user) {
  return jwt.sign(user, process.env.JWT_PRIMARY_KEY, { expiresIn: "5m" });
}

function verifyToken() {
  const { authorization } = req.cookies;
  if (!authorization) res.send("Acces Denied");

  jwt.verify(authorization, process.env.JWT_PRIMARY_KEY, (err, decode) => {
    if (err) {
      res.send("Acces Denied o expired");
    } else {
      req.user = decode;
    }
  });
}

export default userRouter;
