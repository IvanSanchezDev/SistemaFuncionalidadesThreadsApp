import { Router } from "express";
import getConnection from "../db/database.js";
import { verifyToken } from "../Middlewares/jwt.js";
import { storeImageMiddleware } from '../Middlewares/StorageImage.js'

import multer from "multer";


//la funcion multer devuelve un middleware, en el cual almacenara los archivos subidos en temp/ 
const upload = multer({ dest: 'temp/' });



const postRouter = Router();

postRouter.post("/addPost",  upload.single('media'), storeImageMiddleware, async (req, res) => {
  try {
    const imageHash = req.imageHash;
    const connection =  getConnection();
    const {user_id} = req.user;
    const { description } = req.body;
    
  
    const sql = "INSERT INTO posts (user_id,description, media) VALUES (?,?,?)";
    const queryParams = [user_id, description, imageHash];

    connection.query(sql, queryParams, (error, results)=>{
      if (error) {
        return res
        .status(500)
        .json({message:"No se pudo subir el post, intentelo de nuevo."});
      }else{
        return res.status(200).json({ message: "Subido Correctamente" });
      }
     
    });
  } catch (error) {
    res.status(500).json({ message: "error server" });
  }
});


postRouter.get("/getPostUser",  (req, res) => {
  try {
    const connection = getConnection();

    const {user_id} = req.user;
   
    connection.query("SELECT * FROM posts WHERE user_id=?", user_id, (error, results)=>{
      if (error) {
        return res
        .status(500)
        .json({message:"No se pudo traer los post, intentelo de nuevo."});
      }else{
        if (results.length === 0) {
          return res.status(204).json({message:`No hay post  todavia del usuario ${user_id}`});
        }
        res.json(results);
      }
    });

  } catch (error) {
    console.log(error.message);
  }
});

postRouter.get("/getPostUser/:username", (req, res) => {
  try {
    const connection = getConnection();
    const username = req.params.username;

    connection.query("SELECT posts.* FROM `posts` INNER JOIN users ON posts.user_id=users.user_id WHERE users.username=?", 
      username, (error,results)=>{
        if (error) {
          return res
          .status(500)
          .json({message:"No se pudo traer los post del usuario, intentelo de nuevo."});
        }else{
          if (results.length === 0) {
            return res.status(204).json({message:`No hay post  todavia del usuario ${username}`});
          }
          res.json(results);
        }
      }
    );

  } catch (error) {
    console.log(error.message);
  }
});

export default postRouter;
