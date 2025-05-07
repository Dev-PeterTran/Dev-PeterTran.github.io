// Toggles the visibility of the mobile navigation menu
function ToggleMenu() {
	const navItems = document.getElementById('NavItems');
	navItems.classList.toggle('active');
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

// Returns to the previous page
function GoBack() {
	// Check if there is history to go back to
	if (document.referrer && window.history.length > 1) {
		window.history.back();
	} else {
		// Fallback if there's no history
		window.location.href = "../index.html#Projects";
	}
}

// Typing text effect beside my name
const roles = ["Game Developer", "Software Developer"];
let i = 0;
let j = 0;
let currentRole = "";
let isDeleting = false;
const typingElement = document.getElementById("TypingText");

function type() {
	if (i >= roles.length) i = 0;
	currentRole = roles[i];

	typingElement.innerHTML = currentRole.substring(0, j) + (j % 2 === 0 ? "|" : "");

	if (!isDeleting && j < currentRole.length) {
		j++;
		setTimeout(type, 150); // slower typing
	} else if (isDeleting && j > 0) {
		j--;
		setTimeout(type, 100); // slower deleting
	} else if (!isDeleting && j === currentRole.length) {
		isDeleting = true;
		setTimeout(type, 1500); // pause before delete
	} else if (isDeleting && j === 0) {
		isDeleting = false;
		i++;
		setTimeout(type, 500); // pause before next word
	}
}

type();