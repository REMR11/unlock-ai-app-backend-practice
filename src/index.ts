import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import path from "path";
import { registrarArea } from "./controllers/AreaController";
import { seleccionarDocumento, obtenerDocumentoSeleccionado } from "./controllers/DocumentController";

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors({ origin: '*' }));
app.use(bodyParser.json());

// Servir archivos estáticos del frontend
// app.use(express.static(path.join(__dirname, '../../frontend/public')));

// Endpoint para registrar un área
app.post("/registrar-area", async (req, res) => {
    try {
        const { id } = req.body;
        await registrarArea(id);
        res.json({ success: true, message: "Área registrada con éxito" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error al registrar área" });
    }
});

// Marcar un documento como seleccionado
app.post("/seleccionar-documento", async (req, res) => {
    try {
        const { docId } = req.body;
        await seleccionarDocumento(docId);
        res.json({ success: true, message: "Documento seleccionado con éxito" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error al seleccionar documento" });
    }
});

// Obtener documento seleccionado
app.get("/documento-seleccionado", async (req, res) => {
    try {
        const doc = await obtenerDocumentoSeleccionado();
        res.json({ success: true, doc });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error al obtener documento seleccionado" });
    }
});

// Fallback para rutas del frontend
// app.get('/*', (req, res) => {
//     res.sendFile(path.join(__dirname, '../../frontend/public', '01-splash.html'));
// });

// Levantar servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
