"use strict";

document.addEventListener("DOMContentLoaded", () => {
    // =====================================
    // SELECT HTML ELEMENTS
    // =====================================

    const menuToggle = document.getElementById("menuToggle");
    const navLinks = document.getElementById("navLinks");
    const themeToggle = document.getElementById("themeToggle");

    const projectModal = document.getElementById("projectModal");
    const modalTitle = document.getElementById("modalTitle");
    const modalDescription = document.getElementById("modalDescription");
    const modalStatus = document.getElementById("modalStatus");

    const closeModal = document.getElementById("closeModal");
    const modalDone = document.getElementById("modalDone");

    const currentYear = document.getElementById("currentYear");
    const backToTop = document.getElementById("backToTop");

    // Update copyright year
    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }

    // =====================================
    // MOBILE NAVIGATION
    // =====================================

    function closeNavigation() {
        if (!navLinks || !menuToggle) return;

        navLinks.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation menu");
        menuToggle.textContent = "☰";
    }

    if (menuToggle && navLinks) {
        menuToggle.addEventListener("click", (event) => {
            event.stopPropagation();

            const isOpen = navLinks.classList.toggle("open");

            menuToggle.setAttribute("aria-expanded", String(isOpen));
            menuToggle.setAttribute(
                "aria-label",
                isOpen ? "Close navigation menu" : "Open navigation menu"
            );

            menuToggle.textContent = isOpen ? "✕" : "☰";
        });

        navLinks.querySelectorAll("a").forEach((link) => {
            link.addEventListener("click", closeNavigation);
        });

        document.addEventListener("click", (event) => {
            if (
                !navLinks.contains(event.target) &&
                !menuToggle.contains(event.target)
            ) {
                closeNavigation();
            }
        });

        window.addEventListener("resize", () => {
            if (window.innerWidth > 680) {
                closeNavigation();
            }
        });
    }

    // =====================================
    // DARK / LIGHT THEME
    // =====================================

    function applyTheme(theme) {
        const isLight = theme === "light";

        document.body.classList.toggle("light-theme", isLight);

        if (themeToggle) {
            themeToggle.textContent = isLight ? "🌙" : "☀️";

            themeToggle.setAttribute(
                "aria-label",
                isLight ? "Switch to dark theme" : "Switch to light theme"
            );

            themeToggle.title = isLight
                ? "Switch to dark theme"
                : "Switch to light theme";
        }

        const themeColor = document.querySelector(
            'meta[name="theme-color"]'
        );

        if (themeColor) {
            themeColor.setAttribute(
                "content",
                isLight ? "#f8fafc" : "#0b1120"
            );
        }
    }

    let savedTheme = null;

    try {
        savedTheme = localStorage.getItem("auwalPortfolioTheme");
    } catch (error) {
        console.warn("Theme preference could not be read.");
    }

    applyTheme(savedTheme === "light" ? "light" : "dark");

    if (themeToggle) {
        themeToggle.addEventListener("click", () => {
            const isLight = document.body.classList.contains("light-theme");
            const newTheme = isLight ? "dark" : "light";

            applyTheme(newTheme);

            try {
                localStorage.setItem("auwalPortfolioTheme", newTheme);
            } catch (error) {
                console.warn("Theme preference could not be saved.");
            }
        });
    }

    // =====================================
    // PROJECT DETAILS MODAL
    // =====================================

    let lastFocusedElement = null;

    function openProjectModal(projectCard) {
        if (
            !projectModal ||
            !modalTitle ||
            !modalDescription ||
            !modalStatus
        ) {
            return;
        }

        modalTitle.textContent =
            projectCard.dataset.title || "Project Details";

        modalDescription.textContent =
            projectCard.dataset.description ||
            "No project description is available.";

        modalStatus.textContent =
            projectCard.dataset.status || "In Progress";

        lastFocusedElement =
            projectCard.querySelector(".project-button");

        projectModal.hidden = false;
        document.body.classList.add("modal-open");

        if (closeModal) {
            closeModal.focus();
        }
    }

    function closeProjectModal() {
        if (!projectModal || projectModal.hidden) return;

        projectModal.hidden = true;
        document.body.classList.remove("modal-open");

        if (lastFocusedElement) {
            lastFocusedElement.focus();
        }
    }

    document.querySelectorAll(".project-card").forEach((card) => {
        const button = card.querySelector(".project-button");

        if (button) {
            button.addEventListener("click", () => {
                openProjectModal(card);
            });
        }
    });

    if (closeModal) {
        closeModal.addEventListener("click", closeProjectModal);
    }

    if (modalDone) {
        modalDone.addEventListener("click", closeProjectModal);
    }

    if (projectModal) {
        projectModal.addEventListener("click", (event) => {
            if (event.target === projectModal) {
                closeProjectModal();
            }
        });
    }

    // =====================================
    // KEYBOARD ACCESSIBILITY
    // =====================================

    document.addEventListener("keydown", (event) => {
        if (!projectModal || projectModal.hidden) return;

        if (event.key === "Escape") {
            closeProjectModal();
            return;
        }

        if (event.key === "Tab") {
            const focusableElements = projectModal.querySelectorAll(
                'button:not([disabled]), a[href], input:not([disabled]), [tabindex]:not([tabindex="-1"])'
            );

            const focusable = Array.from(focusableElements);

            if (focusable.length === 0) return;

            const firstElement = focusable[0];
            const lastElement = focusable[focusable.length - 1];

            if (
                event.shiftKey &&
                document.activeElement === firstElement
            ) {
                event.preventDefault();
                lastElement.focus();
            } else if (
                !event.shiftKey &&
                document.activeElement === lastElement
            ) {
                event.preventDefault();
                firstElement.focus();
            }
        }
    });

    // =====================================
    // BACK TO TOP BUTTON
    // =====================================

    function updateBackToTop() {
        if (!backToTop) return;

        backToTop.classList.toggle("visible", window.scrollY > 400);
    }

    window.addEventListener("scroll", updateBackToTop, {
        passive: true
    });

    updateBackToTop();

    if (backToTop) {
        backToTop.addEventListener("click", () => {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
    }

    // =====================================
    // ACTIVE NAVIGATION LINK
    // =====================================

    const sections = document.querySelectorAll("main section[id]");

    const navigationLinks = document.querySelectorAll(
        '.nav-links a[href^="#"]'
    );

    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;

                    navigationLinks.forEach((link) => {
                        const isCurrent =
                            link.getAttribute("href") ===
                            `#${entry.target.id}`;

                        link.classList.toggle("active", isCurrent);
                    });
                });
            },
            {
                rootMargin: "-25% 0px -60% 0px"
            }
        );

        sections.forEach((section) => observer.observe(section));
    }
});