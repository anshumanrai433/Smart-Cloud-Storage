import { supabase } from "./supabase.js";

const loginTab = document.getElementById("loginTab");
const signupTab = document.getElementById("signupTab");

const loginBox = document.getElementById("loginBox");
const signupBox = document.getElementById("signupBox");

const authMsg = document.getElementById("authMsg");

/* TAB SWITCH */
loginTab.onclick = () => {
  loginTab.classList.add("active");
  signupTab.classList.remove("active");
  loginBox.style.display = "block";
  signupBox.style.display = "none";
  authMsg.textContent = "";
};

signupTab.onclick = () => {
  signupTab.classList.add("active");
  loginTab.classList.remove("active");
  signupBox.style.display = "block";
  loginBox.style.display = "none";
  authMsg.textContent = "";
};

/* LOGIN */
document.getElementById("loginBtn").onclick = async () => {
  authMsg.textContent = "Logging in...";

  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    authMsg.textContent = error.message;
    authMsg.style.color = "#f87171";
  } else {
    location.href = "dashboard.html";
  }
};

/* SIGNUP */
document.getElementById("signupBtn").onclick = async () => {
  authMsg.textContent = "Creating account...";

  const email = document.getElementById("signupEmail").value;
  const password = document.getElementById("signupPassword").value;

  if (password.length < 6) {
    authMsg.textContent = "Password must be at least 6 characters";
    authMsg.style.color = "#f87171";
    return;
  }

  const { error } = await supabase.auth.signUp({
    email,
    password
  });

  if (error) {
    authMsg.textContent = error.message;
    authMsg.style.color = "#f87171";
  } else {
    authMsg.textContent =
      "Account created successfully. Please login.";
    authMsg.style.color = "#22d3ee";

    // switch to login
    loginTab.click();
  }
};
