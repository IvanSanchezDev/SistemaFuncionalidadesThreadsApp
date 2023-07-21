import { Router } from "express";
import getConnection from "../db/database.js";
import { verifyToken } from "../Middlewares/jwt.js";

const postRouter = Router();



postRouter.post("/addPost", async (req, res) => {
  try {
    const con = await getConnection();
    const { authorization } = req.cookies;
    const { description, media } = req.body;
    const info = verifyToken(authorization);
    const { user_id } = info;
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

export default postRouter;
