import express from 'express';
import cors from 'cors';
import patientsRoutes from './src/modules/patients/patients.routes.js';
import avicenaRoutes from './src/modules/avicena/avicena.routes.js';
import autorizacionesRoutes from './src/modules/authorisation/auth.routes.js'
import dotenv from 'dotenv';

dotenv.config() // Cargamos las variables de entorno
const port = process.env.PORT;

// import validadorRoutes from './routes/validador.routes.js';

const app = express();

// Middlewares
app.use(cors()); // Permitir peticiones desde otros dominios
app.use(express.json()); // Habilitar recepción de JSON en las peticiones
app.use(express.static('public')); // Servir archivos estáticos

app.use('/', patientsRoutes);
app.use('/avicena', avicenaRoutes)
app.use('/authorisation',autorizacionesRoutes)

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
