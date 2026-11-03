// Pagine-lezione: video YouTube con fermo immagine, lente sulle immagini,
// frecce sinistra/destra per passare da un blocco all'altro, tema chiaro/scuro.
(function () {
  var radice = document.documentElement;
  var tema = 'dark';
  try { tema = localStorage.getItem('tema-lezioni') || 'dark'; } catch (e) {}
  radice.setAttribute('data-theme', tema);

  document.addEventListener('DOMContentLoaded', function () {
    // video YouTube: fermo immagine, il player parte solo al clic
    document.querySelectorAll('.video[data-yt]').forEach(function (box) {
      var id = box.getAttribute('data-yt');
      var inizio = box.getAttribute('data-start');
      var img = document.createElement('img');
      img.loading = 'lazy';
      img.alt = box.getAttribute('data-title') || 'Video';
      img.src = 'https://i.ytimg.com/vi/' + id + '/hqdefault.jpg';
      var b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('aria-label', 'Avvia il video');
      box.appendChild(img);
      box.appendChild(b);
      function avvia() {
        var f = document.createElement('iframe');
        f.src = 'https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&rel=0' + (inizio ? '&start=' + inizio : '');
        f.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
        f.allowFullscreen = true;
        f.title = img.alt;
        box.innerHTML = '';
        box.appendChild(f);
      }
      img.addEventListener('click', avvia);
      b.addEventListener('click', avvia);
    });
    // video Vimeo: player incorporato direttamente
    document.querySelectorAll('.video[data-vimeo]').forEach(function (box) {
      var f = document.createElement('iframe');
      var h = box.getAttribute('data-h');
      f.src = 'https://player.vimeo.com/video/' + box.getAttribute('data-vimeo') + (h ? '?h=' + h : '');
      f.loading = 'lazy';
      f.allow = 'autoplay; fullscreen; picture-in-picture';
      f.allowFullscreen = true;
      f.title = box.getAttribute('data-title') || 'Video';
      box.appendChild(f);
    });

    // lente
    var lente = document.createElement('div');
    lente.id = 'lente';
    var li = document.createElement('img');
    var lp = document.createElement('p');
    lente.appendChild(li);
    lente.appendChild(lp);
    document.body.appendChild(lente);
    lente.addEventListener('click', function () { lente.classList.remove('aperta'); });
    document.querySelectorAll('.striscia figure > img').forEach(function (im) {
      im.addEventListener('click', function () {
        li.src = im.src;
        var cap = im.parentNode.querySelector('figcaption');
        lp.textContent = cap ? cap.textContent : '';
        lente.classList.add('aperta');
      });
    });

    // comandi: tema
    var box = document.createElement('div');
    box.id = 'comandi';
    var bt = document.createElement('button');
    bt.type = 'button';
    function etichetta() { bt.textContent = tema === 'dark' ? 'Chiaro' : 'Scuro'; }
    etichetta();
    bt.addEventListener('click', function () {
      tema = tema === 'dark' ? 'light' : 'dark';
      radice.setAttribute('data-theme', tema);
      try { localStorage.setItem('tema-lezioni', tema); } catch (e) {}
      etichetta();
    });
    box.appendChild(bt);
    document.body.appendChild(box);

    // frecce: blocco successivo e precedente
    var blocchi = Array.prototype.slice.call(document.querySelectorAll('section.blocco, header.testata'));
    document.addEventListener('keydown', function (ev) {
      if (ev.key === 'Escape') { lente.classList.remove('aperta'); return; }
      if (ev.target.closest && ev.target.closest('input, textarea')) return;
      if (ev.key !== 'ArrowRight' && ev.key !== 'ArrowLeft') return;
      var y = window.scrollY + 10;
      var i = blocchi.findIndex(function (b) { return b.offsetTop > y; });
      if (ev.key === 'ArrowRight') {
        if (i >= 0) blocchi[i].scrollIntoView();
      } else {
        var prec = blocchi.filter(function (b) { return b.offsetTop < y - 20; });
        if (prec.length) prec[prec.length - 1].scrollIntoView();
      }
      ev.preventDefault();
    });
  });
})();
