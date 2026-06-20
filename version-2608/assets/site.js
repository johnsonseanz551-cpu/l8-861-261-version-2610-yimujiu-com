(function () {
  function normalize(value) {
    return (value || "").toString().trim().toLowerCase();
  }

  var menuButton = document.querySelector("[data-menu-toggle]");
  var mobileMenu = document.querySelector("[data-mobile-menu]");
  if (menuButton && mobileMenu) {
    menuButton.addEventListener("click", function () {
      mobileMenu.classList.toggle("is-open");
    });
  }

  var carousel = document.querySelector("[data-hero-carousel]");
  if (carousel) {
    var slides = Array.prototype.slice.call(carousel.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(carousel.querySelectorAll("[data-hero-dot]"));
    var nextButton = carousel.querySelector("[data-hero-next]");
    var prevButton = carousel.querySelector("[data-hero-prev]");
    var current = 0;
    var timer = null;

    function showSlide(index) {
      if (!slides.length) {
        return;
      }
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("is-active", slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("is-active", dotIndex === current);
      });
    }

    function startTimer() {
      window.clearInterval(timer);
      timer = window.setInterval(function () {
        showSlide(current + 1);
      }, 5200);
    }

    dots.forEach(function (dot) {
      dot.addEventListener("click", function () {
        showSlide(Number(dot.getAttribute("data-hero-dot")) || 0);
        startTimer();
      });
    });

    if (nextButton) {
      nextButton.addEventListener("click", function () {
        showSlide(current + 1);
        startTimer();
      });
    }

    if (prevButton) {
      prevButton.addEventListener("click", function () {
        showSlide(current - 1);
        startTimer();
      });
    }

    showSlide(0);
    startTimer();
  }

  var filterGrid = document.querySelector("[data-filter-grid]");
  if (filterGrid) {
    var cards = Array.prototype.slice.call(filterGrid.querySelectorAll("[data-movie-card]"));
    var keywordInput = document.querySelector("[data-filter-input]");
    var typeSelect = document.querySelector("[data-filter-type]");
    var yearSelect = document.querySelector("[data-filter-year]");
    var params = new URLSearchParams(window.location.search);
    var initialQuery = params.get("q") || "";

    if (keywordInput && initialQuery) {
      keywordInput.value = initialQuery;
    }

    function applyFilters() {
      var keyword = normalize(keywordInput && keywordInput.value);
      var selectedType = normalize(typeSelect && typeSelect.value);
      var selectedYear = normalize(yearSelect && yearSelect.value);

      cards.forEach(function (card) {
        var text = normalize(card.getAttribute("data-title"));
        var type = normalize(card.getAttribute("data-type"));
        var year = normalize(card.getAttribute("data-year"));
        var matchKeyword = !keyword || text.indexOf(keyword) !== -1;
        var matchType = !selectedType || type.indexOf(selectedType) !== -1;
        var matchYear = !selectedYear || year === selectedYear || (selectedYear === "1990" && Number(year) < 2020);
        card.classList.toggle("is-hidden", !(matchKeyword && matchType && matchYear));
      });
    }

    [keywordInput, typeSelect, yearSelect].forEach(function (control) {
      if (control) {
        control.addEventListener("input", applyFilters);
        control.addEventListener("change", applyFilters);
      }
    });

    applyFilters();
  }
})();
