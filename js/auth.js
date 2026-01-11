import { supabase } from "./supabase.js";

const email = document.getElementById("email");
const password = document.getElementById("password");
const msg = document.getElementById("authMsg");
const togglePwd = document.getElementById("togglePwd");

togglePwd.onclick = () => {
  password.type = password.type === "password" ? "text" : "password";
};

document.getElementById("loginBtn").onclick = async () => {
  msg.textContent = "Signing in...";
  const { error } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value
  });
  msg.textContent = error ? error.message : "Success!";
  if (!error) location.href = "dashboard.html";
};

document.getElementById("signupBtn").onclick = async () => {
  msg.textContent = "Creating account...";
  const { error } = await supabase.auth.signUp({
    email: email.value,
    password: password.value
  });
  msg.textContent = error ? error.message : "Account created. Login now.";
};
