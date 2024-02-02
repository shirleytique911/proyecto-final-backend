import ticketsModel from './models/tickets.model.js'

export default class Tickets {
    constructor() {

    }

    get = async () => {
        let tickets = await ticketsModel.find()
        return tickets
    }
    getTicketById = async (ticketId) => {
        try {
          let ticket = await ticketsModel.findById(ticketId).lean();
          return ticket;
        } catch (error) {
          console.error("Error al obtener el ticket por ID:", error);
          return "Error interno";
        }
      }
    addTicket = async (ticket) => {
        try {
            let result = await ticketsModel.create(ticket);
            return result
        } catch (error) {
            console.error("Error en la creación del ticket:", error);
            return "Error interno";
        }
    }
}