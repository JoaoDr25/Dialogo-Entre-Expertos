import message from "../models/dataModels.js";
import { obtenerRespuesta } from "../services/geminiServices.js";
import { experto01 } from "../prompt.js";
import { experto02 } from "../prompt.js";
import PDFDocument from 'pdfkit';

export const obtenerConversacion = async (req, res) => {
  try {
    const mensajes = await message.find().sort({ fecha: 1 });
    res.status(200).json(mensajes);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la conversación.' });
  }
};


export const responderExperto01 = async (req, res) => {
  try {
    const { mensajeUsuario } = req.body;

    if (!mensajeUsuario || mensajeUsuario.trim() === '') {
      return res.status(400).json({ error: 'El mensaje del usuario es obligatorio.' });
    }

    const entradaUsuario = new message({
      autor: 'usuario',
      mensaje: mensajeUsuario
    });

    await entradaUsuario.save();

    const historial = await message.find().sort({ fecha: 1 });
    const historialTexto = historial.map(msg => `${msg.autor}: ${msg.mensaje}`).join('\n');

    const promptFinal = experto01.replace('{{conversationHistory}}', historialTexto);
    console.log("Prompt enviado a Gemini:", promptFinal);

    const respuestaGenerada = await obtenerRespuesta(promptFinal);

    const respuestaExperto = new message({
      autor: 'experto01',
      mensaje: respuestaGenerada
    })

    await respuestaExperto.save();

    res.status(200).json({
      entradaUsuario,
      respuestaExperto
    });

  } catch (error) {
    console.error("Error completo en responderExperto01:", error);
    res.status(500).json({ error: 'Error al generar la respuesta del experto 1.' });
  }
};


export const responderExperto02 = async (req, res) => {
  try {
    const { mensajeUsuario } = req.body;

    if (!mensajeUsuario || mensajeUsuario.trim() === '') {
      return res.status(400).json({ error: 'El mensaje del usuario es obligatorio.' });
    }

    const entradaUsuario = new message({
      autor: 'usuario',
      mensaje: mensajeUsuario
    });
    await entradaUsuario.save();

    const historial = await message.find().sort({ fecha: -1 }).limit(5); // últimos 5
    const historialTexto = historial.reverse().map(msg => `${msg.autor}: ${msg.mensaje}`).join('\n');


    const promptFinal = experto02.replace('{{conversationHistory}}', historialTexto);
    console.log("Prompt enviado a Gemini (experto02):", promptFinal);


    const respuestaGenerada = await obtenerRespuesta(promptFinal);

    const respuestaExperto = new message({
      autor: 'experto02',
      mensaje: respuestaGenerada
    });
    await respuestaExperto.save();

    res.status(200).json({
      entradaUsuario,
      respuestaExperto
    });

  } catch (error) {
    console.error("Error en responderExperto02:", error);
    res.status(500).json({ error: 'Error al generar la respuesta del experto 2.' });
  }
};



export const limpiarHistorial = async (req, res) => {
  try {
    await message.deleteMany({});
    res.status(200).json({ mensaje: 'Historial eliminado correctamente.' });

  } catch (error) {
    console.error("Error al limpiar el historial:", error);
    res.status(500).json({ error: 'Error al limpiar el historial.' });
  }
};


export const eliminarMensajePorId = async (req, res) => {
  try {
    const { id } = req.params;
    const mensajeEliminado = await message.findByIdAndDelete(id);

    if (!mensajeEliminado) {
      return res.status(404).json({ error: 'Mensaje no encontrado.' });
    }

    res.status(200).json({ mensaje: 'Mensaje eliminado correctamente.', mensajeEliminado });

  } catch (error) {
    console.error("Error al eliminar el mensaje:", error);
    res.status(500).json({ error: 'Error al eliminar el mensaje.' });
  }
}


export const editarMensajePorId = async (req, res) => {
  try {
    const { id } = req.params;
    const { nuevoMensaje } = req.body;

    if (!nuevoMensaje || nuevoMensaje.trim() === '') {
      return res.status(400).json({ error: 'El nuevo mensaje es obligatorio.' });
    }

    const mensajeEditado = await message.findByIdAndUpdate(
      id,
      { mensaje: nuevoMensaje },
      { new: true }
    );

    if (!mensajeEditado) {
      return res.status(404).json({ error: 'Mensaje no encontrado.' });
    }

    res.status(200).json({
      mensaje: 'Mensaje editado correctamente.',
      mensajeEditado
    });

  } catch (error) {
    console.error("Error al editar el mensaje:", error);
    res.status(500).json({ error: 'Error al editar el mensaje.' });
  }
};


export const exportarConversacionPDF = async (req, res) => {
  try {
    const mensajes = await message.find().sort({ fecha: 1 });

    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=conversacion.pdf');
    doc.pipe(res);

    doc.fontSize(18).text('Historial de Conversación', { align: 'center' });
    doc.moveDown();

    mensajes.forEach(msg => {
      const fecha = new Date(msg.fecha).toLocaleString();
      doc
        .font('Helvetica-Bold')
        .fontSize(12)
        .text(`${msg.autor.toUpperCase()} [${fecha}]`, { continued: true })
        .font('Helvetica')
        .text(`: ${msg.mensaje}`);
      doc.moveDown();
    });

    doc.end();

  } catch (error) {
    console.error("Error al exportar PDF:", error);
    res.status(500).json({ error: 'No se pudo exportar el historial a PDF.' });
  }
};


