import { Router } from "express";
import getConnection from "../db/database.js";
import { verifyToken } from "../Middlewares/jwt.js";

const postRouter = Router();

postRouter.post("/addPost", verifyToken, async (req, res) => {
  try {
    const con = await getConnection();
    const {user_id} = req.user;
    const { description, media } = req.body;
    
    const [result] = await con.execute(
      "INSERT INTO posts (user_id,description, media) VALUES (?,?,?)",
      [user_id, description, media]
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
    res.send(result);
  } catch (error) {
    console.log(error.message);
  }
});

postRouter.get("/getPostUser/:id", async (req, res) => {
  try {
    const con = await getConnection();
    const user_id = req.params.id;
    const [result] = await con.execute("SELECT * FROM posts WHERE user_id=?", [
      user_id,
    ]);
    res.send(result);
  } catch (error) {
    console.log(error.message);
  }
});

export default postRouter;
