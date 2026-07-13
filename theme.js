/* =========================
   THEME MANAGER
========================= */
(function () {
    const HTML = document.documentElement;
    const STORAGE_KEY = "portfolio-theme";
    const DARK = "dark";
    const LIGHT = "light";
    const META_THEME = document.querySelector('meta[name="theme-color"]');
    const META_COLORS = {
        dark: "#000000",
        light: "#d8c5aa"
    };

    function getInitialTheme() {
        let saved;
        try { saved = localStorage.getItem(STORAGE_KEY); } catch (e) { /* privacy mode */ }
        if (saved === DARK || saved === LIGHT) return saved;
        // Padrão sempre escuro — portfólio dark-first
        return DARK;
    }

    let themeIconEl = null;

    function getThemeIcon() {
        if (!themeIconEl) themeIconEl = document.getElementById("themeIconWrapper");
        return themeIconEl;
    }

    function applyTheme(theme, animate) {
        if (!animate) {
            HTML.style.transition = "none";
        }

        HTML.setAttribute("data-theme", theme);

        if (META_THEME) {
            META_THEME.setAttribute("content", META_COLORS[theme] || META_COLORS.dark);
        }

        if (!animate) {
            void HTML.offsetHeight; // força reflow para aplicar transition: none
            HTML.style.transition = "";
        }

        /* Micro-animação no ícone do tema */
        if (animate) {
            const icon = getThemeIcon();
            if (icon) {
                icon.classList.add("is-switching");
                icon.addEventListener("transitionend", function handler() {
                    icon.classList.remove("is-switching");
                    icon.removeEventListener("transitionend", handler);
                }, { once: true });
            }
        }

        try { localStorage.setItem(STORAGE_KEY, theme); } catch (e) { /* privacy mode */ }
    }

    // Aplica imediatamente sem animação para evitar flash
    applyTheme(getInitialTheme(), false);

    function initToggle() {
        const btn = document.getElementById("themeToggle");
        if (!btn) return;

        btn.addEventListener("click", () => {
            const current = HTML.getAttribute("data-theme") || DARK;
            applyTheme(current === DARK ? LIGHT : DARK, true);
        });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initToggle);
    } else {
        initToggle();
    }
})();
