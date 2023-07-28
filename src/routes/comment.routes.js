import { Router } from "express";
import getConnection from "../db/database.js";
import proxyComment from "../Middlewares/proxyComment.js";


const commentRouter = Router();

commentRouter.post("/addComment/:post_id", proxyComment, (req, res) => {
  try {
    const { user_id } = req.user;
    const { post_id } = req.params;
    const { comment } = req.body;

    const con =  getConnection();
    const sql = "INSERT INTO comments (comment, post_id, user_id) VALUES (?,?,?)";
    const queryParams = [comment, post_id, user_id];

     con.query(sql, queryParams, (error, results)=>{
      if (error) {
        return res
        .status(500)
        .json({message:"No se pudo subir el comentario, intentelo de nuevo."});
      }else{
        return res
        .status(201)
      .json({
        message: `Comentario Subido Correctamente en el post ${post_id}`,
      });
      }
     });

  } catch (error) {
    res.status(500).json({ message: "error server" });
  }
});

commentRouter.get("/getComment/:post_id", (req, res) => {
  try {
    const { post_id } = req.params;

    const con =  getConnection();
     con.query(
      "SELECT  users.username AS usuario, comments.* FROM comments INNER JOIN users ON comments.user_id=users.user_id WHERE comments.post_id=?",
      post_id, (error, results)=>{
        if (error) {
          return res
          .status(500)
          .json({message:"No cargan los comentarios, intentelo de nuevo."});
        }else{
          if (results.length===0) {
            return res.status(200).json({message:"No hay comentarios todavia"});
          }else{
            return res.status(200).send(results);
          }
        }
      }
    );
    
  } catch (error) {
    res.status(500).json({ message: "error server" });
  }
});

export default commentRouter;
