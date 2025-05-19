import { Router } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

// Creamos el router
const router = Router()
// Obtenemos __dirname en ES Module
const __filename = fileURLToPath(import.meta.url)
const __dirnmae = path.dirname(__filename)

//Ruta raiz del modulo Avicena
// Cuando vaya a: http://localhost:3000/avicena → se carga el HTML
router.get('/', (req, res)=> {
    res.sendFile(path.join(__dirname,'../../public/avicenaIn.html'))
});

router.get('/formula', )

export default router