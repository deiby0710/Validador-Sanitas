import { consultAuthorisation, consumirAuth, copayAmount1 } from './auth.service.js'

export const consultAuthorisationController = async(req, res) => {
    try {
        if (!req.body || Object.keys(req.body).length == 0) {
            return res.status(400).json({message:'El cuerpo de la peticion esta vacio'})
        };
        const data = await consultAuthorisation(req.body, req.headers['Authorization']);
        if (!data){
            return res.status(404).json({message: 'No se encontraron los datos'})
        }
        res.json(data)
    } catch (error) {
        console.error('Error en consultAuthorisationController: ', error)
        res.status(500).json({
            message: "Error al obtener los datos de la autorizacion.",
            error: error.message
        });
    }
}

export const consumirAuthController = async(req, res) => {
    try {
        const { numeroAutorizacion, codigo, sucursal } = req.body;
        const authHeader = req.headers["Authorization"];
        if (!numeroAutorizacion || !codigo || !sucursal ) {
            return res.status(400).json({ message: "Faltan parametros requeridos."})
        }
        if (!authHeader) {
            return res.status(401).json({ message: "Falta el token de autorización en el encabezado." });
        }
        const data = await consumirAuth(numeroAutorizacion, codigo, sucursal, authHeader);
        if(!data){
            return res.status(404).json({message: "No se encontraron datos en el copay amount"})
        }
        res.json(data)
    } catch (error) {
        console.error('Error en consumirAuthController: ', error)
        res.status(500).json({
            message: "Error al consumir la autorizacion.",
            error: error.message
        });
    }
}

export const copayAmount1Controller = async(req,res)=>{
    try {
        const {numeroAutorizacion}  = req.body
        const authHeader = req.headers["Authorization"];
        if (!numeroAutorizacion){
            return res.status(400).json({ message: "Falta el numero de autorizacion."})
        }
        if (!authHeader) {
            return res.status(401).json({ message: "Falta el token de autorización en el encabezado." });
        }
        const data = await copayAmount1(numeroAutorizacion, authHeader);
        if(!data){
            return res.status(404).json({message: "No se encontraron datos en el copay amount"})
        }
        res.json(data)
    } catch (error) {
        console.error("Error en copayAmount1Controller: ", error)
        res.status(500).json({
            message: "Error obteniendo datos del paciente (Copay Amount)",
            error: error.message
        })
    }
}