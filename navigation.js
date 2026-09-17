const $nav = document.querySelector("[data-nav]");
const $navToggler = document.querySelector("[data-nav-toggler]");
const $overlay = document.getElementById("overlay");
const $firstNavLink = document.querySelector(".nav__link");
const $header = document.querySelector('.header');

// Header scroll state changes
/** 
window.addEventListener("scroll", () => {
    if(window.scrollY > 50) {
        $header.classList.add("is-scrolled");
    } else {
        $header.classList.remove("is-scrolled");
    }
});
*/

// --------------------------------------------------------
// 1. HELPERS: Get all focusable elements inside the navbar
// --------------------------------------------------------

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
};

// --------------------------------------------------------
// 2. FOCUS TRAP handler (only active when navbar is open)
// --------------------------------------------------------

const handleFocusTrap = (e) => {
    if (e.key !== "Tab") return;
    
    const isVisible = $nav.getAttribute("data-visible");
    if (isVisible === "false") return;

    const focusable = getFocusableElements();
    // Include toggle button as the LAST element in the trap
    if ($navToggler && !$navToggler.disabled) {
        focusable.push($navToggler);
    }
    if (focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const active = document.activeElement;

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
};

// ---------------------------------
// 3. OPEN & CLOSE navbar function
// ---------------------------------

const openNavbar = () => {
    $nav.setAttribute("data-visible", "true");
    $overlay.classList.add("active");
    $navToggler.setAttribute("aria-expanded", "true");
    $nav.removeAttribute("inert");
    document.body.classList.add("is-locked");

    document.addEventListener("keydown", handleFocusTrap);

    setTimeout(() => $firstNavLink?.focus(), 50);
};

const closeNavbar = () => {
    $nav.setAttribute("data-visible", "false");
    $overlay.classList.remove("active");
    $navToggler.setAttribute("aria-expanded", "false");
    $nav.setAttribute("inert", "");
    document.body.classList.remove("is-locked");

    document.removeEventListener("keydown", handleFocusTrap);

    $navToggler?.focus();
};

const toggleNavbar = () => {
    const isVisible = $nav.getAttribute("data-visible");
    if (isVisible === "true") {
        closeNavbar();
    } else {
        openNavbar();
    }
};

$navToggler.addEventListener("click", toggleNavbar);

