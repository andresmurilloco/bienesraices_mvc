import Categoria from "./Categoria.js";
import Precio from "./Precio.js";
import Usuario from "./Usuario.js";
import Propiedad from "./Propiedad.js";

Precio.hasOne(Propiedad);
Propiedad.belongsTo(Categoria);
Propiedad.belongsTo(Usuario);

export { Categoria, Precio, Usuario, Propiedad };

//Categoria y usuario para Propiedad
