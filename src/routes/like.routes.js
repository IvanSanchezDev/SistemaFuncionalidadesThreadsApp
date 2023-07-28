import { Router } from "express";
import getConnection from "../db/database.js";


const likeRouter = Router();

likeRouter.post("/addLike/:post_id", (req, res) => {
  try {
    const { user_id } = req.user;
    const { post_id } = req.params;
    const con = getConnection();

    const sql = "INSERT INTO likes (post_id, user_id) VALUES (?,?)";
    const queryParams = [post_id, user_id];

    con.query(sql, queryParams, (error, results) => {
      if (error) {
        return res
          .status(500)
          .json({ message: "No se pudo subir el like, intentelo de nuevo." });
      } else {
        return res.status(201).json({
          message: `Like Cargado Correctamente en el post ${post_id}`,
        });
      }
    });
  } catch (error) {
    res.status(500).json({ message: "error addPost" + error.message });
  }
});

likeRouter.get("/getLike/:post_id",  (req, res) => {
  try {
    const { post_id } = req.params;

    const con = getConnection();
    con.query(
      "SELECT * FROM likes WHERE likes.post_id=?",
      post_id,
      (error, results) => {
        if (error) {
          return res
            .status(500)
            .json({ message: "No cargan los likes, intentelo de nuevo." });
        } else {
          if (results.length === 0) {
            return res.status(200).json({ message: "No hay likes todavia" });
          } else {
            return res.status(200).send(results);
          }
        }
      }
    );
  } catch (error) {
    res.status(500).json({ message: "error server" });
  }
});

export default likeRouter;
