import {  Type, Expose } from "class-transformer";
import {
    IsDefined,
    MaxLength,
    IsNotEmpty,
  } from "class-validator";

export class Comment{
    @Expose({ name: "comment" })
    @IsDefined({
        message: () => {
          throw { status: 401, message: "el parametro comentario es obligatorio" };
        },
      })
      @IsNotEmpty({
        message: () => {
          throw { status: 401, message: "el comentario no puede ser vacio no puede ser vacio" };
        },
      })
      @MaxLength(200, {
        message: () => {
          throw {
            status: 401,
            message: "los comentarios pueden contener max 200 letras",
          };
        },
      })
      @Type(() => String)
      comment: string;
}