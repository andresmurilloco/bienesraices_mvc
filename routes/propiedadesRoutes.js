import express from "express";
import { body } from "express-validator";
import { admin, crear, guardar } from "../controllers/propiedadesController.js";

const router = express.Router();

router.get("/mis-propiedades", admin);
router.get("/propiedades/crear", crear);
router.post(
  "/propiedades/crear",
  body("titulo").notEmpty().withMessage("El titulo del anuncio es obligatorio"),
  body("descripcion")
    .notEmpty()
    .withMessage("La descripción del anuncio es obligatorio")
    .isLength({ max: 200 })
    .withMessage("La descripción es muy larga"),
  body("categoria").isNumeric().withMessage("Selecciona una categoria"),
  body("precio").isNumeric().withMessage("Selecciona un rango de precios"),
  body("habitaciones")
    .isNumeric()
    .withMessage("Selecciona una cantidad de habitaciones"),
  body("estacionamiento")
    .isNumeric()
    .withMessage("Selecciona una cantidad de estacionamientos"),
  body("wc").isNumeric().withMessage("Selecciona una cantidad de baños"),
  body("lat").isNumeric().withMessage("Ubica la propiedad en el mapa"),
  guardar
);

export default router;
