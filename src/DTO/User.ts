import { Transform, Type, Expose } from "class-transformer";
import {
  IsDefined,
  MaxLength,
  MinLength,
  IsNotEmpty,
  Validate,
  IsOptional
} from "class-validator";

export class User {
  @Expose({ name: "correo" })
  @IsDefined({
    message: () => {
      throw { status: 401, message: "el parametro email es obligatorio" };
    },
  })
  @Transform(
    ({ value }) => {
      if (/\S+@\S+\.\S+/.test(value)) return value;
      else
        throw {
          status: 400,
          message: `El datos email no cunple con los parametros acordados`,
        };
    },
    { toClassOnly: true }
  )
  @Type(() => String)
  email: string;

  @Expose({ name: "contrasenia" })
  @IsDefined({
    message: () => {
      throw { status: 401, message: "el parametro password es obligatorio" };
    },
  })
  @MinLength(8, {
    message: () => {
      throw {
        status: 401,
        message: "la password debe  tener min 8 caracteres",
      };
    },
  })
  @Type(() => String)
  password: string;

  @Expose({ name: "usuario" })
  @Transform(({ value }) =>
    typeof value === "string" ? value.replace(" ", "") : value
  )
  @IsNotEmpty()
  @Validate((value: string) => {
    if (value && value.includes(" ")) {
      return "No debe contener espacios";
    }
  })
  @IsOptional()
  username?: string;
  @Expose({ name: "info" })
  @MaxLength(200, {
    message: () => {
      throw {
        status: 401,
        message: "los detalles pueden contener max 200 letras",
      };
    },
  })
  @Type(() => String)
  @IsOptional()
  detalles?: string;

  @Expose({ name: "celular" })
  @Transform(({ value }) => {
    let data = /^[0-9]+$/g.test(value);
    if (data) {
      return parseInt(value);
    } else {
      throw { status: 401, message: "Error en el campo celularr" };
    }
  })
  @IsOptional()
  telefono?: number;

  @Expose({ name: "codigo_postal" })
  @Transform(({ value }) => {
    let data = /^[0-9]+$/g.test(value);
    if (data) {
      return parseInt(value);
    } else {
      throw { status: 401, message: "Error en el codigo postal" };
    }
  })
  @IsOptional()
  codigoPostal?: number;
}
