const canvas = document.getElementById('valentineCanvas');
const ctx = canvas.getContext('2d');

// Function to resize the canvas
function resizeCanvas() {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
}

// Resize canvas when window changes
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Draw everything in the canvas
function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
  
	// Keep animating
	requestAnimationFrame(draw);
}

draw();