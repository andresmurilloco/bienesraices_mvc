import express from "express";
import usuarioRoutes from "./routes/usuarioRoutes.js";
import db from "./config/db.js";

//Crear app
const app = express();

//Habnilitar lectura de datos formularios
app.use(express.urlencoded({ extended: true }));

//Conexión a la base de datis
try {
  await db.authenticate();
  db.sync();
  console.log("Conexión a base de datos correcta");
} catch (error) {
  console.log(error);
}

//Habilitar pug
app.set("view engine", "pug");
app.set("view", "./views");

//Carpeta publica
app.use(express.static("public"));

//Routing
app.use("/auth", usuarioRoutes);

//Definir puerto y arrancar proyecto
const port = 3000;

app.listen(port, () => {
  console.log(`El servidor esta corriendo en el puerto ${port}`);
});
