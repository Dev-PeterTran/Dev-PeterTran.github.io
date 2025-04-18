const canvas = document.getElementById('valentineCanvas');
const canvasContent = canvas.getContext('2d');

// Generic text object
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

// Generic button object
class ButtonElement {
	x = 0;
	y = 0;
	width = 100;
	height = 50;
	radius = 10;
	fillColor;
	textElement;
	
	// Text element in button
	constructor (text, textFont, fillColor, textColor, radius = 10) {
		this.fillColor = fillColor;
		this.radius = radius;
		
		this.textElement = new TextElement({
			content: text,
			font: textFont,
			color: textColor,
			align: 'center',
			baseline: 'middle',
			x: this.x + this.width / 2,
			y: this.y + this.height / 2
		});
	}
	
	// Drawing rounded corners on button
	#drawRoundedRect(canvasContent) {
		const r = this.radius;
		const x = this.x;
		const y = this.y;
		const w = this.width;
		const h = this.height;

		canvasContent.beginPath();
		canvasContent.moveTo(x + r, y);
		canvasContent.lineTo(x + w - r, y);
		canvasContent.quadraticCurveTo(x + w, y, x + w, y + r);
		canvasContent.lineTo(x + w, y + h - r);
		canvasContent.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
		canvasContent.lineTo(x + r, y + h);
		canvasContent.quadraticCurveTo(x, y + h, x, y + h - r);
		canvasContent.lineTo(x, y + r);
		canvasContent.quadraticCurveTo(x, y, x + r, y);
		canvasContent.closePath();
	}
	
	setPosition(x, y) {
		this.x = x;
		this.y = y;
		this.updateTextPosition();
	}
	
	setSize(width, height) {
		this.width = width;
		this.height = height;
		this.updateTextPosition();
	}
	
	updateTextPosition() {
		const fontSizeMatch = this.textElement.font.match(/(\d+)px/);
		const fontSize = fontSizeMatch ? parseInt(fontSizeMatch[1]) : 16;
		const fudgeFactor = 0.4; // You can tweak this value

		this.textElement.x = this.x + this.width / 2;
		this.textElement.y = this.y + (this.height / 2) + (fontSize / 2 - fontSize * fudgeFactor);
	}
	
	draw (canvasContent) {
		// Draw button background
		canvasContent.fillStyle = this.fillColor;
		this.#drawRoundedRect(canvasContent);
		canvasContent.fill();

		// Draw the text using TextElement
		this.textElement.draw(canvasContent);
	}
}

// Main prompt object
class PromptElement {
	constructor(questionText, yesButton, noButton) {
		this.questionText = questionText;
		this.yesButton = yesButton;
		this.noButton = noButton;
		this.width = 0;
		this.height = 0;
	}
	
	// Position the whole group centered on (centerX, centerY)
	setCenterPosition(centerX, centerY) {
		// Layout spacing
		const buttonSpacing = 160; // More space between buttons
		const verticalSpacing = 30; // Space between question and buttons
		
		const buttonWidth = 125;
		const buttonHeight = 70;

		// Estimate total height (question + spacing + buttons)
		const fontSizeMatch = this.questionText.font.match(/(\d+)px/);
		const questionHeight = fontSizeMatch ? parseInt(fontSizeMatch[1]) : 50;

		this.width = buttonWidth * 2 + buttonSpacing;
		this.height = questionHeight + verticalSpacing + buttonHeight;

		// Top-left anchor
		const x = centerX - this.width / 2;
		const y = centerY - this.height / 2;

		// Position question
		this.questionText.x = centerX;
		this.questionText.y = y + questionHeight / 2;

		// Position buttons
		this.yesButton.setSize(buttonWidth, buttonHeight);
		this.noButton.setSize(buttonWidth, buttonHeight);

		const buttonY = y + questionHeight + verticalSpacing;
		this.yesButton.setPosition(x, buttonY); // left button
		this.noButton.setPosition(x + buttonWidth + buttonSpacing, buttonY); // right button
	}

	draw(canvasContent) {
		this.questionText.draw(canvasContent);
		this.yesButton.draw(canvasContent);
		this.noButton.draw(canvasContent);
	}
}

// Main question
const questionText = new TextElement ({
	content: "Will you be my valentine?",
	font: '60px cursive',
	color: '#000000',
});

// No button
const noButton = new ButtonElement("No", '40px cursive', '#cc0000', '#ffffff');
// Yes button
const yesButton = new ButtonElement("Yes", '40px cursive', '#00cc00', '#ffffff');

// Main prompt
const prompt = new PromptElement(questionText, yesButton, noButton);

// Function to resize the canvas
function resizeCanvas() {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	
	prompt.setCenterPosition(canvas.width / 2, canvas.height / 2);
}

function init() {
	update();
}

function update() {
	canvasContent.clearRect(0, 0, canvas.width, canvas.height);

	prompt.draw(canvasContent);
	
	requestAnimationFrame(update);
}

// Resize canvas when window changes
window.addEventListener('resize', resizeCanvas);
resizeCanvas();
init();