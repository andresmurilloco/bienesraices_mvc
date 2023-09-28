import { check, validationResult } from "express-validator";
import Usuario from "../models/Usuario.js";
import { generarId } from "../helpers/token.js";
import { emailOlvidePassword, emailRegistro } from "../helpers/emails.js";
import bcrypt from "bcrypt";

const formularioLogin = (req, res) => {
  res.render("auth/login", {
    autenticado: true,
    pagina: "Iniciar sesión",
  });
};

const formularioRegistro = (req, res) => {
  res.render("auth/registro", {
    pagina: "Crear cuenta",
    csrfToken: req.csrfToken(),
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
    return res.render("auth/registro", {
      pagina: "Crear cuenta",
      csrfToken: req.csrfToken(),
      errores: resultado.array(),
      usuario: {
        nombre: req.body.nombre,
        email: req.body.email,
      },
    });
  }

  //Verificar usuario no registrado
  const { nombre, email, password } = req.body;
  const existeUsuario = await Usuario.findOne({
    where: { email: email },
  });

  if (existeUsuario) {
    return res.render("auth/registro", {
      pagina: "Crear cuenta",
      csrfToken: req.csrfToken(),
      errores: [{ msg: "El usuario ya está registrado" }],
      usuario: {
        nombre: nombre,
        email: email,
      },
    });
  }

  const usuario = await Usuario.create({
    nombre,
    email,
    password,
    token: generarId(),
  });

  //Envia email de confirmación
  emailRegistro({
    nombre: usuario.nombre,
    email: usuario.email,
    token: usuario.token,
  });

  //Mostrar mensjae confirmación
  res.render("templates/mensaje", {
    pagina: "Cuenta creada correctamente",
    mensaje: "Hemos enviado un email de confirmación",
  });
};

const confirmar = async (req, res) => {
  const { token } = req.params;
  //Verificar si token valido
  const usuario = await Usuario.findOne({ where: { token } });
  if (!usuario) {
    return res.render("auth/confirmar-cuenta", {
      pagina: "Error al confirmar tu cuenta",
      mensaje: "Hubo un error al confirmar tu cuenta",
      error: true,
    });
  }

  //Confirmar cuenta
  usuario.token = null;
  usuario.confirmado = true;
  await usuario.save();

  return res.render("auth/confirmar-cuenta", {
    pagina: "Cuenta confirmada",
    mensaje: "Cuenta confirmada correctamente",
  });
};

const formularioOlvidePassword = (req, res) => {
  res.render("auth/olvide-password", {
    pagina: "Recuperar acceso",
    csrfToken: req.csrfToken(),
  });
};

const resetPassword = async (req, res) => {
  await check("email")
    .isEmail()
    .withMessage("Escribe un email valido")
    .run(req);

  let resultado = validationResult(req);

  //Verificar resultado vacío
  if (!resultado.isEmpty()) {
    return res.render("auth/olvide-password", {
      pagina: "Recuperar acceso",
      csrfToken: req.csrfToken(),
      errores: resultado.array(),
    });
  }

  //Buscar usuario
  const { email } = req.body;
  const usuario = await Usuario.findOne({ where: { email } });
  if (!usuario) {
    return res.render("auth/olvide-password", {
      pagina: "Recuperar acceso",
      csrfToken: req.csrfToken(),
      errores: [{ msg: "El email no es existe" }],
    });
  }

  //Generar Token
  usuario.token = generarId();
  await usuario.save();

  //Enviar email
  emailOlvidePassword({
    email: usuario.email,
    nombre: usuario.nombre,
    token: usuario.token,
  });

  //Renderizar mensaje
  res.render("templates/mensaje", {
    pagina: "Reestablece tu contraseña",
    mensaje: "Hemos enviado un email para reestablecer tu contraseña",
  });
};

const comprobarToken = async (req, res, next) => {
  const { token } = req.params;

  const usuario = await Usuario.findOne({ where: { token } });
  if (!usuario) {
    return res.render("auth/confirmar-cuenta", {
      pagina: "Reestablece tu password",
      mensaje: "Hubo un error al validar tu información. Intenta de nuevo",
      error: true,
    });
  }

  //Mostrar formulario
  res.render("auth/reset-password", {
    pagina: "Reestablece tu password",
    csrfToken: req.csrfToken(),
  });
};

const nuevoPassword = async (req, res) => {
  await check("password")
    .isLength({ min: 6 })
    .withMessage("La contraseña debe ser de al menos 6 caracteres")
    .run(req);

  let resultado = validationResult(req);

  //Verificar resultado vacío
  if (!resultado.isEmpty()) {
    return res.render("auth/reset-password", {
      pagina: "Reestablece tu contraseña",
      csrfToken: req.csrfToken(),
      errores: resultado.array(),
    });
  }

  //Identificar quien hace el cambio
  const { token } = req.params;
  const { password } = req.body;

  const usuario = await Usuario.findOne({ where: { token } });

  //Hashear nuevo password
  const salt = await bcrypt.genSalt(10);
  usuario.password = await bcrypt.hash(password, salt);
  usuario.token = null;

  await usuario.save();

  res.render("auth/confirmar-cuenta", {
    pagina: "Contraseña reestablecido",
    mensaje: "La contraseña se reestableció correctamente",
  });
};

export {
  formularioLogin,
  formularioRegistro,
  formularioOlvidePassword,
  registrar,
  confirmar,
  resetPassword,
  comprobarToken,
  nuevoPassword,
};
