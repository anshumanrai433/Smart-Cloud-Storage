import { supabase } from "./supabase.js";

const loginTab = document.getElementById("loginTab");
const signupTab = document.getElementById("signupTab");
const loginBox = document.getElementById("loginBox");
const signupBox = document.getElementById("signupBox");
const msg = document.getElementById("authMsg");

/* ---------- TAB SWITCH ---------- */
loginTab.onclick = () => {
  loginTab.classList.add("active");
  signupTab.classList.remove("active");
  loginBox.style.display = "block";
  signupBox.style.display = "none";
  msg.textContent = "";
};

signupTab.onclick = () => {
  signupTab.classList.add("active");
  loginTab.classList.remove("active");
  signupBox.style.display = "block";
  loginBox.style.display = "none";
  msg.textContent = "";
};

/* ---------- LOGIN ---------- */
document.getElementById("loginBtn").onclick = async () => {
  msg.style.color = "#eab308";
  msg.textContent = "Logging in...";

  const email = loginEmail.value.trim();
  const password = loginPassword.value;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    msg.style.color = "#f87171";
    msg.textContent = error.message;
    return;
  }

  if (!data.user.email_confirmed_at) {
    msg.style.color = "#facc15";
    msg.textContent = "Please verify your email first. Check your inbox.";
    await supabase.auth.signOut();
    return;
  }

  window.location.href = "dashboard.html";
};

/* ---------- SIGNUP ---------- */
document.getElementById("signupBtn").onclick = async () => {
  const email = signupEmail.value.trim();
  const password = signupPassword.value;

  if (!email || !password) {
    msg.style.color = "#f87171";
    msg.textContent = "Email and password are required.";
    return;
  }

  if (password.length < 6) {
    msg.style.color = "#f87171";
    msg.textContent = "Password must be at least 6 characters.";
    return;
  }

  msg.style.color = "#38bdf8";
  msg.textContent = "Creating account...";

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo:
        "https://anshumanrai433.github.io/Smart-Cloud-Storage/welcome.html",
    },
  });

  if (error) {
    msg.style.color = "#f87171";
    msg.textContent = error.message;
    return;
  }

  msg.style.color = "#22c55e";
  msg.textContent =
    "✅ Confirmation email has been sent successfully. Please check your inbox and verify your email.";
};

/* ---------- FORGOT PASSWORD ---------- */
document.getElementById("forgotPwd").onclick = async () => {
  const email = prompt("Enter your registered email address:");
  if (!email) return;

  msg.style.color = "#38bdf8";
  msg.textContent = "Sending password reset email...";

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo:
      "https://anshumanrai433.github.io/Smart-Cloud-Storage/index.html",
  });

  if (error) {
    msg.style.color = "#f87171";
    msg.textContent = error.message;
  } else {
    msg.style.color = "#22c55e";
    msg.textContent =
      "Password reset email has been been sent successfully.";
  }
};
