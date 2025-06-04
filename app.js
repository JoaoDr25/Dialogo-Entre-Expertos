import cors from 'cors';
import mongoose from 'mongoose';

import express from "express"
import 'dotenv/config'


const app = express();

app.use(cors());
app.use(express.json());

import router from './routes/dataRoutes.js';

app.use('/api', router);


mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true

}).then(() => {
    console.log('Conectado a MongoDB');

    app.listen(process.env.PORT, () => {
        console.log(`Servidor escuchando en el puerto ${process.env.PORT}`);
    });

}).catch((error) => {
    console.error('Error conectando a MongoDB:', error.message);
});

