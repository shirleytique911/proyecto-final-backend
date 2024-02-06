import dotenv from 'dotenv';

dotenv.config();

export default {
    persistence: process.env.PERSISTENCE,
    mongo_url: process.env.DB_CONNECTION_STRING,
    port: process.env.PORT
};