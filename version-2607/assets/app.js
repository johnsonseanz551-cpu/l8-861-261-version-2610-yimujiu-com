(function () {
  function qs(selector, scope) {
    return (scope || document).querySelector(selector);
  }

  function qsa(selector, scope) {
    return Array.prototype.slice.call((scope || document).querySelectorAll(selector));
  }

  function normalize(value) {
    return (value || '').toString().toLowerCase().trim();
  }

  function openTarget(button) {
    var target = button.getAttribute('data-target');
    if (!target) {
      return;
    }
    var element = qs(target);
    if (!element) {
      return;
    }
    element.classList.toggle('is-open');
  }

  function setupHeader() {
    qsa('[data-toggle]').forEach(function (button) {
      button.addEventListener('click', function () {
        openTarget(button);
      });
    });

    qsa('[data-site-search]').forEach(function (form) {
      form.addEventListener('submit', function (event) {
        event.preventDefault();
        var input = qs('input[name="q"]', form);
        var query = input ? input.value.trim() : '';
        var href = './search.html';
        if (query) {
          href += '?q=' + encodeURIComponent(query);
        }
        window.location.href = href;
      });
    });
  }

  function setupHero() {
    var hero = qs('[data-hero]');
    if (!hero) {
      return;
    }

    var slides = qsa('.hero-slide', hero);
    var dots = qsa('.hero-dot', hero);
    var current = 0;
    var timer = null;

    function show(index) {
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

    function next() {
      show(current + 1);
    }

    function start() {
      stop();
      timer = window.setInterval(next, 5200);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
        timer = null;
      }
    }

    var previous = qs('.hero-prev', hero);
    var forward = qs('.hero-next', hero);

    if (previous) {
      previous.addEventListener('click', function () {
        show(current - 1);
        start();
      });
    }

    if (forward) {
      forward.addEventListener('click', function () {
        show(current + 1);
        start();
      });
    }

    dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        show(index);
        start();
      });
    });

    hero.addEventListener('mouseenter', stop);
    hero.addEventListener('mouseleave', start);
    show(0);
    start();
  }

  function setupLibraryTools() {
    var panel = qs('[data-library-tools]');
    if (!panel) {
      return;
    }

    var input = qs('[data-library-search]', panel);
    var select = qs('[data-library-year]', panel);
    var chips = qsa('[data-filter]', panel);
    var cards = qsa('[data-card]');
    var empty = qs('[data-empty]');
    var activeGenre = '';

    function setActiveChip(target) {
      chips.forEach(function (chip) {
        chip.classList.toggle('is-active', chip === target);
      });
    }

    function applyFilter() {
      var query = normalize(input ? input.value : '');
      var year = select ? select.value : '';
      var visible = 0;

      cards.forEach(function (card) {
        var haystack = normalize([
          card.getAttribute('data-title'),
          card.getAttribute('data-genre'),
          card.getAttribute('data-tags'),
          card.getAttribute('data-region'),
          card.getAttribute('data-year')
        ].join(' '));
        var genre = card.getAttribute('data-genre') || '';
        var cardYear = card.getAttribute('data-year') || '';
        var matched = true;

        if (query && haystack.indexOf(query) === -1) {
          matched = false;
        }
        if (activeGenre && genre.indexOf(activeGenre) === -1) {
          matched = false;
        }
        if (year && cardYear !== year) {
          matched = false;
        }

        card.classList.toggle('hidden-by-filter', !matched);
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

    if (select) {
      select.addEventListener('change', applyFilter);
    }

    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        activeGenre = chip.getAttribute('data-filter') || '';
        if (activeGenre === 'all') {
          activeGenre = '';
        }
        setActiveChip(chip);
        applyFilter();
      });
    });

    var params = new URLSearchParams(window.location.search);
    var q = params.get('q');
    if (q && input) {
      input.value = q;
    }
    applyFilter();
  }

  document.addEventListener('DOMContentLoaded', function () {
    setupHeader();
    setupHero();
    setupLibraryTools();
  });
})();
