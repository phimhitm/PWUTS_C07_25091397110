/* auth.js – Validasi form Login & Registrasi (struktur tabel `users`)
   Validasi dijalankan di sisi client SEBELUM data dikirim ke server (PHP). */

PageInit.login = function () {
  var USERNAME_TERPAKAI = ['admin', 'budi', 'siti', 'kantin'];   // simulasi pengecekan duplikat
  var reUsername = /^[A-Za-z0-9_]{4,50}$/;
  var reNama = /^[A-Za-z][A-Za-z .'-]{2,99}$/;

  /* ---- Helper tampilan error ---- */
  function setError($input, msg) {
    var $f = $input.closest('.field');
    $f.removeClass('valid').addClass('invalid').find('.err').text(msg);
    return false;
  }
  function setOk($input) {
    $input.closest('.field').removeClass('invalid').addClass('valid').find('.err').text('');
    return true;
  }

  /* ---- Aturan validasi per field ---- */
  var rules = {
    'l-username': function ($i) {
      var v = $.trim($i.val());
      if (!v) return setError($i, 'Username wajib diisi.');
      if (!reUsername.test(v)) return setError($i, 'Username 4–50 karakter: huruf, angka, atau _ saja.');
      return setOk($i);
    },
    'l-password': function ($i) {
      var v = $i.val();
      if (!v) return setError($i, 'Password wajib diisi.');
      if (v.length < 6) return setError($i, 'Password minimal 6 karakter.');
      return setOk($i);
    },
    'r-nama': function ($i) {
      var v = $.trim($i.val());
      if (!v) return setError($i, 'Nama lengkap wajib diisi.');
      if (!reNama.test(v)) return setError($i, 'Nama minimal 3 huruf dan tidak boleh berisi angka.');
      return setOk($i);
    },
    'r-username': function ($i) {
      var v = $.trim($i.val());
      if (!v) return setError($i, 'Username wajib diisi.');
      if (!reUsername.test(v)) return setError($i, 'Username 4–50 karakter: huruf, angka, atau _ saja.');
      if ($.inArray(v.toLowerCase(), USERNAME_TERPAKAI) > -1) return setError($i, 'Username sudah dipakai, coba yang lain.');
      return setOk($i);
    },
    'r-role': function ($i) {
      if (!$i.val()) return setError($i, 'Silakan pilih peran.');
      return setOk($i);
    },
    'r-password': function ($i) {
      var v = $i.val();
      if (!v) return setError($i, 'Password wajib diisi.');
      if (v.length < 8) return setError($i, 'Password minimal 8 karakter.');
      if (!/[A-Za-z]/.test(v) || !/\d/.test(v)) return setError($i, 'Password harus mengandung huruf dan angka.');
      return setOk($i);
    },
    'r-konfirmasi': function ($i) {
      var v = $i.val();
      if (!v) return setError($i, 'Konfirmasi password wajib diisi.');
      if (v !== $('#r-password').val()) return setError($i, 'Konfirmasi tidak sama dengan password.');
      return setOk($i);
    }
  };

  function check($i) { var r = rules[$i.attr('id')]; return r ? r($i) : true; }

  /* ---- Validasi realtime: saat meninggalkan field & saat mengetik ---- */
  $('#form-login, #form-register').find('input, select').each(function () {
    var $i = $(this);
    $i.on('blur change', function () { check($i); });
    $i.on('input', function () {
      if ($i.closest('.field').hasClass('invalid')) check($i);
    });
  });
  $('#r-password').on('input', function () {
    if ($('#r-konfirmasi').val()) check($('#r-konfirmasi'));
  });

  /* ---- Indikator kekuatan password ---- */
  $('#r-password').on('input', function () {
    var v = $(this).val(), score = 0;
    if (v.length >= 8) score++;
    if (/[A-Z]/.test(v) && /[a-z]/.test(v)) score++;
    if (/\d/.test(v)) score++;
    if (/[^A-Za-z0-9]/.test(v)) score++;
    if (!v) score = 0;
    var label = ['Kekuatan password', 'Lemah', 'Sedang', 'Kuat', 'Sangat kuat'][score];
    var color = ['#f0e1d2', '#e03131', '#f08c00', '#74b816', '#2f9e44'][score];
    $('#pw-meter').css({ width: (score * 25) + '%', background: color });
    $('#pw-text').text(label);
  });

  /* ---- Tampilkan / sembunyikan password ---- */
  $('.toggle-pw').on('click', function () {
    var $inp = $(this).siblings('input');
    var show = $inp.attr('type') === 'password';
    $inp.attr('type', show ? 'text' : 'password');
    $(this).text(show ? '🙈' : '👁️');
  });

  /* ---- Pindah antara Login & Daftar ---- */
  $('[data-show]').on('click', function () {
    var target = $(this).data('show');
    $('#card-login').toggle(target === 'login');
    $('#card-register').toggle(target === 'register');
  });

  /* ---- Submit: validasi semua field dulu, baru kirim ke server ---- */
  function handleSubmit(formSel, fieldIds, alertSel) {
    $(formSel).on('submit', function (e) {
      var allOk = true, $firstBad = null;
      $.each(fieldIds, function (_, id) {
        var $i = $('#' + id);
        if (!check($i)) { allOk = false; if (!$firstBad) $firstBad = $i; }
      });
      if (!allOk) {
        e.preventDefault();                       // batalkan submit ke server
        $(alertSel).attr('class', 'alert error')
          .text('Periksa kembali isian yang bertanda merah.');
        $firstBad.trigger('focus');
        return;
      }
      // Normalisasi sebelum dikirim
      $(formSel).find('input[name="username"], input[name="nama"]').each(function () {
        $(this).val($.trim($(this).val()));
      });
      $(alertSel).attr('class', 'alert success').text('Data valid, mengirim ke server…');
      // Form dikirim secara normal (POST) ke action pada atribut <form>
    });
  }

  handleSubmit('#form-login', ['l-username', 'l-password'], '#alert-login');
  handleSubmit('#form-register',
    ['r-nama', 'r-username', 'r-role', 'r-password', 'r-konfirmasi'], '#alert-register');
};
