const menuButton = document.getElementById("mobile-menu-toggle");
const navLinksContainer = document.getElementById("mobile-nav-links"); // Target the container div

menuButton.addEventListener("click", () => {
  // Toggle 'hidden' and 'active' classes on the container
  navLinksContainer.classList.toggle("hidden");
  navLinksContainer.classList.toggle("active"); // Use 'active' for CSS targeting if needed
});

// Close menu when a link inside the container is clicked
navLinksContainer.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinksContainer.classList.add("hidden");
    navLinksContainer.classList.remove("active");
  });
});
