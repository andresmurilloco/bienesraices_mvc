import express from "express";
import usuarioRoutes from "./routes/usuarioRoutes.js";
import propiedesRoutes from "./routes/propiedadesRoutes.js";
import db from "./config/db.js";
import csrf from "csurf";
import cookieParser from "cookie-parser";
//Crear app
const app = express();

//Habnilitar lectura de datos formularios
app.use(express.urlencoded({ extended: true }));

//Habilitar Cookie Parser
app.use(cookieParser());

//Habilitar CSRF
app.use(csrf({ cookie: true }));

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
app.set("views", "./views");

//Carpeta publica
app.use(express.static("public"));

//Routing
app.use("/auth", usuarioRoutes);
app.use("/", propiedesRoutes);

//Definir puerto y arrancar proyecto
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`El servidor esta corriendo en el puerto ${port}`);
});
