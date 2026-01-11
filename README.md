# 📦 Smart Cloud Storage

A modern cloud-based file storage web application built using Supabase and deployed on GitHub Pages.  
It allows users to securely upload, organize, download, and manage files with a clean and luxury UI.

🔗 **Live Demo:**  
https://anshumanrai433.github.io/smart-cloud-storage/

🔗 **GitHub Repository:**  
https://github.com/anshumanrai433/Smart-Cloud-Storage

---

## 🚀 Features

- 🔐 Secure Authentication (Email & Password)
- ☁️ Cloud File Storage using Supabase
- 📁 Folder System (Custom folders)
- ⬆️ File Upload & ⬇️ Download
- 🗑️ File Delete with real-time sync
- 📊 Storage Usage Meter (15GB limit)
- 🔄 Grid / List View Toggle
- 🔍 Sort Files (By Date, Name, Size)
- 📱 Fully Responsive UI
- ✨ Modern Glassmorphism Design
- 🔐 Row Level Security (RLS enabled)
- 🌍 Live Hosting on GitHub Pages

---

## 🛠️ Tech Stack

- HTML
- CSS (Glassmorphism UI)
- JavaScript
- Supabase Authentication
- Supabase Storage
- Supabase Database
- GitHub Pages

---

## 🧑‍💻 How to Use (IMPORTANT)

### 🔹 Step 1: Signup (First Time Only)

1. Open the live website  
   👉 https://anshumanrai433.github.io/smart-cloud-storage/
2. Enter your **Email** and **Password**
3. Click **Sign Up**
4. Your account will be created successfully

> Signup is required only once.

---

### 🔹 Step 2: Login

1. Enter the **same Email & Password**
2. Click **Login**
3. You will be redirected to the **Dashboard**

---

### 🔹 Step 3: Upload Files

1. Select a folder from the dropdown (or use Root)
2. Click **Choose File**
3. Click **Upload**
4. File will be uploaded to the cloud

---

### 🔹 Step 4: Manage Files

- ⬇️ Download files
- 🗑️ Delete files
- 🔄 Switch between Grid / List view
- 🔃 Sort files by Date / Name / Size

---

### 🔹 Step 5: Logout

- Click **Logout**
- You will be safely logged out

---

## 📁 Folder System

- Users can create custom folders
- Files are stored inside selected folders
- Folder structure persists after page refresh

> Note: Supabase storage does not support empty folders, so internal placeholders are used.

---

## 🔐 Security

- Row Level Security (RLS) enabled
- Users can access **only their own files**
- Storage policies ensure:
  - Only owner can upload
  - Only owner can download
  - Only owner can delete

---

## 📊 Storage Limit

- Free tier storage: **15GB per user**
- Storage usage bar updates dynamically
- File size is calculated from database metadata

---

## 🧠 Project Architecture
Frontend (GitHub Pages)
|
├── Supabase Auth (Login / Signup)
├── Supabase Storage (Files)
└── Supabase Database (File Metadata)


---

## 🧪 Tested Scenarios

- Upload & refresh → data persists
- Delete & refresh → file removed
- Logout & login → session maintained
- Multiple users → isolated storage

---

## 📌 Future Enhancements

- Shareable file links
- Password-protected downloads
- Nested folder system
- Drag & drop uploads
- File expiry feature

---

## 👨‍🎓 Academic Relevance

This project was developed as a **Cloud Computing Mini Project**, demonstrating:

- Cloud storage concepts
- Authentication & authorization
- Secure access using RLS
- Real-world deployment

---

## 👤 Author

**Anshuman Rai**  
B.Tech – Computer Science & Engineering  

📧 Email: anshumanrai433@gmail.com  
🔗 GitHub: https://github.com/anshumanrai433  
🔗 LinkedIn: https://linkedin.com/in/anshumanrai433  

---

## ⭐ Support

If you like this project, give it a ⭐ on GitHub.

