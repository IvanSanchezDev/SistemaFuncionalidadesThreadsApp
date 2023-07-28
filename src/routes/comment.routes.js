import { Router } from "express";
import getConnection from "../db/database.js";
import { verifyToken } from "../Middlewares/jwt.js";

const commentRouter = Router();

commentRouter.post("/addComment/:post_id", verifyToken, async (req, res) => {
  try {
    const { user_id } = req.user;
    const { post_id } = req.params;
    const { comment } = req.body;

    const con = await getConnection();
    const sql = "INSERT INTO comments (comment, post_id, user_id) VALUES (?,?,?)";
    const queryParams = [comment, post_id, user_id];

    const result = await con.query(sql, queryParams);

    if (result.affectedRows != 1) {
      return res
        .status(500)
        .send("no se pudo subir hacer el comentario, intentelo de nuevo");
    }

    return res
      .status(201)
      .json({
        message: `Comentario Subido Correctamente en el post ${post_id}`,
      });
  } catch (error) {
    res.status(500).json({ message: "error server" });
  }
});

commentRouter.get("/getComment/:post_id", verifyToken, async (req, res) => {
  try {
    const { post_id } = req.params;

    const con = await getConnection();
    const result = await con.query(
      "SELECT  users.username AS usuario, comments.* FROM comments INNER JOIN users ON comments.user_id=users.user_id WHERE comments.post_id=?",
      post_id
    );
    
    if (result.length === 0) {
      return res.status(200).json({message:"No hay comentarios todavia"});
    }

    return res.status(200).send(result);
  } catch (error) {
    res.status(500).json({ message: "error server" });
  }
});

export default commentRouter;
