import { Router } from "express";
//import { Carts } from '../dao/factory.js'
import CartDTO from "../dao/DTOs/cart.dto.js";
import TicketDTO from "../dao/DTOs/ticket.dto.js";
import { ticketService, cartService, userService } from "../repositories/index.js";
import Carts from "../dao/mongo/carts.mongo.js";

const router = Router()

const cartMongo = new Carts()

//Obtener Carrito
router.get("/", async (req, res) => {
    try
    {
        req.logger.info('Se obtiene lista de carritos');
        let result = await cartMongo.get()
        res.status(200).send({ status: "success", payload: result });
    }
    catch(error)
    {
        req.logger.info('Error al obtener lista de carritos');
        res.status(500).send({ status: "error", message: "Error interno del servidor" });
    } 
})
//Crear Carrito
router.post("/", async (req, res) => {
    try
    {
        let { products } = req.body
        const correo = req.body.email;
        let rolUser = userService.getRolUser(products.owner)
        if(rolUser == 'premium' && correo == products.owner)
        {
            req.logger.error('Un usuario premium NO puede agregar a su carrito un producto que le pertenece');
            res.status(500).send({ status: "error", message: "Un usuario premium NO puede agregar a su carrito un producto que le pertenece" });
        }else{
            let cart = new CartDTO({ products })
            let result = await cartService.createCart(cart)
            if(result){
                req.logger.info('Se crea carrito correctamente correctamente');
                res.status(200).send({ status: "success", payload: result });
            }else{
                req.logger.error("Error al crear carritos");
                res.status(500).send({ status: "error", message: "Error interno del servidor" });
            }
            
        }
    }
    catch(error)
    {
        res.status(500).send({ status: "error", message: "Error interno del servidor" });
    }
})
//Crear compra con carrito y ticket
router.post("/:cid/purchase", async (req, res) => {
    try {
        let id_cart = req.params.cid;
        const productos = req.body.productos;
        const correo = req.body.correo;
        let cart = cartService.validateCart(id_cart)
        if (!cart) {
            req.logger.error("No se encontró el carrito con el ID proporcionado");
            return { error: "No se encontró el carrito con el ID proporcionado" };
        }
        let validaStock = cartService.validateStock({productos})

        if (validaStock) {
            let totalAmount = await cartService.getAmount({productos})
            const ticketFormat = new TicketDTO({amount:totalAmount, purchaser:correo});
            const result = await ticketService.createTicket(ticketFormat);
        } else {
            req.logger.error("No hay suficiente stock para realizar la compra");
        }
    } catch (error) {
        req.logger.error("Error al procesar la compra:" + error.message);
        return res.status(500).json({ error: "Error interno al procesar la compra" });
    }
})

export default router