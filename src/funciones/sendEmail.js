import nodemailer from "nodemailer";

export async function envioCorreo(email) {
    try {
      let config = {
        service: "gmail",
        auth: {
          user: process.env.CORREO,
          pass: process.env.CODIGO,
        },
      };
  
      const transporter = nodemailer.createTransport(config);
  
      const link='http://localhost:5001/user/confirmacion';
  
      const info = await transporter.sendMail({
        from: process.env.CORREO,
        to: email,
        subject: "Bienvenida Threadsx",
        text: `Te has registrado pero debes verificar tu cuenta, por favor dar click a continuacion en el siguiente link ${link}`,
      });
      console.log(info.messageId);
    } catch (error) {
      console.log(error.message);
    }
  }