import express from "express";
import {obtenerConversacion, responderExperto01, responderExperto02, limpiarHistorial, eliminarMensajePorId, editarMensajePorId, exportarConversacionPDF} from "../controllers/dataControllers.js";

const router = express.Router();

router.get('/conversations', obtenerConversacion);

router.post('/experto01/respond', responderExperto01);

router.post('/experto02/respond', responderExperto02);

router.delete('/conversations', limpiarHistorial);

router.delete('/conversations/:id', eliminarMensajePorId);

router.put('/conversations/:id', editarMensajePorId);

router.get('/export/pdf', exportarConversacionPDF);

export default router;




