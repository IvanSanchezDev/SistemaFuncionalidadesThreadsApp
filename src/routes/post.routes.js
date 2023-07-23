import { Router } from "express";
import getConnection from "../db/database.js";
import { verifyToken } from "../Middlewares/jwt.js";
import { storeImageMiddleware } from '../Middlewares/StorageImage.js'

import multer from "multer";


//la funcion multer devuelve un middleware, en el cual almacenara los archivos subidos en temp/ 
const upload = multer({ dest: 'temp/' });



const postRouter = Router();

postRouter.post("/addPost", verifyToken, upload.single('media'), storeImageMiddleware, async (req, res) => {
  try {
    const imageHash = req.imageHash;
    const con = await getConnection();
    const {user_id} = req.user;
    const { description } = req.body;
    
    const [result] = await con.execute(
      "INSERT INTO posts (user_id,description, media) VALUES (?,?,?)",
      [user_id, description, imageHash]
    );
    if (result.affectedRows != 1) {
      return res
        .status(500)
        .send("no se pudo subir el post, intentelo de nuevo");
    }

    return res.status(200).json({ message: "Subido Correctamente" });
  } catch (error) {
    res.status(500).json({ message: "error server" });
  }
});

postRouter.get("/getPost", async (req, res) => {
  try {
    const con = await getConnection();
    const [result] = await con.execute("SELECT * FROM posts");
    res.send(result);
  } catch (error) {
    console.log(error.message);
  }
});

postRouter.get("/getPostUser", verifyToken, async (req, res) => {
  try {
    const con = await getConnection();

    const {user_id} = req.user;
   
    const [result] = await con.execute("SELECT * FROM posts WHERE user_id=?", [
      user_id,
    ]);

    if (result.length === 0) {
      return res.status(204).send(`No hay post  todavia del usuario ${user_id}`);
    }
    res.send(result);
  } catch (error) {
    console.log(error.message);
  }
});

postRouter.get("/getPostUser/:username", async (req, res) => {
  try {
    const con = await getConnection();
    const username = req.params.username;

    const [result] = await con.execute("SELECT posts.* FROM `posts` INNER JOIN users ON posts.user_id=users.user_id WHERE users.username=?", [
      username,
    ]);

    if (result.length === 0) {
      return res.status(204).send(`No hay post  todavia del usuario ${user_id}`);
    }
    res.send(result);
  } catch (error) {
    console.log(error.message);
  }
});

export default postRouter;
