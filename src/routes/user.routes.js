import { Router } from "express";
import getConnection from "../db/database.js";
import dotenv from "dotenv";
import { generateAccessToken, verifyToken } from "../Middlewares/jwt.js";
import { encrypt, compare} from '../Helpers/handleBcrypt.js'

import { envioCorreo } from "../Helpers/sendEmail.js";

dotenv.config();

const userRouter = Router();

//PRUEBA 
userRouter.get("/", (req, res)=>{
  res.send(`
    <html>
      <head>
        <title>auth</title>
      </head>
      <body>
        <form method="post" action="user/auth">
          Email: <input type="text" name="email"><br>
          Contraseña: <input type="password" name="password"><br>
          <input type="submit" value="Craer cuenta">
        </form>
      </body>
    </html>
  `)
})

userRouter.post("/auth", async (req, res) => {
  try {
    const con = await getConnection();
    
    const { email, password } = req.body;
    const user={email}
    const passwordHash=await encrypt(password)

    const [existsUser] = await con.execute(
      "SELECT * FROM users WHERE email=?",
      [email]
    );

    if (existsUser.length > 0) {
      return res.status(409).send("El nombre de usuario ya está en uso.");
    }

    const [result] = await con.execute(
      "INSERT INTO users (email, password) VALUES (?,?)",
      [email, passwordHash]
    );

    if (result.affectedRows !== 1) {
      return res.status(500).send("No se pudo crear el usuario.");
    }

    const accessToken = generateAccessToken(user);
    envioCorreo(email);
    res.cookie("authorization", accessToken, { httpOnly: true });
    res.status(200).json({
      message:
        "Usuario registrado correctamente. Revise su correo electrónico para confirmar su cuenta.",
    });
  } catch (error) {
    res.status(401).send(error.message);
  }
});

userRouter.get("/confirmacion", async (req, res) => {
  try {
    const { authorization } = req.cookies;
    const info = verifyToken(authorization);

    const { email } = info;

    const con = await getConnection();
    const [result] = await con.execute(
      "UPDATE users SET verifyUser=? WHERE email=?",
      [true, email]
    );

    if (result.affectedRows !== 1) {
      return res
        .status(500)
        .send(
          "No se pudo verificar la cuenta, por favor comuniquese con soporte."
        );
    }

    return res.status(200).json({ message: "CUENTA VERIFICADA" });
  } catch (error) {
    console.log("error" + error.message);
  }
});

userRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const con = await getConnection();

    
    const [rows] = await con.execute(
      "SELECT user_id, email, password, verifyUser FROM users WHERE email=?",
      [email]
    );


    if (rows.length >= 1) {
      //const { user_id, password, verifyUser } = rows[0];
      const user=rows[0];
 
      if (!user.verifyUser) {
        return res
          .status(401)
          .send("Usuario no verificado. Por favor, verifica tu cuenta.");
      }

      const checkPassword=await compare(password, user.password)

      if (!checkPassword) {
        return res
        .status(401)
        .send("Password Incorrecta");
      }

      const { user_id, email } = user

      const data = { user_id, email };
      const accessToken = generateAccessToken(data);

      res.cookie("authorization", accessToken, { httpOnly: true });

      res.status(200).send("Ha ingresado Correctamente.");
    } else {
      res.status(401).send("Usuario o contraseña incorrectos.");
    }
  } catch (error) {
    res.status(500).send("Error en el servidor." + error.message);
  }
});



export default userRouter;
