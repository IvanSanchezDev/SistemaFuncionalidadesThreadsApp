import { Router } from "express";
import getConnection from "../db/database.js";
import dotenv from "dotenv";
import { generateAccessToken } from "../Middlewares/jwt.js";
import nodemailer from "nodemailer";

dotenv.config();

const userRouter = Router();

userRouter.post("/auth", async (req, res) => {
  try {
    const con = await getConnection();
    const { email,  password } = req.body;
    const user = { email, password };

    const [existsUser] = await con.execute(
      "SELECT * FROM users WHERE email=?",
      [email]
    );

    if (existsUser.length > 0) {
      return res.status(409).send("El nombre de usuario ya está en uso.");
    }

    const [result] = await con.execute(
      "INSERT INTO users (email, password) VALUES (?,?)",
      [email, password]
    );

    if (result.affectedRows !== 1) {
      return res.status(500).send("No se pudo crear el usuario.");
    }

    const accessToken = generateAccessToken(user);
    envioCorreo(email);
    res.cookie("authorization", accessToken, { httpOnly: true });

    res.send("Usuario registrado y autenticado correctamente");
  } catch (error) {
    res.status(401).send(error.message);
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

async function envioCorreo(email){
 
  try {
    let config = {
      service: "gmail",
      auth: {
        user: process.env.CORREO,
        pass: process.env.CODIGO,
      },
    };
  
    const transporter = nodemailer.createTransport(config);
  
    const info = await transporter.sendMail({
      from: process.env.CORREO, 
      to: email, 
      subject: "Bienvenida Threadsx", 
      text: "Te has registrado correctamente en la app de Threadsx" 
    });
    console.log(info.messageId);
  } catch (error) {
    console.log(error.message);
  }
 
};

export default userRouter;
