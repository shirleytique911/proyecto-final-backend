import dotenv from 'dotenv';

dotenv.config();

export default {
    persistence: process.env.PERSISTENCE,
    mongo_url: `mongodb+srv://shirleytique911:GKZraArQ50QuepXc@cluster0.dvtsniz.mongodb.net/?retryWrites=true&w=majority`,
    port: process.env.PORT
};

