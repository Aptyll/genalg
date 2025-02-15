// Cache the game element once at the start
const gameElement = document.getElementById('game');
const gridSize = 10;
const cellSize = 30; // Size of each cell

let grid = Array(gridSize).fill().map(() => Array(gridSize).fill(0));
let kingPosition = { x: 0, y: 0 };
let turnCount = 1; // Start from turn 1
let isDragging = false; // To track dragging state
let dragStart = { x: 0, y: 0 }; // Starting mouse position for dragging
let gridOffset = { x: 0, y: 0 }; // Current offset for the grid

document.addEventListener('dragstart', (event) => {
    event.preventDefault();
});

// Zoom variables
let zoomFactor = 1;           // 100% scale
const zoomStep = 0.1;         // Increment for zooming
const minZoom = 0.5;          // Minimum zoom (50%)
const maxZoom = 2;            // Maximum zoom (200%)

// Function to update the transform (translation + zoom)
function updateTransform() {
    gameElement.style.transform = `translate(${gridOffset.x}px, ${gridOffset.y}px) scale(${zoomFactor})`;
}

function createGrid() {
    gameElement.style.width = `${gridSize * cellSize}px`;
    gameElement.style.height = `${gridSize * cellSize}px`;
    gameElement.style.gridTemplateColumns = `repeat(${gridSize}, ${cellSize}px)`;
    gameElement.style.gridTemplateRows = `repeat(${gridSize}, ${cellSize}px)`;

    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            const cell = document.createElement('div');
            cell.style.width = `${cellSize}px`;
            cell.style.height = `${cellSize}px`;
            cell.dataset.row = i;
            cell.dataset.col = j;
            cell.id = `cell-${i}-${j}`;

            // Add the king's image at the initial position
            if (i === kingPosition.y && j === kingPosition.x) {
                const img = document.createElement('img');
                img.src = 'generalsiologo.png';
                img.alt = 'King/General';
                img.style.maxWidth = '80%';
                img.style.maxHeight = '80%';
                img.style.objectFit = 'contain';
                cell.appendChild(img);
            }

            gameElement.appendChild(cell);
        }
    }
}

function updateKingPosition() {
    document.querySelectorAll('#game div').forEach(cell => {
        cell.innerHTML = ''; // Clear previous images
    });

    const kingCell = document.getElementById(`cell-${kingPosition.y}-${kingPosition.x}`);
    const img = document.createElement('img');
    img.src = 'generalsiologo.png';
    img.alt = 'King/General';
    img.style.maxWidth = '80%';
    img.style.maxHeight = '80%';
    img.style.objectFit = 'contain';
    kingCell.appendChild(img);
    
    updateTurnCount();
}

function updateTurnCount() {
    let turnDisplay = document.getElementById('turnDisplay');
    if (!turnDisplay) {
        turnDisplay = document.createElement('div');
        turnDisplay.id = 'turnDisplay';
        document.body.appendChild(turnDisplay);
    }
    turnDisplay.textContent = `Turn: ${turnCount}`;
}

function moveKing(direction) {
    let newX = kingPosition.x;
    let newY = kingPosition.y;

    switch (direction) {
        case 'up':
            newY = Math.max(kingPosition.y - 1, 0);
            break;
        case 'down':
            newY = Math.min(kingPosition.y + 1, gridSize - 1);
            break;
        case 'left':
            newX = Math.max(kingPosition.x - 1, 0);
            break;
        case 'right':
            newX = Math.min(kingPosition.x + 1, gridSize - 1);
            break;
    }

    kingPosition = { x: newX, y: newY };
    turnCount++;
    updateKingPosition();
}

document.addEventListener('keydown', (event) => {
    switch (event.key.toLowerCase()) {
        case 'w':
            moveKing('up');
            break;
        case 's':
            moveKing('down');
            break;
        case 'a':
            moveKing('left');
            break;
        case 'd':
            moveKing('right');
            break;
    }
});

// Dragging functionality
document.addEventListener('mousedown', (event) => {
    isDragging = true;
    dragStart.x = event.clientX;
    dragStart.y = event.clientY;
    document.body.style.cursor = 'grabbing';
});

document.addEventListener('mousemove', (event) => {
    if (!isDragging) return;

    const deltaX = event.clientX - dragStart.x;
    const deltaY = event.clientY - dragStart.y;

    gridOffset.x += deltaX;
    gridOffset.y += deltaY;

    updateTransform();

    dragStart.x = event.clientX;
    dragStart.y = event.clientY;
});

document.addEventListener('mouseup', () => {
    isDragging = false;
    document.body.style.cursor = 'grab';
});

// Zoom functionality
document.addEventListener('wheel', (event) => {
    event.preventDefault();

    if (event.deltaY < 0) {
        // Zoom in
        zoomFactor += zoomStep;
    } else {
        // Zoom out
        zoomFactor -= zoomStep;
    }

    // Clamp zoomFactor between minZoom and maxZoom
    zoomFactor = Math.max(minZoom, Math.min(maxZoom, zoomFactor));

    updateTransform();
});

createGrid();
updateKingPosition();
updateTransform();
