<?php
// Contoh penerima form registrasi (struktur tabel users: nama, username, password, role).
header('Content-Type: text/html; charset=utf-8');
if ($_SERVER['REQUEST_METHOD'] !== 'POST') { http_response_code(405); exit('Metode tidak diizinkan.'); }

$nama     = trim($_POST['nama'] ?? '');
$username = trim($_POST['username'] ?? '');
$role     = $_POST['role'] ?? '';
$password = $_POST['password'] ?? '';
$konfirm  = $_POST['konfirmasi'] ?? '';

$valid = preg_match('/^[A-Za-z][A-Za-z .\'-]{2,99}$/', $nama)
      && preg_match('/^[A-Za-z0-9_]{4,50}$/', $username)
      && in_array($role, ['siswa', 'admin'], true)
      && strlen($password) >= 8 && preg_match('/[A-Za-z]/', $password) && preg_match('/\d/', $password)
      && $password === $konfirm;
if (!$valid) { http_response_code(400); exit('Data registrasi tidak valid.'); }

// Password TIDAK boleh disimpan polos. Hash ini yang disimpan ke kolom users.password (VARCHAR 255).
$hash = password_hash($password, PASSWORD_DEFAULT);

// Versi lengkap: INSERT INTO users (nama, username, password, role) VALUES (?, ?, ?, ?)
?>
<!DOCTYPE html><html lang="id"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Hasil Registrasi</title></head><body style="font-family:sans-serif;padding:24px">
<h2>Registrasi diterima server ✅</h2>
<p>Nama: <strong><?= htmlspecialchars($nama) ?></strong><br>
Username: <strong><?= htmlspecialchars($username) ?></strong><br>
Role: <strong><?= htmlspecialchars($role) ?></strong></p>
<p><a href="../index.html#login">← Kembali</a></p>
</body></html>
