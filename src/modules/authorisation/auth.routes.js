import {  Router } from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import { consultAuthorisationController, consumirAuthController, copayAmount1Controller } from './auth.controller.js'
import authMiddleware from '../../middlewares/auth.middleware.js'
const router = Router()

// Obetener la ruta del directoria actual ES Modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

router.post("/consultar",authMiddleware, consultAuthorisationController)
router.post("/consumir",authMiddleware, consumirAuthController)
router.post("/copago",authMiddleware, copayAmount1Controller)

export default router