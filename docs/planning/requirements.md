# Requirement Analysis

## Overview

Project ini dibuat untuk memenuhi technical test Front-End & Back-End Developer Internship. Aplikasi yang akan dibangun adalah aplikasi manajemen tugas sederhana menggunakan Next.js sebagai frontend, FastAPI sebagai backend, PostgreSQL sebagai database, dan JWT untuk autentikasi.

Dokumen ini digunakan sebagai acuan selama proses development agar implementasi tetap sesuai dengan requirement yang diberikan.

---

# Core Requirements

## Frontend

- [ ] Menggunakan Next.js (App Router)
- [ ] Login sederhana
- [ ] Menampilkan daftar task
- [ ] Menambahkan task
- [ ] Mengubah task
- [ ] Menghapus task
- [ ] Mengubah status task
- [ ] Dropdown assignee yang mengambil data dari backend
- [ ] Tampilan sederhana dan mudah digunakan

## Backend

- [ ] Menggunakan FastAPI
- [ ] JWT Authentication
- [ ] CRUD Task
- [ ] Endpoint daftar user
- [ ] Seluruh data disimpan di PostgreSQL

## Database

- [ ] PostgreSQL
- [ ] Tabel users
- [ ] Tabel tasks
- [ ] Relasi task dengan assignee

## Documentation

- [ ] Postman Collection
- [ ] ERD
- [ ] README

## Bonus

- [ ] AI Chatbot untuk menjawab pertanyaan mengenai data task
- [ ] Chatbot bersifat read-only

---

# Deliverables

| No | Deliverable |
|----|-------------|
| 1 | Frontend (Next.js) |
| 2 | Backend (FastAPI) |
| 3 | PostgreSQL Database |
| 4 | Postman Collection |
| 5 | ERD |
| 6 | README |
| 7 | AI Chatbot (Opsional) |

---

# Implementation Decisions

Beberapa keputusan implementasi yang digunakan pada project ini.

### Login

Menggunakan satu akun demo yang disimpan di database. Login tetap dilakukan melalui backend menggunakan JWT.

### Task Status

Status task terdiri dari:

- `todo`
- `in_progress`
- `done`

### Search

Pencarian dilakukan berdasarkan judul task.

### Overdue

Task dianggap overdue apabila:

- deadline sudah lewat
- status belum `done`

### Delete

Menggunakan hard delete.

### Assignee

Setiap task memiliki satu assignee yang berasal dari tabel users.

### AI Chatbot

Chatbot hanya dapat membaca data task dan tidak dapat membuat, mengubah, ataupun menghapus data.

---

# Non Goals

Fitur berikut tidak termasuk dalam project ini.

- Registrasi akun
- Forgot Password
- Role & Permission
- Multi Workspace
- Drag and Drop Kanban
- Dark Mode
- Real-time Update
- File Attachment
- Comment