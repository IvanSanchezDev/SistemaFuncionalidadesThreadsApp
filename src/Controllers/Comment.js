var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Type, Expose } from "class-transformer";
import { IsDefined, MaxLength, IsNotEmpty, } from "class-validator";
export class Comment {
}
__decorate([
    Expose({ name: "comment" }),
    IsDefined({
        message: () => {
            throw { status: 401, message: "el parametro comentario es obligatorio" };
        },
    }),
    IsNotEmpty({
        message: () => {
            throw { status: 401, message: "el comentario no puede ser vacio no puede ser vacio" };
        },
    }),
    MaxLength(200, {
        message: () => {
            throw {
                status: 401,
                message: "los comentarios pueden contener max 200 letras",
            };
        },
    }),
    Type(() => String),
    __metadata("design:type", String)
], Comment.prototype, "comment", void 0);
