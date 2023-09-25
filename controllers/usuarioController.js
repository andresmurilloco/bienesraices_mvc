import { check, validationResult } from "express-validator";
import Usuario from "../models/Usuario.js";

const formularioLogin = (req, res) => {
  res.render("auth/login", {
    autenticado: true,
    pagina: "Iniciar sesión",
  });
};

const formularioRegistro = (req, res) => {
  res.render("auth/registro", {
    pagina: "Crear cuenta",
  });
};

const registrar = async (req, res) => {
  await check("nombre")
    .notEmpty()
    .withMessage("Nombre es obligatorio")
    .run(req);

  await check("email")
    .isEmail()
    .withMessage("Escribe un email valido")
    .run(req);

  await check("password")
    .isLength({ min: 6 })
    .withMessage("La contraseña debe ser de al menos 6 caracteres")
    .run(req);

  await check("repetir_password")
    .equals("password")
    .withMessage("Las contraseñas no coinciden")
    .run(req);

  let resultado = validationResult(req);
  //Verificar resultado vacío
  if (!resultado.isEmpty()) {
    res.render("auth/registro", {
      pagina: "Crear cuenta",
    });
  }

  res.json(resultado.array());

  const usuario = await Usuario.create(req.body);
  res.json(usuario);
};

const formularioOlvidePassword = (req, res) => {
  res.render("auth/olvide-password", {
    pagina: "Recuperar acceso",
    errores: resultado.array(),
  });
};

export {
  formularioLogin,
  formularioRegistro,
  formularioOlvidePassword,
  registrar,
};
