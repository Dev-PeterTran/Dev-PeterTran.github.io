const canvas = document.getElementById('valentineCanvas');
const canvasContent = canvas.getContext('2d');

class TextElement {
	constructor ({content, font, color, align = 'center', baseline = 'middle', x, y } = {}) {
		this.content = content;
		this.font = font;
		this.color = color;
		this.align = align;
		this.baseline = baseline;
		this.x = x;
		this.y = y;
	}
	
	draw (canvasContent) {
		canvasContent.fillStyle = this.color;
		canvasContent.font = this.font;
		canvasContent.textAlign = this.align;
		canvasContent.textBaseline = this.baseline;
		canvasContent.fillText(this.content, this.x, this.y);
	}
}

const questionText = new TextElement ({
	content: "Will you be my valentine?",
	font: '50px cursive',
	color: '#000000',
});

// Function to resize the canvas
function resizeCanvas() {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	
	questionText.x = canvas.width / 2;
	questionText.y = canvas.height / 2;
}

function init() {
	update();
}

function update() {
	canvasContent.clearRect(0, 0, canvas.width, canvas.height);

	questionText.draw(canvasContent);
	
	requestAnimationFrame(update);
}

// Resize canvas when window changes
window.addEventListener('resize', resizeCanvas);
resizeCanvas();
init();