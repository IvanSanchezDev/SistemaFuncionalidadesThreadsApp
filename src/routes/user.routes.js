import { Router } from "express";
import getConnection from "../db/database.js";

import { generateAccessToken, verifyToken } from "../Middlewares/jwt.js";
import { encrypt, compare } from "../Helpers/handleBcrypt.js";

import proxiUsuario from "../Middlewares/proxyUser.js";






const userRouter = Router();



//PRUEBA
userRouter.get("/", (req, res) => {
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
  `);
});

userRouter.post("/auth", proxiUsuario, async (req, res) => {
  try {
   
 
    const { email, password, username, detalles, telefono, codigoPostal } =
      req.body;

    const passwordHash = await encrypt(password);

    const connection = getConnection();

    const sql = "SELECT * FROM users WHERE email=? or username=?";
    const queryParams = [email, username];

    connection.query(sql, queryParams, (error, results)=>{
      if (error) {
        res.status(500).json({message:error.message});
      } else {
        if (results.length > 0) {
          return res.status(409).json({message:"El correo o username ya está en uso."});
        }else{
          const sql2 =
          "INSERT INTO users (email, password, username, detalles, telefono, codigoPostal) VALUES (?,?,?,?,?,?)";
        const queryParams2 = [
          email,
          passwordHash,
          username,
          detalles,
          telefono,
          codigoPostal,
        ];
    
        connection.query(sql2, queryParams2, (error, results)=>{
          if (error) {
            res.status(500).json({message:error.message});
          } else {
            res.status(201).json({
              message: "Usuario registrado correctamente.",
            });
          }
        });
        }
      }
    });

  } catch (error) {
    res.status(401).json({message:error.message});;
  }
});

userRouter.get("/confirmacion", verifyToken, async (req, res) => {
  try {
    const { email } = req.user;

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
    const connection = getConnection();

    const sql = "SELECT user_id, email, password FROM users WHERE email=?";
    const queryParams = [email];

    connection.query(sql, queryParams, async (error, results) => {
      if (error) {
        return res.status(500).send("Error en el servidor: " + error.message);
      }

      if (results.length >= 1) {
        const user = results[0];
        const checkPassword = await comparePasswords(password, user.password);

        if (!checkPassword) {
          return res.status(401).send("Password Incorrecta");
        }

        const { user_id, email } = user;
        const data = { user_id, email };
        const accessToken = generateAccessToken(data);

        res.cookie("token", accessToken, { httpOnly: true });
        res.status(200).json({ message: "Ha ingresado Correctamente." });
      } else {
        res.status(400).json({ message: "Usuario o password no coinciden." });
      }
    });
  } catch (error) {
    res.status(500).send("Error en el servidor: " + error.message);
  }
});

// Función para comparar contraseñas
async function comparePasswords(inputPassword, hashedPassword) {
  const result = await compare(inputPassword, hashedPassword);
  return result;
}

export default userRouter;
