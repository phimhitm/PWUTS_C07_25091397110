/* main.js – navigasi utama dengan AJAX (jQuery) */
window.PageInit = window.PageInit || {};   // diisi oleh status.js & auth.js

$(function () {
  var $content = $('#content');
  var homeHTML = $content.html();          // simpan konten Beranda bawaan
  var pageUrls = {
    status: 'pages/status-riwayat.html',
    login:  'pages/login.html'
  };
  var titles = {
    beranda: 'Beranda', status: 'Status & Riwayat Pesanan', login: 'Login / Daftar'
  };

  /* Angka statistik Beranda (animasi hitung naik) */
  function animateStats() {
    var targets = { statCount1: 24, statCount2: 6, statCount3: 1280 };
    $.each(targets, function (id, target) {
      $({ n: 0 }).animate({ n: target }, {
        duration: 1200,
        step: function () { $('#' + id).text(Math.floor(this.n).toLocaleString('id-ID')); },
        complete: function () { $('#' + id).text(target.toLocaleString('id-ID')); }
      });
    });
  }

  function setActive(page) {
    $('#mainNav a').removeClass('active').filter('[data-page="' + page + '"]').addClass('active');
    document.title = 'Kantin Kampus – ' + (titles[page] || 'Beranda');
  }

  /* Muat halaman: beranda = HTML tersimpan, lainnya = AJAX */
  function loadPage(page) {
    if (!pageUrls[page]) page = 'beranda';
    setActive(page);
    $('#mainNav').removeClass('open');
    $('#navToggle').attr('aria-expanded', 'false');

    if (page === 'beranda') {
      $content.html(homeHTML);
      animateStats();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    $content.html('<div class="loading"><div class="spinner"></div>Memuat halaman…</div>');

    $.ajax({ url: pageUrls[page], method: 'GET', dataType: 'html', cache: false })
      .done(function (html) {
        $content.html('<div class="fade-in">' + html + '</div>');
        if (typeof PageInit[page] === 'function') PageInit[page]();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      })
      .fail(function (xhr) {
        $content.html(
          '<div class="card empty"><h3>Halaman gagal dimuat 😕</h3>' +
          '<p>Kode: ' + xhr.status + '. Jika membuka lewat <code>file://</code>, jalankan lewat server lokal ' +
          '(XAMPP / Live Server) atau GitHub Pages karena AJAX diblokir browser pada file lokal.</p></div>'
        );
      });
  }

  /* Klik semua link ber-atribut data-page → AJAX tanpa reload */
  $(document).on('click', 'a[data-page]', function (e) {
    e.preventDefault();
    var page = $(this).data('page');
    if (history.pushState) {
      history.pushState({ page: page }, '', '#' + page);
    }
    loadPage(page);
  });

  /* Tombol back/forward browser */
  $(window).on('popstate', function () {
    loadPage((location.hash || '#beranda').slice(1));
  });

  /* Hamburger menu (responsive) */
  $('#navToggle').on('click', function () {
    var open = $('#mainNav').toggleClass('open').hasClass('open');
    $(this).attr('aria-expanded', open);
  });

  /* Pindah halaman dari dalam konten (mis. tombol “Daftar di sini”) */
  $(document).on('click', '[data-goto]', function (e) {
    e.preventDefault();
    var page = $(this).data('goto');
    history.pushState({ page: page }, '', '#' + page);
    loadPage(page);
  });

  /* Awal: buka sesuai hash URL, default Beranda */
  var start = (location.hash || '#beranda').slice(1);
  if (start !== 'beranda') { loadPage(start); } else { animateStats(); }
});
