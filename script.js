document.addEventListener("DOMContentLoaded", function () {
  function track(eventName, params = {}) {
    if (typeof window.gtag !== "function") {
      return;
    }

    window.gtag("event", eventName, params);
  }

  function normalizeText(value) {
    return (value || "").replace(/\s+/g, " ").trim();
  }

  function getElementLabel(element) {
    const trackLabel = normalizeText(element.dataset.track);

    if (trackLabel) {
      return trackLabel;
    }

    const textLabel = normalizeText(element.innerText || element.textContent);

    if (textLabel) {
      return textLabel;
    }

    const hrefLabel = normalizeText(element.getAttribute("href"));

    if (hrefLabel) {
      return hrefLabel;
    }

    return "unknown";
  }

  function getExternalLabel(link) {
    const customLabel = normalizeText(link.dataset.track);

    if (customLabel) {
      return customLabel;
    }

    const textLabel = normalizeText(link.innerText || link.textContent);

    if (textLabel) {
      return textLabel.toLowerCase().replace(/\s+/g, "_");
    }

    if (link.protocol === "mailto:") {
      return "email";
    }

    return link.hostname.replace(/^www\./, "").split(".")[0] || "external";
  }

  function closeMenu() {
    if (!navLinks || !navLinks.classList.contains("active")) {
      return;
    }

    navLinks.classList.remove("active");

    if (menuBtn) {
      menuBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
    }
  }

  function showPopup(popup) {
    if (!popup) {
      return;
    }

    popup.classList.add("show");

    setTimeout(() => {
      popup.classList.remove("show");
    }, 2600);
  }

  const menuBtn = document.getElementById("menuBtn");
  const navLinks = document.getElementById("navLinks");
  const hero = document.querySelector(".hero-content");
  const heroButton = document.querySelector(".hero-btn");
  const form = document.getElementById("contactForm");
  const btn = document.getElementById("submitBtn");
  const successPopup = document.getElementById("successPopup");
  const errorPopup = document.getElementById("errorPopup");
  const year = document.getElementById("year");
  const trackedSections = new Set();

  if (menuBtn && navLinks) {
    menuBtn.addEventListener("click", function () {
      navLinks.classList.toggle("active");

      const isOpen = navLinks.classList.contains("active");

      menuBtn.innerHTML = isOpen
        ? '<i class="fa-solid fa-xmark"></i>'
        : '<i class="fa-solid fa-bars"></i>';

      track("click", {
        label: getElementLabel(menuBtn),
        tag: "BUTTON"
      });

      track("nav_click", {
        label: "menu_toggle",
        state: isOpen ? "open" : "close"
      });
    });
  }

  if (hero) {
    hero.animate(
      [
        { opacity: 0, transform: "translateY(40px)" },
        { opacity: 1, transform: "translateY(0)" }
      ],
      {
        duration: 1200,
        easing: "cubic-bezier(.16,1,.3,1)",
        fill: "forwards"
      }
    );
  }

  document.addEventListener("click", function (e) {
    const target = e.target.closest("a, button");

    if (!target || target === menuBtn) {
      return;
    }

    const tag = target.tagName;

    track("click", {
      label: getElementLabel(target),
      tag
    });

    if (target === heroButton) {
      track("cta_click", {
        label: "view_projects"
      });
    }

    if (tag === "A") {
      const href = target.getAttribute("href") || "";
      const isHashLink = href.startsWith("#") && href !== "#";
      const isNavLink = Boolean(navLinks && navLinks.contains(target));

      if (isNavLink && isHashLink) {
        track("nav_click", {
          label: href
        });
      }

      if (isHashLink) {
        const sectionTarget = document.querySelector(href);

        if (sectionTarget) {
          e.preventDefault();
          closeMenu();

          const navHeight =
            document.querySelector(".navbar")?.offsetHeight || 70;

          window.scrollTo({
            top: sectionTarget.offsetTop - navHeight,
            behavior: "smooth"
          });
        }
      } else if (navLinks && navLinks.contains(target)) {
        closeMenu();
      }

      const isExternal =
        target.href &&
        target.origin !== window.location.origin &&
        !href.startsWith("#");

      if (isExternal) {
        track("external_click", {
          label: getExternalLabel(target)
        });
      }
    }
  });

  if (form) {
    form.addEventListener("submit", async function (e) {
      e.preventDefault();
      track("form_submit", {
        label: "contact_form"
      });

      if (btn) {
        btn.disabled = true;
        btn.textContent = "Sending...";
      }

      const data = new FormData(form);

      try {
        const res = await fetch(form.action, {
          method: "POST",
          body: data
        });

        if (res.ok) {
          form.reset();
          showPopup(successPopup);
          track("form_success", {
            label: "contact_form"
          });
        } else {
          showPopup(errorPopup);
          track("form_error", {
            label: "contact_form"
          });
        }
      } catch {
        showPopup(errorPopup);
        track("form_error", {
          label: "contact_form"
        });
      }

      if (btn) {
        btn.disabled = false;
        btn.textContent = "Send Message ->";
      }
    });
  }

  const sectionObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach((entry) => {
        const sectionId = entry.target.id;

        if (!entry.isIntersecting || !sectionId || trackedSections.has(sectionId)) {
          return;
        }

        trackedSections.add(sectionId);
        track("section_view", {
          section: sectionId
        });
        sectionObserver.unobserve(entry.target);
      });
    },
    {
      threshold: 0.5
    }
  );

  document.querySelectorAll("section[id]").forEach((section) => {
    sectionObserver.observe(section);
  });

  if (year) {
    year.textContent = new Date().getFullYear();
  }
});
