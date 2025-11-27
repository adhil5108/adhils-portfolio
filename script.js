
const menuBtn = document.getElementById('menuBtn');
const nav = document.getElementById('mainNav');
const navLinks = document.querySelectorAll('nav.navlinks a');
const yearEl = document.getElementById('year');
const successPopup = document.getElementById('successPopup');
const contactForm = document.getElementById('contactForm');

yearEl && (yearEl.textContent = new Date().getFullYear());


menuBtn && menuBtn.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  menuBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');

  if (isOpen) {
    const firstLink = nav.querySelector('a');
    if (firstLink) firstLink.focus();
  } else {
    menuBtn.focus();
  }
});


navLinks.forEach(a => {
  a.addEventListener('click', () => {
    if (window.innerWidth <= 720) {
      nav.classList.remove('open');
      menuBtn.setAttribute('aria-expanded', 'false');
    }
  });
});


document.addEventListener('click', (e) => {
  if (window.innerWidth <= 720 && nav.classList.contains('open')) {
    if (!nav.contains(e.target) && !menuBtn.contains(e.target)) {
      nav.classList.remove('open');
      menuBtn.setAttribute('aria-expanded', 'false');
    }
  }
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && nav.classList.contains('open')) {
    nav.classList.remove('open');
    menuBtn.setAttribute('aria-expanded', 'false');
    menuBtn.focus();
  }
});


if ('IntersectionObserver' in window) {
  const navHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 84;
  const observerOptions = {
    root: null,
    rootMargin: `-${navHeight}px 0px 0px 0px`,
    threshold: 0.45
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
     
      navLinks.forEach(link => {
        link.classList.remove('active');
        link.removeAttribute('aria-current');
      });
      const id = entry.target.id;
      if (!id) return;
      const activeLink = document.querySelector(`nav.navlinks a[href="#${id}"]`);
      if (activeLink) {
        activeLink.classList.add('active');
        activeLink.setAttribute('aria-current', 'page');
      }
    });
  }, observerOptions);

  
  document.querySelectorAll('#home, #about, #skills, #techstack, #projects, #contact').forEach(sec => {
    if (sec) observer.observe(sec);
  });
} else {
 
  const updateActiveLink = () => {
    const navHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 84;
    const fromTop = window.scrollY + navHeight;
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (!href || href.charAt(0) !== '#') return;
      const section = document.querySelector(href);
      if (!section) return;
      if (section.offsetTop <= fromTop && (section.offsetTop + section.offsetHeight) > fromTop) {
        navLinks.forEach(l => {
          l.classList.remove('active');
          l.removeAttribute('aria-current');
        });
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      }
    });
  };
  window.addEventListener('scroll', updateActiveLink, { passive: true });
  updateActiveLink();
}


document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (!href || href === '#') return;
    const target = document.querySelector(href);
    if (!target) return;

    e.preventDefault();

    const navHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 84;
    const position = target.offsetTop - navHeight + 10;

    window.scrollTo({
      top: position,
      behavior: 'smooth'
    });
  });
});


if (contactForm) {
  contactForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    const btn = document.getElementById('submitBtn');
    if (btn) {
      btn.disabled = true;
      btn.textContent = 'Sending...';
    }

    try {
      const formData = new FormData(contactForm);
      const response = await fetch(contactForm.action, {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        contactForm.reset();
        showPopup('show', 2000);
      } else {
        console.error('Form error', response.status);
         showErrorPopup();
      }
    } catch (err) {
      console.error(err);
       showErrorPopup();
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.textContent = 'Send message';
      }
    }
  });
}


function showPopup(state = 'show', duration = 2000) {
  if (!successPopup) return;
  
  const sound = document.getElementById('successSound');
  if (sound) {
    sound.currentTime = 0;
    sound.play().catch(err => console.log("Audio blocked:", err));
  }
  
  if (state === 'show') {
    successPopup.classList.remove('hide');
    successPopup.classList.add('show');
    successPopup.setAttribute('aria-hidden', 'false');
    setTimeout(() => {
      successPopup.classList.remove('show');
      successPopup.classList.add('hide');
      successPopup.setAttribute('aria-hidden', 'true');
    }, duration);
  } else {
    successPopup.classList.remove('show');
    successPopup.classList.add('hide');
    successPopup.setAttribute('aria-hidden', 'true');
  }
}
function showErrorPopup(duration = 2500) {
  const errorPopup = document.getElementById('errorPopup');
  if (!errorPopup) return;
  
  errorPopup.classList.add('show');
  errorPopup.setAttribute('aria-hidden', 'false');

  setTimeout(() => {
    errorPopup.classList.remove('show');
    errorPopup.setAttribute('aria-hidden', 'true');
  }, duration);
}

window.addEventListener('resize', () => {
  if (window.innerWidth > 720) {
    nav.classList.remove('open');
    nav.style.display = ''; 
    menuBtn && menuBtn.setAttribute('aria-expanded', 'false');
  } else {
    nav.style.display = '';
  }
});
