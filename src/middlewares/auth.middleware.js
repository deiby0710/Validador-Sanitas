import obtenerToken from "../modules/auth/auth.service.js";

let token = null;
let tokenExpiration = 0;

// Middleware de autenticación
const authMiddleware = async (req, res, next) => {
    try {
        const ahora = Date.now();

        // Si no hay token o ha expirado, obtener uno nuevo
        if (!token || ahora >= tokenExpiration) {
            console.log('🔄 Generando un nuevo token...');
            const { access_token, expires_in } = await obtenerToken();
            if (!access_token) {
                throw new Error('No se pudo obtener un token');
            }
            token = access_token;
            tokenExpiration = ahora + expires_in * 1000; // Convertir a milisegundos
        }

        // Agregar el token a la cabecera de autorización
        req.headers['Authorization'] = `Bearer ${token}`;

        next(); // Continuar con la petición
    } catch (error) {
        console.error('❌ Error en autenticación:', error);
        return res.status(401).json({ message: 'Error en autenticación' });
    }
};

export default authMiddleware;