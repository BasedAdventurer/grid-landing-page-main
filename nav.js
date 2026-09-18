const $nav = document.querySelector('[data-nav]');
const $navToggler = document.querySelector('[data-nav-toggler]');
const $overlay = document.querySelector("#overlay");
const $firstNavLink = document.querySelector(".nav__link");

const getFocusableElements = () => {
    const selectors = [
        'a[href]',
        'button:not([disabled])',
        'input:not([disabled])',
        'select:not([disabled])',
        'textarea:not([disabled])',
        '[tabindex]:not([tabindex="-1"])'
    ];

    return Array.from($nav.querySelectorAll(selectors.join(',')));
}

const handleNavKeydown = (e) => {
    if (e.key === "Escape") {
        closeNavbar();
        return;
    }

    if (e.key !== "Tab") return;

    const isVisible = $nav.getAttribute("data-visible");
    if (isVisible === "false") return;

    const focusable = getFocusableElements();

    if ($navToggler && !$navToggler.disabled) {
        focusable.unshift($navToggler);
    }

    if (focusable.length === 0) return;

    first = focusable[0];
    last = focusable[focusable.length - 1];
    active = document.activeElement;

    if (e.shiftKey) {
        if (active === first) {
            e.preventDefault();
            last.focus();
        }
    } else {
        if (active === last) {
            e.preventDefault();
            first.focus();
        }
    }
}

const setPageInert = (isInert) => {
    document.querySelectorAll("main, footer, .skip-to-content, .site-header__logo")
    .forEach(el => isInert ? el.setAttribute("inert", "") : el.removeAttribute("inert"));
}

const openNavbar = () => {
    setPageInert(true);
    $nav.setAttribute('data-visible', "true");
    $nav.removeAttribute("inert");
    $navToggler.setAttribute('aria-expanded', "true");
    $overlay.classList.add("active");
    document.body.classList.add("is-locked");

    document.addEventListener("keydown", handleNavKeydown);

    setTimeout(() => $firstNavLink?.focus(), 50);
};

const closeNavbar = () => {
    setPageInert(false);
    $nav.setAttribute('data-visible', "false");
    $nav.setAttribute("inert", "");
    $navToggler.setAttribute('aria-expanded', 'false');
    $overlay.classList.remove("active");
    document.body.classList.remove("is-locked");

    document.addEventListener("keydown", handleNavKeydown);

    $navToggler?.focus();
};

const toggleNavbar = () => {
    const isVisible = $nav.getAttribute("data-visible");

    if(isVisible === "true") {
        closeNavbar();
    } else {
        openNavbar();
    }
};

$navToggler.addEventListener('click', toggleNavbar);
$overlay.addEventListener('click', closeNavbar);