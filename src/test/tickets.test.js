import mongoose from 'mongoose'
import Ticket from '../dao/mongo/tickets.mongo.js'
import Assert from 'assert'
import * as Chai from 'chai'
import Supertest from 'supertest'
import config from '../config/config.js' 

mongoose.connect(config.mongo_url);

const assert = Assert.strict
const expect = Chai.expect
const requester = Supertest("http://localhost:8080")

describe('Testing Ticket DAO Mocha/Chai/SuperTest', () => {
    before(function () {
        this.ticketsDao = new Ticket()
    })
    it("Debería devolver los tickets de la DB", async function () {
        this.timeout(5000)
        try
        {
            const result = await this.ticketsDao.get()
            assert.strictEqual(Array.isArray(result), true) //Mocha
            expect(Array.isArray(result)).to.be.equals(true) //Chai
        }
        catch(error)
        {
            console.error("Error durante el test: ", error)
            assert.fail("Test get usuario con error")
        }
    })
    it("El DAO debe agregar un Ticket en la DB", async function () {
        let mockTicket = {
            amount: 15777,
            purchaser: "testunit@gmail.com",
        }
        const result = await this.ticketsDao.addTicket(mockTicket)
        assert.ok(result._id) //Mocha
        expect(result).to.have.property('_id') //Chai
    })
    //EJECUTAR EL SERVIDOR EN PARALELO PARA QUE FUNCIONEN LOS ULTIMOS DOS TEST
    it("El endpoint GET /tickets debe devolver todos los tickets", async function() {
        const response = await requester.get('/tickets')
        // Verifica el código de estado HTTP
        assert.strictEqual(response.status, 200);
        // Verifica el tipo de contenido de la respuesta
        expect(response.type).to.equal('application/json');
        // Verifica que la respuesta tenga una propiedad 'status' con valor 'success'
        expect(response.body).to.have.property('status', 'success');
    })
    it("El endpoint POST /tickets debe crear un ticket", async function() {
        let mockTicket = {
            amount: 15777,
            purchaser: "testpost@gmail.com",
        }
        
        const response = await requester.post('/tickets').send(mockTicket)
        // Verifica el código de estado HTTP
        assert.strictEqual(response.status, 200);
        // Verifica el tipo de contenido de la respuesta
        expect(response.ok).to.equal(true);
        // Verifica que la respuesta tenga una propiedad 'status' con valor 'success'
        expect(response.body).to.have.property('status', 'success');
    })
    after(function(done) {
        this.timeout(5000);
        console.log("Fin de las pruebas de Ticket");
        done();
    });
})