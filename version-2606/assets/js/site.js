(function () {
    var body = document.body;
    var toggle = document.querySelector(".mobile-toggle");

    if (toggle) {
        toggle.addEventListener("click", function () {
            var isOpen = body.classList.toggle("nav-open");
            toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
        });
    }

    var carousel = document.querySelector("[data-hero-carousel]");
    if (carousel) {
        var slides = Array.prototype.slice.call(carousel.querySelectorAll("[data-hero-slide]"));
        var dots = Array.prototype.slice.call(carousel.querySelectorAll("[data-hero-dot]"));
        var prev = carousel.querySelector("[data-hero-prev]");
        var next = carousel.querySelector("[data-hero-next]");
        var index = 0;
        var timer = null;

        function showSlide(nextIndex) {
            if (!slides.length) {
                return;
            }
            index = (nextIndex + slides.length) % slides.length;
            slides.forEach(function (slide, current) {
                slide.classList.toggle("is-active", current === index);
            });
            dots.forEach(function (dot, current) {
                dot.classList.toggle("is-active", current === index);
            });
        }

        function startTimer() {
            stopTimer();
            timer = window.setInterval(function () {
                showSlide(index + 1);
            }, 5200);
        }

        function stopTimer() {
            if (timer) {
                window.clearInterval(timer);
                timer = null;
            }
        }

        if (prev) {
            prev.addEventListener("click", function () {
                showSlide(index - 1);
                startTimer();
            });
        }

        if (next) {
            next.addEventListener("click", function () {
                showSlide(index + 1);
                startTimer();
            });
        }

        dots.forEach(function (dot) {
            dot.addEventListener("click", function () {
                showSlide(Number(dot.getAttribute("data-hero-dot")) || 0);
                startTimer();
            });
        });

        carousel.addEventListener("mouseenter", stopTimer);
        carousel.addEventListener("mouseleave", startTimer);
        showSlide(0);
        startTimer();
    }

    var filterInput = document.querySelector(".page-filter-input");
    var filterSelects = Array.prototype.slice.call(document.querySelectorAll(".page-filter-select"));
    var cards = Array.prototype.slice.call(document.querySelectorAll(".filterable-list .movie-card"));

    function normalize(value) {
        return String(value || "").toLowerCase().trim();
    }

    function applyFilters() {
        var keyword = normalize(filterInput ? filterInput.value : "");
        var values = {};

        filterSelects.forEach(function (select) {
            var key = select.getAttribute("data-filter-key");
            if (key) {
                values[key] = normalize(select.value);
            }
        });

        cards.forEach(function (card) {
            var text = normalize(card.getAttribute("data-search") + " " + card.getAttribute("data-title") + " " + card.textContent);
            var matchedKeyword = !keyword || text.indexOf(keyword) !== -1;
            var matchedSelects = Object.keys(values).every(function (key) {
                var value = values[key];
                return !value || normalize(card.getAttribute("data-" + key)) === value;
            });
            card.classList.toggle("is-filter-hidden", !(matchedKeyword && matchedSelects));
        });
    }

    if (filterInput || filterSelects.length) {
        var params = new URLSearchParams(window.location.search);
        var query = params.get("q");
        if (query && filterInput) {
            filterInput.value = query;
        }
        if (filterInput) {
            filterInput.addEventListener("input", applyFilters);
        }
        filterSelects.forEach(function (select) {
            select.addEventListener("change", applyFilters);
        });
        applyFilters();
    }
})();
