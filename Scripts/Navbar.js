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