import { getFormulaData } from './avicena.service'

export const getFormulaController = async (req,res) => {
    try {
        const {numeroOrden, codigoSucursal } = req.body;
        const data = await getFormulaData(numeroOrden,codigoSucursal);
        if (!data) {
            return res.status(404).json({message:"No se encontraron datos."});
        };
        res.json(data);
    } catch (error) {
        console.error("Error en getFormulaController: ", error);
        res.status(500).json({
            message: "Error al obtener la formula.",
            error: error.message
        });
    }
};