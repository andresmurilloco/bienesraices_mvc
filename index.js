import express from 'express'
import usuarioRoutes from './routes/usuarioRoutes.js';

//Crear app
const app = express();

//Routing
app.use('/', usuarioRoutes);

//Definir puerto y arrancar proyecto
const port = 3000;

app.listen(port, () =>{
    console.log(`El servidor esta corriendo en el puerto ${port}`);
});