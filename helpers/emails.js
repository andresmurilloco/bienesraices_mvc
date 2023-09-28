import nodemailer from "nodemailer";
const emailRegistro = async (datos) => {
  var transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  const { email, nombre, token } = datos;

  //Enviar email
  await transport.sendMail({
    from: "BienesRaices.com",
    to: email,
    subject: "Confirma tu cuenta en BienesRaices.com",
    text: "Confirma tu cuenta en BienesRaices.com",
    html: `
    <p>Hola ${nombre}, comprueba tu cuenta en BienesRaices.com</p>
    <p>Tu cuenta ya está lista, solo debes confirmarla en el siguiente enlace:<a href=${
      process.env.BACKEND_URL
    }:${
      process.env.PORT || 3000
    }/auth/confirmar/${token}>Confirmar cuenta</a></p>
    <p>Si tu no creaste esta cuenta, puedes eliminar este mensaje.</p>
    `,
  });
};

const emailOlvidePassword = async (datos) => {
  var transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  const { email, nombre, token } = datos;

  //Enviar email
  await transport.sendMail({
    from: "BienesRaices.com",
    to: email,
    subject: "Reestrablece tu contraseña BienesRaices.com",
    text: "Confirma tu cuenta en BienesRaices.com",
    html: `
    <p>Hola ${nombre}, has solicitado reestablecer tu contraseña en BienesRaices.com</p>
    <p>Sigue el siguiente enlace para generar una nueva contraseña:<a href=${
      process.env.BACKEND_URL
    }:${
      process.env.PORT || 3000
    }/auth/olvide-password/${token}>Reestablecer contraseña</a></p>
    <p>Si tu no solicitaste el cambio, haz caso omiso a este mensaje.</p>
    `,
  });
};

export { emailRegistro, emailOlvidePassword };
