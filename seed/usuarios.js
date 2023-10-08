import bcrypt from "bcrypt";
const usuarios = [
  {
    nombre: "Andrés",
    email: "andres@angela.com",
    confirmado: 1,
    password: bcrypt.hashSync("password", 10),
  },
];

export default usuarios;
