/* status.js – Halaman Status & Riwayat Pesanan (interaktif + simulasi)
   Data contoh meniru tabel `pesanan` dan `detail_pesanan` pada proposal. */

PageInit.status = function () {
  var STATUS = ['Menunggu Diproses', 'Siap Diambil', 'Selesai'];
  var CLASS  = ['menunggu', 'siap', 'selesai'];
  var PESAN  = [
    'Pesananmu sudah diterima dan menunggu diproses oleh penjual.',
    'Pesananmu sudah siap! Silakan ambil di stan penjual. 🎉',
    'Pesanan telah selesai. Terima kasih sudah memesan! 😊'
  ];

  /* ---- Data contoh (id_pesanan, tanggal, status, detail) ---- */
  var pesanan = [
    { id: 'PSN-1007', tanggal: '2026-10-26 11:42', status: 0,
      items: [{ menu: 'Nasi Goreng Spesial', jumlah: 1, harga: 15000 }, { menu: 'Es Teh Manis', jumlah: 2, harga: 4000 }] },
    { id: 'PSN-1006', tanggal: '2026-10-24 12:10', status: 2,
      items: [{ menu: 'Mie Ayam Bakso', jumlah: 1, harga: 13000 }, { menu: 'Jus Jeruk', jumlah: 1, harga: 8000 }] },
    { id: 'PSN-1005', tanggal: '2026-10-23 09:30', status: 2,
      items: [{ menu: 'Roti Bakar Cokelat', jumlah: 2, harga: 9000 }, { menu: 'Kopi Susu', jumlah: 1, harga: 10000 }] },
    { id: 'PSN-1004', tanggal: '2026-10-21 13:05', status: 2,
      items: [{ menu: 'Ayam Geprek', jumlah: 1, harga: 16000 }, { menu: 'Es Teh Manis', jumlah: 1, harga: 4000 }] },
    { id: 'PSN-1003', tanggal: '2026-10-19 12:45', status: 2,
      items: [{ menu: 'Soto Ayam', jumlah: 1, harga: 14000 }] },
    { id: 'PSN-1002', tanggal: '2026-10-16 10:15', status: 2,
      items: [{ menu: 'Pisang Goreng', jumlah: 3, harga: 3000 }, { menu: 'Teh Hangat', jumlah: 1, harga: 3000 }] }
  ];
  var initialActiveStatus = pesanan[0].status;
  var activeOrder = pesanan[0];          // pesanan terbaru = yang dipantau
  var autoTimer = null;

  /* ---- Helper ---- */
  function rp(n) { return 'Rp ' + n.toLocaleString('id-ID'); }
  function totalOf(p) { return p.items.reduce(function (s, i) { return s + i.jumlah * i.harga; }, 0); }
  function countOf(p) { return p.items.reduce(function (s, i) { return s + i.jumlah; }, 0); }
  function fmtTgl(s) {
    var d = new Date(s.replace(' ', 'T'));
    return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }) +
           ', ' + s.slice(11);
  }

  /* ---- Tab ---- */
  $('.tab-btn').on('click', function () {
    $('.tab-btn').removeClass('active'); $(this).addClass('active');
    $('.tab-panel').removeClass('active');
    $('#' + $(this).data('tab')).addClass('active');
    if ($(this).data('tab') === 'tab-riwayat') renderRiwayat();
  });

  /* ---- Tab Status ---- */
  function renderStatus() {
    var p = activeOrder, s = p.status;
    $('#st-nomor').text(p.id);
    $('#st-pill').attr('class', 'pill ' + CLASS[s]).text(STATUS[s]);
    $('#st-pesan').text(PESAN[s]);
    $('#st-waktu').text('Dipesan: ' + fmtTgl(p.tanggal));
    $('#st-total').text(rp(totalOf(p)));

    $('#st-items').html($.map(p.items, function (i) {
      return '<li><span>' + i.menu + ' × ' + i.jumlah + '</span><span>' + rp(i.jumlah * i.harga) + '</span></li>';
    }).join(''));

    $('#stepper .st').each(function () {
      var step = $(this).data('step');
      $(this).toggleClass('done', step < s || s === 2)
             .toggleClass('current', step === s && s < 2);
    });
    $('#btn-next').prop('disabled', s >= 2);
    if (s >= 2) stopAuto();
  }

  function nextStatus() {
    if (activeOrder.status < 2) { activeOrder.status++; renderStatus(); renderRiwayat(); }
  }
  function stopAuto() {
    clearInterval(autoTimer); autoTimer = null; $('#btn-auto').text('▶ Auto');
  }

  $('#btn-next').on('click', nextStatus);
  $('#btn-auto').on('click', function () {
    if (autoTimer) { stopAuto(); return; }
    if (activeOrder.status >= 2) return;
    $(this).text('⏸ Stop');
    autoTimer = setInterval(nextStatus, 2500);
  });
  $('#btn-reset').on('click', function () {
    stopAuto(); activeOrder.status = initialActiveStatus; renderStatus(); renderRiwayat();
  });

  /* Hentikan timer jika halaman diganti lewat AJAX */
  $(document).one('click', 'a[data-page]', stopAuto);

  /* ---- Tab Riwayat: cari, filter, urut, detail ---- */
  var sortKey = 'tanggal', sortDesc = true, openId = null;

  function view(p) {
    return { id: p.id, tanggal: p.tanggal, jumlahItem: countOf(p), total: totalOf(p), status: p.status, raw: p };
  }

  function renderRiwayat() {
    var q = $.trim($('#cari-pesanan').val()).toLowerCase();
    var f = $('#filter-status').val();

    var rows = $.map(pesanan, view).filter(function (r) {
      var inText = r.id.toLowerCase().indexOf(q) > -1 ||
        r.raw.items.some(function (i) { return i.menu.toLowerCase().indexOf(q) > -1; });
      var inStatus = !f || STATUS[r.status] === f;
      return inText && inStatus;
    });

    rows.sort(function (a, b) {
      var x = a[sortKey], y = b[sortKey];
      var c = x > y ? 1 : x < y ? -1 : 0;
      return sortDesc ? -c : c;
    });

    var html = '';
    $.each(rows, function (_, r) {
      html += '<tr class="data-row">' +
        '<td data-label="No. Pesanan"><strong>' + r.id + '</strong></td>' +
        '<td data-label="Tanggal">' + fmtTgl(r.tanggal) + '</td>' +
        '<td data-label="Item">' + r.jumlahItem + ' item</td>' +
        '<td data-label="Total">' + rp(r.total) + '</td>' +
        '<td data-label="Status"><span class="pill ' + CLASS[r.status] + '">' + STATUS[r.status] + '</span></td>' +
        '<td data-label="Detail"><button class="btn small ghost btn-detail" data-id="' + r.id + '">' +
          (openId === r.id ? 'Tutup' : 'Lihat') + '</button></td></tr>';

      if (openId === r.id) {
        html += '<tr class="detail-row"><td colspan="6"><ul class="item-list">' +
          $.map(r.raw.items, function (i) {
            return '<li><span>' + i.menu + ' × ' + i.jumlah + ' (@ ' + rp(i.harga) + ')</span><span>' +
                   rp(i.jumlah * i.harga) + '</span></li>';
          }).join('') +
          '</ul><div class="total-line"><span>Total</span><span>' + rp(r.total) + '</span></div></td></tr>';
      }
    });

    $('#tabel-riwayat tbody').html(html);
    $('#riwayat-kosong').toggle(rows.length === 0);
    $('#tabel-riwayat').toggle(rows.length > 0);

    $('#sum-jumlah').text(rows.length);
    $('#sum-total').text(rp(rows.reduce(function (s, r) { return s + r.total; }, 0)));
    $('#sum-selesai').text(rows.filter(function (r) { return r.status === 2; }).length);

    $('#tabel-riwayat th').removeClass('sorted desc');
    $('#tabel-riwayat th[data-sort="' + sortKey + '"]').addClass('sorted').toggleClass('desc', sortDesc);
  }

  $('#cari-pesanan').on('input', renderRiwayat);
  $('#filter-status').on('change', renderRiwayat);
  $('#tabel-riwayat').on('click', 'th[data-sort]', function () {
    var k = $(this).data('sort');
    if (sortKey === k) { sortDesc = !sortDesc; } else { sortKey = k; sortDesc = false; }
    renderRiwayat();
  });
  $('#tabel-riwayat').on('click', '.btn-detail', function () {
    var id = $(this).data('id');
    openId = (openId === id) ? null : id;
    renderRiwayat();
  });

  renderStatus();
  renderRiwayat();
};
