(function () {
    var navButton = document.querySelector('.nav-toggle');
    var mobileNav = document.querySelector('.mobile-nav');

    if (navButton && mobileNav) {
        navButton.addEventListener('click', function () {
            mobileNav.classList.toggle('is-open');
        });
    }

    var slides = Array.prototype.slice.call(document.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(document.querySelectorAll('.hero-dot'));
    var activeIndex = 0;
    var timer = null;

    function showSlide(index) {
        if (!slides.length) {
            return;
        }

        activeIndex = (index + slides.length) % slides.length;

        slides.forEach(function (slide, slideIndex) {
            slide.classList.toggle('is-active', slideIndex === activeIndex);
        });

        dots.forEach(function (dot, dotIndex) {
            dot.classList.toggle('is-active', dotIndex === activeIndex);
        });
    }

    function startHeroTimer() {
        if (slides.length <= 1) {
            return;
        }

        timer = window.setInterval(function () {
            showSlide(activeIndex + 1);
        }, 5200);
    }

    dots.forEach(function (dot, index) {
        dot.addEventListener('click', function () {
            if (timer) {
                window.clearInterval(timer);
            }
            showSlide(index);
            startHeroTimer();
        });
    });

    startHeroTimer();

    var localSearch = document.querySelector('[data-local-search]');
    var localItems = Array.prototype.slice.call(document.querySelectorAll('[data-search-item]'));
    var localEmpty = document.querySelector('[data-empty-state]');

    if (localSearch && localItems.length) {
        localSearch.addEventListener('input', function () {
            var keyword = localSearch.value.trim().toLowerCase();
            var visible = 0;

            localItems.forEach(function (item) {
                var haystack = (item.getAttribute('data-search-text') || '').toLowerCase();
                var matched = haystack.indexOf(keyword) !== -1;
                item.style.display = matched ? '' : 'none';
                if (matched) {
                    visible += 1;
                }
            });

            if (localEmpty) {
                localEmpty.classList.toggle('is-visible', visible === 0);
            }
        });
    }

    var globalSearch = document.querySelector('[data-global-search]');
    var globalResults = document.querySelector('[data-search-results]');
    var globalEmpty = document.querySelector('[data-search-empty]');
    var globalTitle = document.querySelector('[data-search-title]');

    function makeResultCard(movie) {
        return [
            '<article class="movie-card">',
            '<a class="poster-link" href="./' + movie.file + '" aria-label="' + escapeHtml(movie.title) + '">',
            '<img src="' + movie.cover + '" alt="' + escapeHtml(movie.title) + '" loading="lazy">',
            '<span class="poster-badge">' + escapeHtml(movie.category) + '</span>',
            '<span class="poster-play">▶</span>',
            '</a>',
            '<div class="movie-card-body">',
            '<div class="meta-line"><span>' + escapeHtml(movie.year) + '</span><span>' + escapeHtml(movie.region) + '</span><span>' + escapeHtml(movie.type) + '</span></div>',
            '<h3 class="movie-card-title"><a href="./' + movie.file + '">' + escapeHtml(movie.title) + '</a></h3>',
            '<p>' + escapeHtml(movie.oneLine) + '</p>',
            '<div class="tag-row"><span>' + escapeHtml(movie.genre) + '</span></div>',
            '</div>',
            '</article>'
        ].join('');
    }

    function escapeHtml(value) {
        return String(value)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    function renderSearch(keyword) {
        if (!globalSearch || !globalResults || !window.SEARCH_MOVIES) {
            return;
        }

        var normalized = keyword.trim().toLowerCase();
        var movies = window.SEARCH_MOVIES;
        var matches = movies.filter(function (movie) {
            return movie.searchText.toLowerCase().indexOf(normalized) !== -1;
        }).slice(0, 96);

        if (!normalized) {
            matches = movies.slice(0, 36);
        }

        globalResults.innerHTML = matches.map(makeResultCard).join('');

        if (globalEmpty) {
            globalEmpty.classList.toggle('is-visible', matches.length === 0);
        }

        if (globalTitle) {
            globalTitle.textContent = normalized ? '搜索结果' : '热门推荐';
        }
    }

    if (globalSearch && globalResults) {
        var params = new URLSearchParams(window.location.search);
        var query = params.get('q') || '';
        globalSearch.value = query;
        renderSearch(query);
        globalSearch.addEventListener('input', function () {
            renderSearch(globalSearch.value);
        });
    }
})();
