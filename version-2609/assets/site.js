(function () {
  var menuButton = document.querySelector('[data-menu-button]');
  var mobilePanel = document.querySelector('[data-mobile-panel]');

  if (menuButton && mobilePanel) {
    menuButton.addEventListener('click', function () {
      mobilePanel.classList.toggle('is-open');
    });
  }

  var hero = document.querySelector('[data-hero]');

  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var previous = hero.querySelector('[data-hero-prev]');
    var next = hero.querySelector('[data-hero-next]');
    var current = 0;

    function showSlide(index) {
      if (!slides.length) {
        return;
      }

      current = (index + slides.length) % slides.length;

      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === current);
      });

      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === current);
      });
    }

    if (previous) {
      previous.addEventListener('click', function () {
        showSlide(current - 1);
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        showSlide(current + 1);
      });
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        showSlide(Number(dot.getAttribute('data-hero-dot')));
      });
    });

    if (slides.length > 1) {
      setInterval(function () {
        showSlide(current + 1);
      }, 5200);
    }
  }

  var params = new URLSearchParams(window.location.search);
  var queryFromUrl = params.get('q') || '';
  var filterRoots = Array.prototype.slice.call(document.querySelectorAll('[data-filter-root]'));

  filterRoots.forEach(function (root) {
    var input = root.querySelector('[data-filter-input]');
    var year = root.querySelector('[data-year-filter]');
    var section = root.parentElement || document;
    var items = Array.prototype.slice.call(section.querySelectorAll('.filter-item'));
    var empty = section.querySelector('[data-empty-state]');

    if (input && queryFromUrl) {
      input.value = queryFromUrl;
    }

    function applyFilter() {
      var q = input ? input.value.trim().toLowerCase() : '';
      var selectedYear = year ? year.value : '';
      var visible = 0;

      items.forEach(function (item) {
        var text = (item.getAttribute('data-search') || '').toLowerCase();
        var itemYear = item.getAttribute('data-year') || '';
        var matchedText = !q || text.indexOf(q) !== -1;
        var matchedYear = !selectedYear || itemYear === selectedYear;
        var matched = matchedText && matchedYear;

        item.style.display = matched ? '' : 'none';

        if (matched) {
          visible += 1;
        }
      });

      if (empty) {
        empty.classList.toggle('is-visible', visible === 0);
      }
    }

    if (input) {
      input.addEventListener('input', applyFilter);
    }

    if (year) {
      year.addEventListener('change', applyFilter);
    }

    applyFilter();
  });

  var video = document.querySelector('[data-video-url]');

  if (video) {
    var mediaUrl = video.getAttribute('data-video-url');
    var cover = document.querySelector('[data-play-cover]');
    var initialized = false;

    function prepareVideo() {
      if (initialized || !mediaUrl) {
        return;
      }

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = mediaUrl;
      } else if (window.Hls && window.Hls.isSupported()) {
        var hls = new window.Hls();
        hls.loadSource(mediaUrl);
        hls.attachMedia(video);
      } else {
        video.src = mediaUrl;
      }

      initialized = true;
    }

    function startVideo() {
      prepareVideo();

      if (cover) {
        cover.classList.add('is-hidden');
      }

      var playPromise = video.play();

      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(function () {});
      }
    }

    if (cover) {
      cover.addEventListener('click', startVideo);
    }

    video.addEventListener('click', function () {
      if (!initialized) {
        startVideo();
      }
    });
  }
})();
