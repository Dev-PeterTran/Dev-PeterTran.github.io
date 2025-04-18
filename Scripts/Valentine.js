const canvas = document.getElementById('valentineCanvas');
const canvasContent = canvas.getContext('2d');

//#region Object classes

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

	disabled = false;
	
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
	
	draw(canvasContent) {
		if (this.disabled && !hoverColorNoButton) {
			canvasContent.fillStyle = '#999999';
			this.textElement.color = '#666666';
		} else {
			canvasContent.fillStyle = this.fillColor;
			this.textElement.color = '#ffffff'; // Reset in case it was dimmed before
		}

		this.#drawRoundedRect(canvasContent);
		canvasContent.fill();
		this.textElement.draw(canvasContent);
	}
	
	onClick = null;

	contains(mouseX, mouseY) {
		if (this.disabled) return false; // Don't respond to clicks

		return (
			mouseX >= this.x &&
			mouseX <= this.x + this.width &&
			mouseY >= this.y &&
			mouseY <= this.y + this.height
		);
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
		this.noButton.draw(canvasContent);
		this.yesButton.draw(canvasContent);
		this.questionText.draw(canvasContent);
	}
}
//#endregion

//#region Object creations

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
//#endregion

// Button click alerts
yesButton.onClick = () => {
	alert("Yay! 💖");
};
noButton.onClick = () => {
	if (growYes) {
		noClickCount++;
	}

	// Calculate new size
	const newWidth = 125 + noClickCount * 15;
	const newHeight = 70 + noClickCount * 8;

	prompt.yesButton.setSize(newWidth, newHeight);
};

// Function to resize the canvas
function resizeCanvas() {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	
	prompt.setCenterPosition(canvas.width / 2, canvas.height / 2);
}

// Variables for coaxing functions
let selectedCoax = 0;
let fakeNoButton = false;
let hoverColorNoButton = false;
let noButtonHovered = false;
let noClickCount = 0;
let growYes = false;
let mouseX = 0;
let mouseY = 0;
let moving = false;

function init() {
	selectedCoax = Math.floor(Math.random() * 101);
	if (selectedCoax >= 25 && selectedCoax < 50) {
		growYes = true;
	}
	else if (selectedCoax >= 50 && selectedCoax < 75) {
		fakeNoButton = true;
	}
	else {
		hoverColorNoButton = true;
		noButton.disabled = true;
		noButton.fillColor = '#999999';
	}
	update();
}


function update() {
	canvasContent.clearRect(0, 0, canvas.width, canvas.height);

	if (selectedCoax < 25) {
		moving = true;

		const noBtn = prompt.noButton;
		const centerX = noBtn.x + noBtn.width / 2;
		const centerY = noBtn.y + noBtn.height / 2;

		const dx = centerX - mouseX;
		const dy = centerY - mouseY;
		const distance = Math.sqrt(dx * dx + dy * dy);

		// If the cursor is within 120px of the center, move it away
		if (distance < 300) {
			const moveSpeed = 90;
			const moveX = (dx / distance) * moveSpeed;
			const moveY = (dy / distance) * moveSpeed;

			const targetX = noBtn.x + moveX;
			const targetY = noBtn.y + moveY;

			// Keep it within canvas bounds
			const clampedX = Math.min(canvas.width - noBtn.width, Math.max(0, targetX));
			const clampedY = Math.min(canvas.height - noBtn.height, Math.max(0, targetY));

			// Smooth interpolation (lerp)
			noBtn.x = noBtn.x + (clampedX - noBtn.x) * 0.2;
			noBtn.y = noBtn.y + (clampedY - noBtn.y) * 0.2;

			noBtn.updateTextPosition();
		}
	}

	prompt.draw(canvasContent);
	
	requestAnimationFrame(update);
}

//#region Window and Event Listeners

// Resize canvas when window changes
window.addEventListener('resize', resizeCanvas);

// Button interaction
canvas.addEventListener('click', (event) => {
	const rect = canvas.getBoundingClientRect();
	mouseX = event.clientX - rect.left;
	mouseY = event.clientY - rect.top;

	// Check each button
	if (prompt.yesButton.contains(mouseX, mouseY) && prompt.yesButton.onClick) {
		prompt.yesButton.onClick();
	}
	if (prompt.noButton.contains(mouseX, mouseY)) {
		if (fakeNoButton && prompt.yesButton.onClick) {
			prompt.yesButton.onClick(); // Treat as "Yes"
		} else if (prompt.noButton.onClick) {
			prompt.noButton.onClick(); // Real "No"
		}
	}
});

canvas.addEventListener('mousemove', (event) => {
	const rect = canvas.getBoundingClientRect();
	mouseX = event.clientX - rect.left;
	mouseY = event.clientY - rect.top;

	const isHoveringNo = prompt.noButton.contains(mouseX, mouseY);
	const isHoveringYes = prompt.yesButton.contains(mouseX, mouseY);

	// Coax mode 3 – changes No to Yes on hover
	if (fakeNoButton) {
		if (isHoveringNo && !noButtonHovered) {
			noButtonHovered = true;
			prompt.noButton.textElement.content = "Yes";
			prompt.noButton.fillColor = '#009900';
		} else if (!isHoveringNo && noButtonHovered) {
			noButtonHovered = false;
			prompt.noButton.textElement.content = "No";
			prompt.noButton.fillColor = '#cc0000';
		}
		// Hover effect for Yes button
		if (isHoveringYes) {
			prompt.yesButton.fillColor = '#009900';
		} else {
			prompt.yesButton.fillColor = '#00cc00';
		}
	}
	else {
		// Hover effect for Yes button
		if (isHoveringYes) {
			prompt.yesButton.fillColor = '#009900';
		} else {
			prompt.yesButton.fillColor = '#00cc00';
		}

		// Hover effect for No button
		if (isHoveringNo) {
			prompt.noButton.fillColor = '#990000';
		} else {
			prompt.noButton.fillColor = '#cc0000';
		}
	}

	// Coax mode 4 – hover color even when disabled
	if (hoverColorNoButton && moving) {
		if (isHoveringNo && !noButtonHovered) {
			noButtonHovered = true;
			prompt.noButton.fillColor = '#ffaaaa';
		} else if (!isHoveringNo && noButtonHovered) {
			noButtonHovered = false;
			prompt.noButton.fillColor = '#999999';
		}
	}

	

	// Change cursor
	canvas.style.cursor = isHoveringYes || isHoveringNo ? 'pointer' : 'default';
});
//#endregion

resizeCanvas();
init();