document.addEventListener("DOMContentLoaded", function () {
  function track(eventName, params = {}) {
    if (typeof window.gtag !== "function") {
      return;
    }

    window.gtag("event", eventName, params);
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
  const form = document.getElementById("contactForm");
  const btn = document.getElementById("submitBtn");
  const successPopup = document.getElementById("successPopup");
  const errorPopup = document.getElementById("errorPopup");
  const year = document.getElementById("year");

  if (menuBtn && navLinks) {
    menuBtn.addEventListener("click", function () {
      navLinks.classList.toggle("active");

      const isOpen = navLinks.classList.contains("active");

      menuBtn.innerHTML = isOpen
        ? '<i class="fa-solid fa-xmark"></i>'
        : '<i class="fa-solid fa-bars"></i>';
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

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const href = this.getAttribute("href");

      if (!href || href === "#") {
        return;
      }

      const target = document.querySelector(href);

      if (!target) {
        return;
      }

      e.preventDefault();

      if (navLinks && navLinks.classList.contains("active")) {
        navLinks.classList.remove("active");

        if (menuBtn) {
          menuBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
        }
      }

      const navHeight = document.querySelector(".navbar")?.offsetHeight || 70;

      window.scrollTo({
        top: target.offsetTop - navHeight,
        behavior: "smooth"
      });
    });
  });

  if (form) {
    form.addEventListener("submit", async function (e) {
      e.preventDefault();
      track("form_submit", { label: "contact_form" });

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
          track("form_success", { label: "contact_form" });
        } else {
          showPopup(errorPopup);
          track("form_error", { label: "contact_form" });
        }
      } catch {
        showPopup(errorPopup);
        track("form_error", { label: "contact_form" });
      }

      if (btn) {
        btn.disabled = false;
        btn.textContent = "Send Message ->";
      }
    });
  }

  if (year) {
    year.textContent = new Date().getFullYear();
  }
});
