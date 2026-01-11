import { supabase } from "./supabase.js";

const bucket = "user files";

/* ===== DOM ===== */
const filesGrid = document.getElementById("filesGrid");
const fileInput = document.getElementById("fileInput");
const uploadBtn = document.getElementById("uploadBtn");
const newFolderBtn = document.getElementById("newFolderBtn");
const folderSelect = document.getElementById("folderSelect");
const folderMenuBtn = document.getElementById("folderMenuBtn");
const logoutBtn = document.getElementById("logoutBtn");

const gridBtn = document.getElementById("gridBtn");
const listBtn = document.getElementById("listBtn");
const sortSelect = document.getElementById("sortSelect");

const storageBar = document.getElementById("storageBar");
const storageText = document.getElementById("storageText");
const dropZone = document.getElementById("dropZone");
const toast = document.getElementById("toast");

/* MODAL */
const modal = document.getElementById("folderModal");
const modalTitle = document.getElementById("modalTitle");
const folderInput = document.getElementById("folderInput");
const confirmBtn = document.getElementById("confirmBtn");
const cancelBtn = document.getElementById("cancelBtn");
const deleteBtn = document.getElementById("deleteBtn");

/* ===== STATE ===== */
let currentUser = null;
let currentFolder = "root";
let view = "grid";
let allFiles = [];

/* ===== UTILS ===== */
function showToast(msg) {
  toast.textContent = msg;
  toast.style.display = "block";
  setTimeout(() => (toast.style.display = "none"), 2200);
}

/* ===== INIT ===== */
(async () => {
  const { data } = await supabase.auth.getUser();
  if (!data.user) {
    location.href = "index.html";
    return;
  }
  currentUser = data.user;
  await loadFolders();
  await loadFiles();
})();

/* ===== LOAD FOLDERS ===== */
async function loadFolders() {
  const { data } = await supabase
    .from("files")
    .select("folder")
    .eq("user_id", currentUser.id);

  const folders = new Set(["root"]);
  (data || []).forEach(f => folders.add(f.folder));

  folderSelect.innerHTML = "";
  folders.forEach(f => {
    const opt = document.createElement("option");
    opt.value = f;
    opt.textContent = f;
    folderSelect.appendChild(opt);
  });

  folderSelect.value = currentFolder;
}

folderSelect.onchange = () => {
  currentFolder = folderSelect.value;
  loadFiles();
};

/* ===== CREATE FOLDER (REAL FIX) ===== */
newFolderBtn.onclick = async () => {
  const name = prompt("New folder name?");
  if (!name) return;

  const dummyPath = `${currentUser.id}/${name}/.keep`;

  // upload empty placeholder file
  const emptyBlob = new Blob([""], { type: "text/plain" });

  await supabase.storage
    .from(bucket)
    .upload(dummyPath, emptyBlob, { upsert: true });

  // insert dummy DB row
  await supabase.from("files").insert({
    user_id: currentUser.id,
    file_name: ".keep",
    file_path: dummyPath,
    file_size: 0,
    folder: name
  });

  currentFolder = name;
  await loadFolders();
  await loadFiles();
  showToast("Folder created");
};

/* ===== FOLDER MENU ===== */
folderMenuBtn.onclick = () => {
  modalTitle.textContent = `Folder: ${currentFolder}`;
  folderInput.value = "";
  modal.style.display = "flex";
};

cancelBtn.onclick = () => {
  modal.style.display = "none";
};

/* ===== RENAME FOLDER ===== */
confirmBtn.onclick = async () => {
  const newName = folderInput.value.trim();
  if (!newName || newName === currentFolder) {
    modal.style.display = "none";
    return;
  }

  const { data } = await supabase
    .from("files")
    .select("*")
    .eq("user_id", currentUser.id)
    .eq("folder", currentFolder);

  for (const f of data) {
    const oldPath = f.file_path;
    const newPath = `${currentUser.id}/${newName}/${f.file_name}`;

    await supabase.storage.from(bucket).copy(oldPath, newPath);
    await supabase.storage.from(bucket).remove([oldPath]);

    await supabase
      .from("files")
      .update({ folder: newName, file_path: newPath })
      .eq("id", f.id);
  }

  currentFolder = newName;
  modal.style.display = "none";
  await loadFolders();
  await loadFiles();
  showToast("Folder renamed");
};

