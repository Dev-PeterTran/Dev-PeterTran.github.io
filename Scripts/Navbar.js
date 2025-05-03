// Toggles the visibility of the mobile navigation menu
function ToggleMenu() {
	const navItems = document.getElementById('NavItems');
	navItems.classList.toggle('active');
}

// Toggles the dropdown submenu in mobile view when the "Projects" item is clicked
function ToggleDropdown(event) {
	event.preventDefault(); // Prevents default anchor link behavior
	const dropdown = event.target.nextElementSibling;

	// Only toggle dropdown in mobile view (≤800px width)
	if (window.innerWidth <= 800 && dropdown) {
		dropdown.classList.toggle('active-dropdown');
	}
}

// Smoothly scrolls to a section on page load if a hash is present in the URL (e.g., #About)
window.addEventListener('load', () => {
	const hash = window.location.hash;
	if (hash) {
		const target = document.querySelector(hash);
		if (target) {
			target.scrollIntoView({ behavior: 'smooth' });
		}
	}
});

// Closes the mobile menu after a user clicks any navigation link
document.querySelectorAll('.NavItems a').forEach(link => {
	link.addEventListener('click', () => {
		if (window.innerWidth <= 800) {
			document.getElementById('NavItems').classList.remove('active');
		}
	});
});

// Selects all page sections and navigation links for intersection observation
const sections = document.querySelectorAll("div[id]");
const navLinks = document.querySelectorAll(".NavItems li a");

// Sets up an IntersectionObserver to highlight the nav link of the section currently in view
const observer = new IntersectionObserver(
	entries => {
		entries.forEach(entry => {
			const id = entry.target.getAttribute("id");
			const navLink = document.querySelector(`.NavItems li a[href="#${id}"]`);
			if (navLink) {
				if (entry.isIntersecting) {
					// Remove "active" class from all links, then highlight the current one
					navLinks.forEach(link => link.classList.remove("active"));
					navLink.classList.add("active");
				}
			}
		});
	},
	{
		threshold: 0.6, // Section must be 60% visible to trigger
	}
);

// Start observing each section to detect when it enters the viewport
sections.forEach(section => {
	observer.observe(section);
});