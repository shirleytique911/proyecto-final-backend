import dotenv from 'dotenv';

dotenv.config();
console.log(process.env.DB_CONNECTION_STRING);  // Agrega esta línea para imprimir el valor

export default {
    persistence: process.env.PERSISTENCE,
    mongo_url: process.env.DB_CONNECTION_STRING,
    port: process.env.PORT
};

