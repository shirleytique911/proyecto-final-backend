import { Router } from "express";
import TicketDTO from "../dao/DTOs/ticket.dto.js";
import { ticketService } from "../repositories/index.js";
import Tickets from "../dao/mongo/tickets.mongo.js"

const router = Router()

const ticketMongo = new Tickets()

//Obtener Tickets
router.get("/", async (req, res) => {
    try {
        req.logger.info('Se obtiene lista de tickets');
        let result = await ticketMongo.get()
        res.status(200).send({ status: "success", payload: result });
    }
    catch (error) {
        req.logger.info('Error al obtener lista de tickets');
        res.status(500).send({ status: "error", message: "Error interno del servidor" });
    }
})
//Crear Tickets
router.post("/", async (req, res) => {
    try {
        let { amount, purchaser } = req.body
        let tick = new TicketDTO({ amount, purchaser })
        let result = await ticketService.createTicket(tick)
        if (result) {
            req.logger.info('Se crea ticket correctamente');
            res.status(200).send({ status: "success", payload: result });
        } else {
            req.logger.error("Error al crear ticket");
            res.status(500).send({ status: "error", message: "Error al crear ticket" });
        }
    }
    catch (error) {
        res.status(500).send({ status: "error", message: "Error interno del servidor" });
    }
})

export default router