"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const app_1 = require("firebase/app");
const firestore_1 = require("firebase/firestore");
const firebaseConfig = {
    apiKey: "AIzaSyDJcSpqhbO71-fneUDO0WRIzsrzKejXO6k",
    authDomain: "unlock-ai-app.firebaseapp.com",
    databaseURL: "https://unlock-ai-app-default-rtdb.firebaseio.com",
    projectId: "unlock-ai-app",
    storageBucket: "unlock-ai-app.firebasestorage.app",
    messagingSenderId: "647502458119",
    appId: "1:647502458119:web:0e0d12a01bff30a06f69a2",
    measurementId: "G-1EXK7WJ8Q0"
};
const app = (0, app_1.initializeApp)(firebaseConfig);
exports.db = (0, firestore_1.getFirestore)(app);
