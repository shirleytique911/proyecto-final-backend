import { Router } from "express";
import ProductDTO from "../dao/DTOs/product.dto.js";
import { productService, userService } from "../repositories/index.js";
import Products from "../dao/mongo/products.mongo.js"
import CustomError from "../services/errors/CustomError.js";
import EErrors from "../services/errors/enum.js";
import { generateProductErrorInfo } from "../services/errors/info.js";
import {transport} from "../utils.js"

const router = Router()

const productMongo = new Products()

//Acceder a los productos
router.get("/", async (req, res) => {
    try
    {
        req.logger.info('Se cargan productos');
        let result = await productMongo.get()
        res.status(200).send({ status: "success", payload: result });
    } 
    catch (error) 
    {
        res.status(500).send({ status: "error", message: "Error interno del servidor" });
    }
})
router.get("/:id", async (req, res) => {
    try{
        const prodId = req.params.id;
        const userEmail = req.query.email
        const productDetails = await productMongo.getProductById(prodId);
        res.render("viewDetails", { product: productDetails, email: userEmail });
    } catch (error) {
        console.error('Error al obtener el producto:', error);
        res.status(500).json({ error: 'Error al obtener el producto' });
    } 
});
//Crear producto
router.post("/", async (req, res) => {
    let { description, image, price, stock, category, availability, owner } = req.body
    if (owner === undefined || owner == '') {
        owner = 'admin@admin.cl'
    }
    const product = { description, image, price, stock, category, availability, owner }
    if (!description || !price) {
        try {
            // Some code that might throw an error
            throw CustomError.createError({
                name: 'Error en Creacion de Producto',
                cause: generateProductErrorInfo(product),
                message: 'Error al intentar crear el Producto',
                code: EErrors.REQUIRED_DATA,
            });
            req.logger.info('Se crea producto correctamente');
        } catch (error) {
            req.logger.error("Error al comparar contraseñas: " + error.message);
            res.status(500).send({ status: "error", message: "Error interno del servidor" });
        }
    }
    let prod = new ProductDTO({ description, image, price, stock, category, availability, owner })
    let userPremium = await userService.getRolUser(owner)
    if (userPremium == 'premium') {
        let result = await productService.createProduct(prod)
        res.status(200).send({ status: "success", payload: result });
        req.logger.info('Se crea producto con usuario premium');
    } else {
        req.logger.error("El owner debe contener usuarios premium");
        res.status(500).send({ status: "error", message: "Error interno del servidor" });
    }
})
//Eliminar Producto, en caso de que el producto pertenezca a un usuario premium, le envíe un correo indicándole que el producto fue eliminado
router.delete('/:idProd', async (req, res) => {
    try 
    {
        const idProducto = req.params.idProd;
        let ownerProd = await productMongo.getProductOwnerById(idProducto)
        let userRol = await userService.getRolUser(ownerProd.owner)
        if(userRol == 'premium')
        {
            await transport.sendMail({
                from: 'lorenatique911@gmail.com',
                to: ownerProd.owner,
                subject: 'Se elimina Producto con Owner Premium',
                html:`Se elimina producto con id ${idProducto} correctamente`,
            });
            res.status(200).json({ message: 'Producto eliminado con éxito.' });
        }else{
            productMongo.deleteProduct(idProducto)
            res.status(200).json({ message: 'Producto eliminado con éxito.' });
        }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al eliminar usuarios.' });
    }
  });

export default router