import { initializeApp } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";

import {
  getAuth
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyD3Rnj1DlBaBk33ZuE9cOFD65ot2ZrsuJc",
  authDomain: "movie-management-a5021.firebaseapp.com",
  projectId: "movie-management-a5021",
  storageBucket: "movie-management-a5021.firebasestorage.app",
  messagingSenderId: "900930662569",
  appId: "1:900930662569:web:b02b330f303472cf78f9b8",
  measurementId: "G-8D7ET5719M"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

export { auth };