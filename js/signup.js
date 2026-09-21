
import {
  createUserWithEmailAndPassword,
  updateProfile
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";

import { auth } from "./firebase-config.js";

const signupForm = document.getElementById("signupForm");
const signupMessage = document.getElementById("signupMessage");

signupForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const name = document.getElementById("signupName").value.trim();
  const email = document.getElementById("signupEmail").value.trim();
  const password = document.getElementById("signupPassword").value;

  signupMessage.textContent = "Creating your account...";

  try {
    const userCredential =
      await createUserWithEmailAndPassword(auth, email, password);

    await updateProfile(userCredential.user, {
      displayName: name
    });

    signupMessage.textContent =
      "Account created successfully! Redirecting...";

    signupMessage.style.color = "lightgreen";

    setTimeout(() => {
      window.location.href = "./login.html";
    }, 1500);

  } catch (error) {
    console.error("Signup error:", error.message);

    if (error.code === "auth/email-already-in-use") {
      signupMessage.textContent =
        "This email is already registered.";
    } else if (error.code === "auth/weak-password") {
      signupMessage.textContent =
        "Password must contain at least 6 characters.";
    } else if (error.code === "auth/invalid-email") {
      signupMessage.textContent =
        "Please enter a valid email address.";
    } else {
      signupMessage.textContent =
        "Unable to create account. Please try again.";
    }

    signupMessage.style.color = "#ff6b6b";
  }
});