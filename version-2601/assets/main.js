const qs = (selector, root = document) => root.querySelector(selector);
const qsa = (selector, root = document) => Array.from(root.querySelectorAll(selector));

function initMenu() {
    const button = qs('.menu-toggle');
    const panel = qs('.mobile-panel');

    if (!button || !panel) {
        return;
    }

    button.addEventListener('click', () => {
        const nextState = panel.hasAttribute('hidden');
        panel.toggleAttribute('hidden', !nextState);
        button.setAttribute('aria-expanded', String(nextState));
    });
}

function initHero() {
    const slider = qs('[data-hero-slider]');

    if (!slider) {
        return;
    }

    const slides = qsa('.hero-slide', slider);
    const dots = qsa('.hero-dot', slider);
    const prev = qs('.hero-prev', slider);
    const next = qs('.hero-next', slider);
    let active = 0;
    let timer = null;

    const render = (index) => {
        active = (index + slides.length) % slides.length;
        slides.forEach((slide, position) => slide.classList.toggle('active', position === active));
        dots.forEach((dot, position) => dot.classList.toggle('active', position === active));
    };

    const start = () => {
        stop();
        timer = window.setInterval(() => render(active + 1), 5600);
    };

    const stop = () => {
        if (timer) {
            window.clearInterval(timer);
        }
    };

    prev?.addEventListener('click', () => {
        render(active - 1);
        start();
    });

    next?.addEventListener('click', () => {
        render(active + 1);
        start();
    });

    dots.forEach((dot) => {
        dot.addEventListener('click', () => {
            render(Number(dot.dataset.slide || 0));
            start();
        });
    });

    slider.addEventListener('mouseenter', stop);
    slider.addEventListener('mouseleave', start);
    render(0);
    start();
}

function yearMatches(cardYear, selected) {
    if (!selected) {
        return true;
    }

    const year = Number(cardYear || 0);
    const selectedYear = Number(selected);

    if (selectedYear === 2010) {
        return year >= 2010 && year <= 2019;
    }

    if (selectedYear === 2000) {
        return year >= 2000 && year <= 2009;
    }

    if (selectedYear === 1990) {
        return year < 2000;
    }

    return year === selectedYear;
}

function initFilters() {
    const panel = qs('[data-filter-panel]');

    if (!panel) {
        return;
    }

    const root = panel.parentElement || document;
    const cards = qsa('.js-filter-card', root);
    const keywordInput = qs('.js-keyword-filter', panel);
    const categorySelect = qs('.js-category-filter', panel);
    const yearSelect = qs('.js-year-filter', panel);
    const typeSelect = qs('.js-type-filter', panel);
    const resetButton = qs('.filter-reset', panel);
    const empty = qs('.filter-empty', root);
    const params = new URLSearchParams(window.location.search);

    if (keywordInput && params.get('q')) {
        keywordInput.value = params.get('q') || '';
    }

    const apply = () => {
        const keyword = (keywordInput?.value || '').trim().toLowerCase();
        const category = categorySelect?.value || '';
        const year = yearSelect?.value || '';
        const type = typeSelect?.value || '';
        let visibleCount = 0;

        cards.forEach((card) => {
            const haystack = [
                card.dataset.title,
                card.dataset.category,
                card.dataset.year,
                card.dataset.type,
                card.dataset.tags,
            ].join(' ').toLowerCase();
            const matchKeyword = !keyword || haystack.includes(keyword);
            const matchCategory = !category || card.dataset.category === category;
            const matchYear = yearMatches(card.dataset.year, year);
            const matchType = !type || (card.dataset.type || '').includes(type);
            const show = matchKeyword && matchCategory && matchYear && matchType;

            card.classList.toggle('is-hidden', !show);

            if (show) {
                visibleCount += 1;
            }
        });

        if (empty) {
            empty.hidden = visibleCount !== 0;
        }
    };

    [keywordInput, categorySelect, yearSelect, typeSelect].forEach((control) => {
        control?.addEventListener('input', apply);
        control?.addEventListener('change', apply);
    });

    resetButton?.addEventListener('click', () => {
        if (keywordInput) {
            keywordInput.value = '';
        }
        if (categorySelect) {
            categorySelect.value = '';
        }
        if (yearSelect) {
            yearSelect.value = '';
        }
        if (typeSelect) {
            typeSelect.value = '';
        }
        apply();
    });

    apply();
}

initMenu();
initHero();
initFilters();
