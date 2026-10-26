<?php
// Contoh penerima form login (tanpa database, hanya demo penerimaan data HTTP POST).
// Pada versi lengkap: cek tabel `users` memakai prepared statement + password_verify().
header('Content-Type: text/html; charset=utf-8');
if ($_SERVER['REQUEST_METHOD'] !== 'POST') { http_response_code(405); exit('Metode tidak diizinkan.'); }

$username = trim($_POST['username'] ?? '');
$password = $_POST['password'] ?? '';

// Validasi ulang di server (jangan hanya percaya validasi JavaScript)
if (!preg_match('/^[A-Za-z0-9_]{4,50}$/', $username) || strlen($password) < 6) {
    http_response_code(400);
    exit('Data login tidak valid.');
}
?>
<!DOCTYPE html><html lang="id"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Hasil Login</title></head><body style="font-family:sans-serif;padding:24px">
<h2>Data login diterima server ✅</h2>
<p>Username: <strong><?= htmlspecialchars($username) ?></strong></p>
<p><a href="../index.html#login">← Kembali</a></p>
</body></html>
