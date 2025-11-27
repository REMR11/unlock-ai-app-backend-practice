import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "../config/firebase";
import axios from "axios";
import pdfParse from "pdf-parse";

// Marcar documento como seleccionado y desmarcar los demás
export const seleccionarDocumento = async (docId: string) => {
    const docsSnap = await getDocs(collection(db, "documents"));
    for (const d of docsSnap.docs) {
        await updateDoc(doc(db, "documents", d.id), {
            selected: d.id === docId
        });
    }
};

// Obtener documento seleccionado
export const obtenerDocumentoSeleccionado = async () => {
    const docsSnap = await getDocs(collection(db, "documents"));
    const seleccionado = docsSnap.docs.find(d => d.data().selected);
    return seleccionado ? seleccionado.data() : null;
};

// Procesar documentos seleccionados
export const procesarDocumentosSeleccionados = async () => {
    try {
        // Obtener documentos seleccionados desde Firestore
        const docsSnap = await getDocs(collection(db, "documents"));
        const documentosSeleccionados = docsSnap.docs
            .filter(d => d.data().selected)
            .map(d => ({ id: d.id, ...d.data() as { name: string; url: string; selected: boolean } }));

        const resultados = [];

        for (const doc of documentosSeleccionados) {
            const response = await axios.get(doc.url, { responseType: "arraybuffer" });
            const pdfBuffer = Buffer.from(response.data as ArrayBuffer);
            const pdfData = await pdfParse(pdfBuffer);

            resultados.push({
                id: doc.id,
                name: doc.name,
                text: pdfData.text // Aquí puedes personalizar la extracción de datos relevantes
            });
        }

        return { success: true, documentos: resultados };
    } catch (error) {
        console.error("Error al procesar documentos seleccionados:", error);
        return { success: false, error: "No se pudieron procesar los documentos seleccionados." };
    }
};