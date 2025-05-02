function ToggleMenu() {
	const navItems = document.getElementById('NavItems');
	navItems.classList.toggle('active');
}

function ToggleDropdown(event) {
	event.preventDefault(); // Prevent default anchor behavior
	const dropdown = event.target.nextElementSibling;

	if (window.innerWidth <= 800 && dropdown) {
		dropdown.classList.toggle('active-dropdown');
	}
}
window.addEventListener('load', () => {
    const hash = window.location.hash;
    if (hash) {
        const target = document.querySelector(hash);
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    }
});

document.querySelectorAll('.NavItems a').forEach(link => {
    link.addEventListener('click', () => {
        if (window.innerWidth <= 800) {
            document.getElementById('NavItems').classList.remove('active');
        }
    });
});

const sections = document.querySelectorAll("div[id]");
const navLinks = document.querySelectorAll(".NavItems li a");

const observer = new IntersectionObserver(
    entries => {
        entries.forEach(entry => {
            const id = entry.target.getAttribute("id");
            const navLink = document.querySelector(`.NavItems li a[href="#${id}"]`);
            if (navLink) {
                if (entry.isIntersecting) {
                    navLinks.forEach(link => link.classList.remove("active"));
                    navLink.classList.add("active");
                }
            }
        });
    },
    {
        threshold: 0.6,
    }
);

sections.forEach(section => {
    observer.observe(section);
});