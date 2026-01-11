import { supabase } from "./supabase.js";

const token = new URLSearchParams(window.location.search).get("token");
const passwordInput = document.getElementById("password");
const msg = document.getElementById("msg");

document.getElementById("accessBtn").onclick = async () => {
  const { data, error } = await supabase
    .from("shared_files")
    .select("*, files(*)")
    .eq("share_token", token)
    .single();

  if (error || !data) {
    msg.textContent = "Invalid or expired link";
    return;
  }

  // password check
  if (data.password_hash) {
    if (passwordInput.value !== data.password_hash) {
      msg.textContent = "Wrong password";
      return;
    }
  }

  const { data: urlData } = await supabase.storage
    .from("user-files")
    .createSignedUrl(data.files.file_path, 60);

  window.open(urlData.signedUrl, "_blank");
};
