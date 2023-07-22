import { Router } from "express";
import getConnection from "../db/database.js";
import { verifyToken } from "../Middlewares/jwt.js";

const commentRouter = Router();

commentRouter.post("/addComment/:post_id", verifyToken, async (req, res) => {
  try {
    const { user_id } = req.user;
    const { post_id }=req.params
    const { comment } = req.body;
    
    const con = await getConnection();
    const [result] = await con.execute(
      "INSERT INTO comments (comment, post_id, user_id) VALUES (?,?,?)",
      [comment, post_id, user_id]
    );

    if (result.affectedRows != 1) {
      return res
        .status(500)
        .send("no se pudo subir hacer el comentario, intentelo de nuevo");
    }

    return res.status(200).json({ message: `Comentario Subido Correctamente en el post ${post_id}` });
  } catch (error) {
    res.status(500).json({ message: "error server" });
  }
});

export default commentRouter;
