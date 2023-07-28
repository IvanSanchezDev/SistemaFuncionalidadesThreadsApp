import express from "express";
import { plainToClass } from "class-transformer";
import { Comment } from "../Controllers/Comment.js";
import { validate } from "class-validator";

const proxyComment = express();

proxyComment.use(async(req, res, next) => {
  try {
    let data = plainToClass(Comment, req.body, {
      excludeExtraneousValues: true,
    });
    const err = await validate(data);

    if (err.length > 0) {
      res.json({message:err})
    } else {
      req.body = JSON.parse(JSON.stringify(data));

    next();
    }
    
  } catch (error) {
    res.status(error.status).send(error);
  }
});

export default proxyComment;
