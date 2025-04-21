import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyByGzWh1NzxKwgw4hKYYnG4OHvP6RuHT_o",
  authDomain: "mobifood-9563a.firebaseapp.com",
  projectId: "mobifood-9563a",
  storageBucket: "mobifood-9563a.appspot.com",
  messagingSenderId: "1023039537774",
  appId: "1:1023039537774:web:4e1829ae6f07438446dc7f",
  measurementId: "G-CVK6RQJYHG",
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

export default app;