import {
  signOut
} from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";

import { auth } from "./firebase-config.js";

const logoutBtn = document.getElementById("logoutBtn");

logoutBtn?.addEventListener("click", async () => {
  try {
    await signOut(auth);

    alert("Logged out successfully!");

    window.location.href = "../login.html";

  } catch (error) {
    console.error("Logout failed:", error);

    alert("Logout failed. Please try again.");
  }
});