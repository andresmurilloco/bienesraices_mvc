import express from "express";
import usuarioRoutes from "./routes/usuarioRoutes.js";

//Crear app
const app = express();

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
