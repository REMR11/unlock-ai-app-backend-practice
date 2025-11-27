"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.procesarDocumentosSeleccionados = exports.obtenerDocumentoSeleccionado = exports.seleccionarDocumento = void 0;
const firestore_1 = require("firebase/firestore");
const firebase_1 = require("../config/firebase");
const axios_1 = __importDefault(require("axios"));
const pdf_parse_1 = __importDefault(require("pdf-parse"));
// Marcar documento como seleccionado y desmarcar los demás
const seleccionarDocumento = (docId) => __awaiter(void 0, void 0, void 0, function* () {
    const docsSnap = yield (0, firestore_1.getDocs)((0, firestore_1.collection)(firebase_1.db, "documents"));
    for (const d of docsSnap.docs) {
        yield (0, firestore_1.updateDoc)((0, firestore_1.doc)(firebase_1.db, "documents", d.id), {
            selected: d.id === docId
        });
    }
});
exports.seleccionarDocumento = seleccionarDocumento;
// Obtener documento seleccionado
const obtenerDocumentoSeleccionado = () => __awaiter(void 0, void 0, void 0, function* () {
    const docsSnap = yield (0, firestore_1.getDocs)((0, firestore_1.collection)(firebase_1.db, "documents"));
    const seleccionado = docsSnap.docs.find(d => d.data().selected);
    return seleccionado ? seleccionado.data() : null;
});
exports.obtenerDocumentoSeleccionado = obtenerDocumentoSeleccionado;
// Procesar documentos seleccionados
const procesarDocumentosSeleccionados = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Obtener documentos seleccionados desde Firestore
        const docsSnap = yield (0, firestore_1.getDocs)((0, firestore_1.collection)(firebase_1.db, "documents"));
        const documentosSeleccionados = docsSnap.docs
            .filter(d => d.data().selected)
            .map(d => (Object.assign({ id: d.id }, d.data())));
        const resultados = [];
        for (const doc of documentosSeleccionados) {
            const response = yield axios_1.default.get(doc.url, { responseType: "arraybuffer" });
            const pdfBuffer = Buffer.from(response.data);
            const pdfData = yield (0, pdf_parse_1.default)(pdfBuffer);
            resultados.push({
                id: doc.id,
                name: doc.name,
                text: pdfData.text // Aquí puedes personalizar la extracción de datos relevantes
            });
        }
        return { success: true, documentos: resultados };
    }
    catch (error) {
        console.error("Error al procesar documentos seleccionados:", error);
        return { success: false, error: "No se pudieron procesar los documentos seleccionados." };
    }
});
exports.procesarDocumentosSeleccionados = procesarDocumentosSeleccionados;
