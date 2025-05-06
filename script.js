document.addEventListener("DOMContentLoaded", () => {
  const menuButton = document.getElementById("mobile-menu-toggle");
  const mobileNavLinksContainer = document.getElementById("mobile-nav-links");
  const desktopNavLinksContainer = document.getElementById("desktop-nav-links");

  // 1. Populate mobile navigation from desktop navigation
  if (desktopNavLinksContainer && mobileNavLinksContainer) {
    // Clone the desktop navigation links to the mobile container
    const desktopLinksHTML = desktopNavLinksContainer.innerHTML;
    mobileNavLinksContainer.innerHTML = desktopLinksHTML;

    // Add event listeners to newly created mobile links for closing menu
    // and handling smooth scroll (if not handled by CSS scroll-smooth)
    mobileNavLinksContainer.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", (e) => {
        // Close mobile menu
        mobileNavLinksContainer.classList.add("hidden");
        mobileNavLinksContainer.classList.remove("active");

        // Reset menu icon to 'bars'
        const icon = menuButton.querySelector("i");
        if (icon && icon.classList.contains("fa-times")) {
          icon.classList.remove("fa-times");
          icon.classList.add("fa-bars");
        }

        // Handle smooth scroll for anchor links
        const href = link.getAttribute("href");
        if (href && href.startsWith("#")) {
          // e.preventDefault(); // Prevent default if CSS scroll-smooth is not enough or for more control
          const targetElement = document.querySelector(href);
          if (targetElement) {
            // The html tag has 'scroll-smooth', so browser handles smooth scroll.
            // Forcing it via JS might be redundant but can offer more control if needed.
            // For now, rely on CSS 'scroll-smooth'.
            // If issues arise, uncomment preventDefault and add:
            // targetElement.scrollIntoView({ behavior: 'smooth' });
          }
        }
      });
    });
  }

  // 2. Toggle mobile menu visibility and icon
  if (menuButton && mobileNavLinksContainer) {
    menuButton.addEventListener("click", () => {
      mobileNavLinksContainer.classList.toggle("hidden");
      mobileNavLinksContainer.classList.toggle("active"); // 'active' class for styling if needed

      const icon = menuButton.querySelector("i");
      if (icon) {
        // Check if menu is now active (visible) to set icon to 'times'
        if (mobileNavLinksContainer.classList.contains("active")) {
          icon.classList.remove("fa-bars");
          icon.classList.add("fa-times");
        } else {
          icon.classList.remove("fa-times");
          icon.classList.add("fa-bars");
        }
      }
    });
  }

  // 3. Fade-in animations for sections on scroll
  const sectionsToFadeIn = document.querySelectorAll(".fade-in");
  const observerOptions = {
    root: null, // relative to document viewport
    rootMargin: "0px", // no margin
    threshold: 0.1, // 10% of the item must be visible to trigger
  };

  const fadeInObserver = new IntersectionObserver(
    (entries, observerInstance) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible"); // Add class to trigger CSS transition
          observerInstance.unobserve(entry.target); // Stop observing once it's visible
        }
      });
    },
    observerOptions
  );

  sectionsToFadeIn.forEach((section) => {
    fadeInObserver.observe(section);
  });

  // Smooth scroll for all top-level anchor links (for desktop and initial links)
  // This ensures that links in the header also smooth scroll.
  // The mobile links get this behavior from the cloning logic above.
  document
    .querySelectorAll('header a[href^="#"], #desktop-nav-links a[href^="#"]')
    .forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        const href = this.getAttribute("href");
        if (href && href.startsWith("#")) {
          // HTML has scroll-smooth, so default behavior should be smooth.
          // e.preventDefault(); // Only if overriding default behavior
          const targetElement = document.querySelector(href);
          if (targetElement) {
            // targetElement.scrollIntoView({ behavior: 'smooth' }); // Redundant if scroll-smooth on html works
          }
        }
      });
    });
});
