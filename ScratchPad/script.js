const canvas = document.getElementById('drawing-canvas');
const ctx = canvas.getContext('2d');
const calculatorWindow = document.getElementById('calculator-window');
const undoStack = [];
const redoStack = [];
let isDrawing = false;
let mode = 'draw'; // Default mode is 'draw'
let currentPath = [];

// Calculator drag functionality
let offsetX, offsetY;
let isDragging = false;

calculatorWindow.addEventListener('mousedown', (e) => {
    offsetX = e.clientX - calculatorWindow.offsetLeft;
    offsetY = e.clientY - calculatorWindow.offsetTop;
    isDragging = true;
});

window.addEventListener('mousemove', (e) => {
    if (isDragging) {
        calculatorWindow.style.left = `${e.clientX - offsetX}px`;
        calculatorWindow.style.top = `${e.clientY - offsetY}px`;
    }
});

window.addEventListener('mouseup', () => {
    isDragging = false;
});

// Resize canvas to fill the screen
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight - 40;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Event listeners for buttons
document.getElementById('draw-button').addEventListener('click', () => setMode('draw'));
document.getElementById('erase-button').addEventListener('click', () => setMode('erase'));
document.getElementById('type-button').addEventListener('click', () => setMode('type'));
document.getElementById('clear-button').addEventListener('click', clearCanvas);
document.getElementById('undo-button').addEventListener('click', undo);
document.getElementById('redo-button').addEventListener('click', redo);
document.getElementById('calculator-button').addEventListener('click', toggleCalculator);
document.getElementById('close-calculator').addEventListener('click', toggleCalculator);

// Toggle calculator visibility
function toggleCalculator() {
    if (calculatorWindow.style.display === 'none') {
        calculatorWindow.style.display = 'block';
    } else {
        calculatorWindow.style.display = 'none';
    }
}

// Set the drawing mode (draw, erase, type)
function setMode(newMode) {
    mode = newMode;
    updateActiveButton();
}

// Update active button UI
function updateActiveButton() {
    document.querySelectorAll('.menu-button').forEach(button => button.classList.remove('active'));
    document.getElementById(`${mode}-button`).classList.add('active');
}

// Drawing and erasing logic
canvas.addEventListener('mousedown', (e) => {
    if (mode === 'draw' || mode === 'erase') {
        isDrawing = true;
        currentPath = [];
        undoStack.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
        ctx.beginPath();
        ctx.moveTo(e.offsetX, e.offsetY);
    }
});

canvas.addEventListener('mousemove', (e) => {
    if (isDrawing && (mode === 'draw' || mode === 'erase')) {
        if (mode === 'erase') {
            ctx.globalCompositeOperation = 'destination-out';
            ctx.lineWidth = 30;
        } else {
            ctx.globalCompositeOperation = 'source-over';
            ctx.lineWidth = 2;
        }
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
        currentPath.push({ x: e.offsetX, y: e.offsetY });
    }
});

canvas.addEventListener('mouseup', () => {
    if (isDrawing) {
        isDrawing = false;
        ctx.closePath();
    }
});

// Typing logic with equation solver
canvas.addEventListener('click', (e) => {
    if (mode === 'type') {
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'textbox';
        input.style.left = `${e.pageX}px`;
        input.style.top = `${e.pageY}px`;
        input.style.width = '100px'; // Initial width, will adjust as typing occurs
        document.body.appendChild(input);

        input.addEventListener('input', (event) => {
            const value = event.target.value;

            // Adjust input size to wrap text and stay visible
            input.style.width = `${ctx.measureText(value).width + 20}px`;

            // Real-time equation solving
            if (value.includes('=')) {
                try {
                    const equation = value.split('=')[0]; // Take everything before "="
                    const result = eval(equation);
                    event.target.value = `${equation}=${result}`;
                    input.style.width = `${ctx.measureText(event.target.value).width + 20}px`;
                } catch (err) {
                    // Invalid math expression, do nothing
                }
            }
        });

        input.addEventListener('blur', () => {
            if (input.value) {
                ctx.font = '20px sans-serif';
                ctx.fillText(input.value, e.offsetX, e.offsetY + 20);
                document.body.removeChild(input);
            }
        });

        input.focus();
    }
});

// Clear all button functionality
function clearCanvas() {
    undoStack.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Undo and redo functionality
function undo() {
    if (undoStack.length > 0) {
        const lastAction = undoStack.pop();
        redoStack.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
        ctx.putImageData(lastAction, 0, 0);
    }
}

function redo() {
    if (redoStack.length > 0) {
        const lastRedo = redoStack.pop();
        undoStack.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
        ctx.putImageData(lastRedo, 0, 0);
    }
}