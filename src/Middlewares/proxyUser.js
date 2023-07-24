import express from "express";
import { plainToClass } from "class-transformer";
import { User } from "../Controllers/User.js";
import { validate } from "class-validator";

const proxiUsuario = express();

proxiUsuario.use(async (req, res, next) => {
  try {
    
    let data = plainToClass(User, req.body, {
      excludeExtraneousValues: true,
    });
    const err = await validate(data);

    if (err.length > 0) {
      console.log(err);
    } else {
      req.body = JSON.parse(JSON.stringify(data));
      next();
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});

export default proxiUsuario;