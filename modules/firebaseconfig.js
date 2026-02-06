// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-app.js";
import { getDatabase, ref } from "https://www.gstatic.com/firebasejs/12.8.0/firebase-database.js"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDP4L_71_d7RbZ5CnXX7J08zdxQJhTdUEc",
    authDomain: "devrica-fe25.firebaseapp.com",
    databaseURL: "https://devrica-fe25-default-rtdb.europe-west1.firebasedatabase.app/",
    projectId: "devrica-fe25",
    storageBucket: "devrica-fe25.firebasestorage.app",
    messagingSenderId: "146465006276",
    appId: "1:146465006276:web:5e8d9f2a3075ca2c9c5f91"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const gamesRef = ref(db, '/games');

// https://firebase.google.com/docs/database/web/read-and-write#web

// https://console.firebase.google.com/project/devrica-fe25/database/devrica-fe25-default-rtdb/data/~2F
