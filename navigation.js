const $nav = document.querySelector("[data-nav]");
const $navToggler = document.querySelector("[data-nav-toggler]");
const $overlay = document.getElementById("overlay");
const $firstNavLink = document.querySelector(".nav__link");

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
// 2. Handle Keydown Event Listener and Focus Trap in Navbar
// --------------------------------------------------------

const handleNavKeydown = (e) => {
    // If the user press Escape => closeNavbar() => return (exit the function)
    if (e.key === "Escape") {
        closeNavbar();
        return;
    }

    // If the user press a key other than tab => return (exit the function) 
    if (e.key !== "Tab") return;
    
    // If the data-visible = false (The Nav Menu is not opened by user) => return (exit the function)
    const isVisible = $nav.getAttribute("data-visible");
    if (isVisible === "false") return;

    // Get the focusable element from the navbar (link1, link2, link3, link4, ....)
    const focusable = getFocusableElements();
    // If there is an Menu Button ($navToggler) and not disabled
    // unshift (put navToggler to the first index of array(focusable)) if navToggler comes before the nav itself
    // push (put navToggler to the last index of array(focusable)) if navToggler comes after the nav
    // Skip if the close toggle button is inside the nav
    if ($navToggler && !$navToggler.disabled) {
        focusable.push($navToggler);
    }
    // If there isnt a focusable element inside the trap => return
    if (focusable.length === 0) return;

    // Take first focusable element in the array
    const first = focusable[0];
    // Take last focusable element in the array
    const last = focusable[focusable.length - 1];
    // Take the focusable element that has focus right now
    const active = document.activeElement;

    // The Trap Logic
    if (e.shiftKey) {
        // Shift+Tab = going BACKWARD
        // If user on the toggler (focusable[0])
        if (active === first) {
            // Stop the browser from leaving the drawer
            e.preventDefault();
            // Jump to the last link or last element
            last.focus();
        }
    } else {
        // If user on the last link then pressing TAB
        if (active === last) {
            // Stop the browser from leaving the drawer
            e.preventDefault();
            // Jump back to the toggler (first element of the array)
            first.focus();
        }
    }
};

const setPageInert = (isInert) => {
    document.querySelectorAll("main, footer, .skip-to-content, .site-header__logo")
    .forEach(el => isInert ? el.setAttribute("inert", "") : el.removeAttribute("inert"));
};

// ---------------------------------
// 3. OPEN & CLOSE navbar function
// ---------------------------------

const openNavbar = () => {
    setPageInert(true);
    $nav.setAttribute("data-visible", "true");
    $overlay.classList.add("active");
    $navToggler.setAttribute("aria-expanded", "true");
    $nav.removeAttribute("inert");
    document.body.classList.add("is-locked");

    document.addEventListener("keydown", handleNavKeydown);

    setTimeout(() => $firstNavLink?.focus(), 50);
};

const closeNavbar = () => {
    setPageInert(false);
    $nav.setAttribute("data-visible", "false");
    $overlay.classList.remove("active");
    $navToggler.setAttribute("aria-expanded", "false");
    $nav.setAttribute("inert", "");
    document.body.classList.remove("is-locked");

    document.removeEventListener("keydown", handleNavKeydown);

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
$overlay.addEventListener("click", closeNavbar);
