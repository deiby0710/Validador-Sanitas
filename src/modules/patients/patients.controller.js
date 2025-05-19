import { validatePatient, validatorPatient, getPatientBasicData, copayAmount2 } from "./patients.service.js";

export const validatePatientController = async (req, res) => {
    try {
        // 📌 Validamos que el body tenga contenido
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({ message: "El cuerpo de la petición está vacío." });
        }

        // 📌 Llamamos al servicio con los datos del request
        const data = await validatePatient(req.body, req.headers["Authorization"]);

        // 📌 Verificamos que `data` tenga contenido
        if (!data) {
            return res.status(404).json({ message: "No se encontraron datos." });
        }

        // 📌 Enviar los datos como respuesta
        res.json(data);
    } catch (error) {
        // 📌 Mostrar error en la consola para depuración
        console.error("Error en validatePatientController:", error);

        // 📌 Enviar error al cliente con más información
        res.status(500).json({ 
            message: "Error obteniendo datos.", 
            error: error.message 
        });
    }
};

export const validatorPatientController = async (req, res) => {
    try {
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({ message: "El cuerpo de la petición está vacío." });
        }
        const data = await validatorPatient(req.body, req.headers["Authorization"]);

        if (!data) {
            return res.status(404).json({ message: "No se encontraron datos." });
        }

        res.json(data);
    } catch (error) {
        console.error("Error en validatorPatientController:", error);
        res.status(500).json({ 
            message: "Error obteniendo datos.", 
            error: error.message 
        });
    }
};

export const getPatientBasicDataController = async (req, res) => {
    try {
        // Extraer parámetros de la consulta y la cabecera de autorización
        const { identificationNumber, identificationType } = req.query;
        const authHeader = req.headers["Authorization"];

        // Validar que los parámetros requeridos estén presentes
        if (!identificationNumber || !identificationType) {
            return res.status(400).json({ message: "Faltan parámetros requeridos: identificationNumber e identificationType." });
        }

        if (!authHeader) {
            return res.status(401).json({ message: "Falta el token de autorización en el encabezado." });
        }

        // Llamar al servicio con los datos extraídos
        const data = await getPatientBasicData(identificationNumber, identificationType, authHeader);

        // Verificar si la API devolvió datos
        if (!data) {
            return res.status(404).json({ message: "No se encontraron datos para el paciente." });
        }

        res.json(data);
    } catch (error) {
        console.error("Error en getPatientBasicDataController:", error);
        res.status(500).json({ 
            message: "Error obteniendo datos del paciente.", 
            error: error.message 
        });
    }
};

// Controlador CopyAmount
export const copayAmount2Controller = async(req,res)=>{
    try {
        const { numIden, tipoIden } = req.body
        const authHeader = req.headers["Authorization"];
        if (!numIden || !tipoIden){
            return res.status(400).json({ message: "Faltan parametros requeridos."})
        }
        if (!authHeader) {
            return res.status(401).json({ message: "Falta el token de autorización en el encabezado." });
        }
        const data = await copayAmount2(numIden, tipoIden, authHeader);
        if(!data){
            return res.status(404).json({message: "No se encontraron datos en el copay amount"})
        }
        res.json(data)
    } catch (error) {
        console.error("Error en copayAmount2Controller: ", error)
        res.status(500).json({
            message: "Error obteniendo datos del paciente (Copay Amount)",
            error: error.message
        })
    }
}