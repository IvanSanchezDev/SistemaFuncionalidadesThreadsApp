var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Transform, Type, Expose } from "class-transformer";
import { IsDefined, MaxLength, MinLength, IsNotEmpty, Validate, IsOptional } from "class-validator";
export class User {
}
__decorate([
    Expose({ name: "correo" }),
    IsDefined({
        message: () => {
            throw { status: 401, message: "el parametro email es obligatorio" };
        },
    }),
    Transform(({ value }) => {
        if (/\S+@\S+\.\S+/.test(value))
            return value;
        else
            throw {
                status: 400,
                message: `El datos email no cunple con los parametros acordados`,
            };
    }, { toClassOnly: true }),
    Type(() => String),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    Expose({ name: "contrasenia" }),
    IsDefined({
        message: () => {
            throw { status: 401, message: "el parametro password es obligatorio" };
        },
    }),
    MinLength(8, {
        message: () => {
            throw {
                status: 401,
                message: "la password debe  tener min 8 caracteres",
            };
        },
    }),
    Type(() => String),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
__decorate([
    Expose({ name: "usuario" }),
    Transform(({ value }) => typeof value === "string" ? value.replace(" ", "") : value),
    IsNotEmpty(),
    Validate((value) => {
        if (value && value.includes(" ")) {
            return "No debe contener espacios";
        }
    }),
    IsOptional(),
    __metadata("design:type", String)
], User.prototype, "username", void 0);
__decorate([
    Expose({ name: "info" }),
    MaxLength(200, {
        message: () => {
            throw {
                status: 401,
                message: "los detalles pueden contener max 200 letras",
            };
        },
    }),
    Type(() => String),
    IsOptional(),
    __metadata("design:type", String)
], User.prototype, "detalles", void 0);
__decorate([
    Expose({ name: "celular" }),
    Transform(({ value }) => {
        let data = /^[0-9]+$/g.test(value);
        if (data) {
            return parseInt(value);
        }
        else {
            throw { status: 401, message: "Error en el campo celular" };
        }
    }),
    IsOptional(),
    __metadata("design:type", Number)
], User.prototype, "telefono", void 0);
__decorate([
    Expose({ name: "codigo_postal" }),
    Transform(({ value }) => {
        let data = /^[0-9]+$/g.test(value);
        if (data) {
            return parseInt(value);
        }
        else {
            throw { status: 401, message: "Error en el codigo postal" };
        }
    }),
    IsOptional(),
    __metadata("design:type", Number)
], User.prototype, "codigoPostal", void 0);
