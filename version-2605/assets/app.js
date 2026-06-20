(function () {
  function ready(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  }

  ready(function () {
    var searchToggle = document.querySelector(".search-toggle");
    var searchPanel = document.querySelector(".search-panel");
    var menuToggle = document.querySelector(".menu-toggle");
    var mobileNav = document.querySelector(".mobile-nav");

    if (searchToggle && searchPanel) {
      searchToggle.addEventListener("click", function () {
        searchPanel.classList.toggle("is-open");
        if (mobileNav) {
          mobileNav.classList.remove("is-open");
        }
        var input = searchPanel.querySelector("input");
        if (input && searchPanel.classList.contains("is-open")) {
          input.focus();
        }
      });
    }

    if (menuToggle && mobileNav) {
      menuToggle.addEventListener("click", function () {
        mobileNav.classList.toggle("is-open");
        if (searchPanel) {
          searchPanel.classList.remove("is-open");
        }
      });
    }

    var slides = Array.prototype.slice.call(document.querySelectorAll(".hero-slide"));
    var dots = Array.prototype.slice.call(document.querySelectorAll(".hero-dot"));
    var active = 0;

    function showSlide(index) {
      if (!slides.length) {
        return;
      }
      active = (index + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle("is-active", i === active);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle("is-active", i === active);
      });
    }

    dots.forEach(function (dot, i) {
      dot.addEventListener("click", function () {
        showSlide(i);
      });
    });

    if (slides.length > 1) {
      setInterval(function () {
        showSlide(active + 1);
      }, 5200);
    }

    var params = new URLSearchParams(window.location.search);
    var q = params.get("q") || "";
    var pageSearch = document.querySelector(".page-search-input");
    if (pageSearch && q) {
      pageSearch.value = q;
    }

    var filterScopes = Array.prototype.slice.call(document.querySelectorAll("[data-filter-scope]"));
    filterScopes.forEach(function (scope) {
      var input = scope.querySelector(".filter-input");
      var year = scope.querySelector(".filter-year");
      var type = scope.querySelector(".filter-type");
      var cards = Array.prototype.slice.call(scope.querySelectorAll(".movie-card"));

      function applyFilter() {
        var keyword = input ? input.value.trim().toLowerCase() : "";
        var selectedYear = year ? year.value : "";
        var selectedType = type ? type.value : "";
        cards.forEach(function (card) {
          var text = (card.getAttribute("data-search") || "").toLowerCase();
          var cardYear = card.getAttribute("data-year") || "";
          var cardType = card.getAttribute("data-type") || "";
          var matchKeyword = !keyword || text.indexOf(keyword) !== -1;
          var matchYear = !selectedYear || cardYear === selectedYear;
          var matchType = !selectedType || cardType === selectedType;
          card.classList.toggle("hidden-by-filter", !(matchKeyword && matchYear && matchType));
        });
      }

      if (input) {
        input.addEventListener("input", applyFilter);
      }
      if (year) {
        year.addEventListener("change", applyFilter);
      }
      if (type) {
        type.addEventListener("change", applyFilter);
      }
      if (q && input) {
        applyFilter();
      }
    });
  });
})();
