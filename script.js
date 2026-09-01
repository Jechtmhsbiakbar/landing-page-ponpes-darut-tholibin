(function () {
  "use strict";

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var heroSequence = document.querySelector(".hero-seq");
  if (heroSequence) {
    requestAnimationFrame(function () {
      heroSequence.classList.add("loaded");
    });
  }

  var navbar = document.getElementById("navbar");
  function onScrollNav() {
    if (window.scrollY > 40) {
      navbar.classList.add("solid");
    } else {
      navbar.classList.remove("solid");
    }
  }

  if (navbar) {
    onScrollNav();
    window.addEventListener("scroll", onScrollNav, { passive: true });
  }

  var cue = document.getElementById("scrollCue");
  if (cue) {
    window.addEventListener(
      "scroll",
      function () {
        cue.style.opacity = window.scrollY > 80 ? "0" : "1";
      },
      { passive: true },
    );
  }

  var menuBtn = document.getElementById("menuBtn");
  var menuCloseBtn = document.getElementById("menuCloseBtn");
  var mobileMenu = document.getElementById("mobile-menu");

  function openMenu() {
    mobileMenu.classList.add("open");
    mobileMenu.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    menuBtn.setAttribute("aria-expanded", "true");
  }

  function closeMenu() {
    mobileMenu.classList.remove("open");
    mobileMenu.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    menuBtn.setAttribute("aria-expanded", "false");
  }

  if (menuBtn && menuCloseBtn && mobileMenu) {
    menuBtn.addEventListener("click", openMenu);
    menuCloseBtn.addEventListener("click", closeMenu);
    mobileMenu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", closeMenu);
    });
  }

  var revealEls = document.querySelectorAll("[data-reveal]");
  if (reduced || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) {
      el.classList.add("is-visible");
    });
  } else {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" },
    );

    revealEls.forEach(function (el) {
      revealObserver.observe(el);
    });
  }

  var counters = document.querySelectorAll("[data-count]");
  function animateCounter(el) {
    var target = parseInt(el.getAttribute("data-count"), 10);
    var suffix = el.getAttribute("data-suffix") || "";
    if (reduced) {
      el.textContent = target + suffix;
      return;
    }
    var duration = 1400;
    var start = null;
    function step(timestamp) {
      if (!start) start = timestamp;
      var progress = Math.min((timestamp - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target) + suffix;
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target + suffix;
      }
    }
    requestAnimationFrame(step);
  }

  if ("IntersectionObserver" in window) {
    var counterObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.6 },
    );

    counters.forEach(function (el) {
      counterObserver.observe(el);
    });
  } else {
    counters.forEach(animateCounter);
  }

  var parallaxImg = document.getElementById("parallaxImg");
  var parallaxWrap = document.getElementById("parallaxWrap");
  if (parallaxImg && parallaxWrap && !reduced) {
    var ticking = false;
    function updateParallax() {
      var rect = parallaxWrap.getBoundingClientRect();
      var vh = window.innerHeight;
      if (rect.bottom > 0 && rect.top < vh) {
        var progress = (vh - rect.top) / (vh + rect.height);
        var offset = (progress - 0.5) * 60;
        parallaxImg.style.transform = "translateY(" + (offset - 8) + "% )";
      }
      ticking = false;
    }
    window.addEventListener(
      "scroll",
      function () {
        if (!ticking) {
          requestAnimationFrame(updateParallax);
          ticking = true;
        }
      },
      { passive: true },
    );
    updateParallax();
  }

  var backToTop = document.getElementById("backToTop");
  if (backToTop) {
    window.addEventListener(
      "scroll",
      function () {
        if (window.scrollY > 600) {
          backToTop.classList.add("show");
        } else {
          backToTop.classList.remove("show");
        }
      },
      { passive: true },
    );

    backToTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
    });
  }
})();

/* Lightbox for program images */
(function () {
  var lb = document.getElementById("lightbox");
  if (!lb) return;
  var img = lb.querySelector(".lightbox-img");
  var closeBtn = lb.querySelector(".lightbox-close");

  function openLightbox(src, alt) {
    img.src = src;
    img.alt = alt || "";
    lb.classList.add("open");
    lb.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    lb.classList.remove("open");
    lb.setAttribute("aria-hidden", "true");
    img.src = "";
    document.body.style.overflow = "";
  }

  document.addEventListener("click", function (e) {
    var targetImg = e.target.closest && e.target.closest(".program-card img");
    if (targetImg) {
      e.preventDefault();
      openLightbox(targetImg.src, targetImg.alt);
      return;
    }

    if (e.target.matches(".lightbox-close") || e.target.matches("[data-close]")) {
      closeLightbox();
    }
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeLightbox();
  });
})();
