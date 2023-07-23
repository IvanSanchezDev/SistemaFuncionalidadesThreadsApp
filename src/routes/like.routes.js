import { Router } from "express";
import getConnection from "../db/database.js";
import { verifyToken } from "../Middlewares/jwt.js";

const likeRouter = Router();

likeRouter.post("/addLike/:post_id", verifyToken, async (req, res) => {
  try {
    const { user_id } = req.user;
    const { post_id }=req.params
    const con = await getConnection();
    const [result] = await con.execute(
      "INSERT INTO likes (post_id, user_id) VALUES (?,?)",
      [post_id, user_id]
    );

    if (result.affectedRows != 1) {
      return res
        .status(500)
        .send("no se pudo subir hacer el like, intentelo de nuevo");
    }

    return res.status(200).json({ message: "like successful" });
  } catch (error) {
    res.status(500).json({ message: "error server" });
  }
});

export default likeRouter;