/* ===== DELETE FOLDER ===== */
deleteBtn.onclick = async () => {
  if (currentFolder === "root") {
    showToast("Root folder cannot be deleted");
    return;
  }

  const { data } = await supabase
    .from("files")
    .select("*")
    .eq("user_id", currentUser.id)
    .eq("folder", currentFolder);

  for (const f of data) {
    await supabase.storage.from(bucket).remove([f.file_path]);
    await supabase.from("files").delete().eq("id", f.id);
  }

  currentFolder = "root";
  modal.style.display = "none";
  await loadFolders();
  await loadFiles();
  showToast("Folder deleted");
};

/* ===== LOAD FILES ===== */
async function loadFiles() {
  const { data } = await supabase
    .from("files")
    .select("*")
    .eq("user_id", currentUser.id)
    .eq("folder", currentFolder)
    .order("created_at", { ascending: false });

  allFiles = (data || []).filter(f => f.file_name !== ".keep");
  renderFiles();
  updateStorage();
}

/* ===== RENDER ===== */
function renderFiles() {
  filesGrid.className =
    view === "list" ? "files-grid list" : "files-grid";
  filesGrid.innerHTML = "";

  if (allFiles.length === 0) {
    filesGrid.innerHTML =
      `<p style="opacity:.6">No files in this folder</p>`;
    return;
  }

  allFiles.forEach(f => {
    filesGrid.innerHTML += `
      <div class="file-card glass">
        <div class="file-name">${f.file_name}</div>
        <div class="file-size">
          ${(f.file_size / 1024 / 1024).toFixed(2)} MB
        </div>
        <div class="actions">
          <button data-dl="${f.file_path}">⬇</button>
          <button data-del="${f.id}|${f.file_path}">🗑</button>
        </div>
      </div>
    `;
  });
}

/* ===== FILE ACTIONS ===== */
filesGrid.onclick = async (e) => {
  if (e.target.dataset.dl) {
    const { data } = await supabase.storage
      .from(bucket)
      .createSignedUrl(e.target.dataset.dl, 60);
    window.open(data.signedUrl, "_blank");
  }

  if (e.target.dataset.del) {
    const [id, path] = e.target.dataset.del.split("|");
    await supabase.storage.from(bucket).remove([path]);
    await supabase.from("files").delete().eq("id", id);
    loadFiles();
    showToast("File deleted");
  }
};

/* ===== UPLOAD + DRAG DROP ===== */
async function uploadFiles(files) {
  for (const file of files) {
    const path =
      `${currentUser.id}/${currentFolder}/${Date.now()}_${file.name}`;

    await supabase.storage.from(bucket).upload(path, file);

    await supabase.from("files").insert({
      user_id: currentUser.id,
      file_name: file.name,
      file_path: path,
      file_size: file.size,
      folder: currentFolder
    });
  }
  loadFiles();
  showToast("Upload complete");
}

uploadBtn.onclick = () => fileInput.click();
fileInput.onchange = e => uploadFiles(e.target.files);

dropZone.ondragover = e => {
  e.preventDefault();
  dropZone.classList.add("drag");
};
dropZone.ondragleave = () => dropZone.classList.remove("drag");
dropZone.ondrop = e => {
  e.preventDefault();
  dropZone.classList.remove("drag");
  uploadFiles(e.dataTransfer.files);
};

/* ===== VIEW & SORT ===== */
gridBtn.onclick = () => { view = "grid"; renderFiles(); };
listBtn.onclick = () => { view = "list"; renderFiles(); };

sortSelect.onchange = () => {
  if (sortSelect.value === "name")
    allFiles.sort((a,b)=>a.file_name.localeCompare(b.file_name));
  if (sortSelect.value === "size")
    allFiles.sort((a,b)=>a.file_size-b.file_size);
  if (sortSelect.value === "date")
    allFiles.sort(
      (a,b)=>new Date(b.created_at)-new Date(a.created_at)
    );
  renderFiles();
};

/* ===== STORAGE ===== */
function updateStorage() {
  const total = allFiles.reduce((s,f)=>s+f.file_size,0);
  storageText.textContent =
    `${(total/1024/1024).toFixed(2)} MB / 15 GB`;
  storageBar.style.width =
    `${(total/(15*1024*1024*1024))*100}%`;
}

/* ===== LOGOUT ===== */
logoutBtn.onclick = async () => {
  await supabase.auth.signOut();
  location.href = "index.html";
};
