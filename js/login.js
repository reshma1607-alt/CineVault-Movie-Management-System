
import {
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";

import { auth } from "./firebase-config.js";

const loginForm = document.getElementById("loginForm");
const loginMessage = document.getElementById("loginMessage");

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value;

  loginMessage.textContent = "Signing you in...";
  loginMessage.style.color = "#bfc7e8";

  try {
    await signInWithEmailAndPassword(auth, email, password);

    loginMessage.textContent =
      "Login successful! Welcome to CineVault 🎬";

    loginMessage.style.color = "lightgreen";

    setTimeout(() => {
      window.location.href = "./views/index.html";
    }, 1000);

  } catch (error) {
    console.error("Login error:", error.message);

    if (
      error.code === "auth/invalid-credential" ||
      error.code === "auth/invalid-login-credentials"
    ) {
      loginMessage.textContent =
        "Incorrect email or password.";
    } else if (error.code === "auth/invalid-email") {
      loginMessage.textContent =
        "Please enter a valid email address.";
    } else {
      loginMessage.textContent =
        "Unable to login. Please try again.";
    }

    loginMessage.style.color = "#ff6b6b";
  }
});