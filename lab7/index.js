let beta = 0;
let gamma = 0;
let holeIndex = 0;
let holes = [];
let startTime = Date.now();
let score = 0;

window.addEventListener('deviceorientation', onDeviceMove);
window.addEventListener('DOMContentLoaded', init);

function init() {
    createHoles(5);
    positionBall();
    requestAnimationFrame(animate);
}

function onDeviceMove(event) {
    beta = event.beta - 90;
    gamma = event.gamma;
}

function createHoles(numberOfHoles) {
    const board = document.querySelector('#board');
    for (let i = 0; i < numberOfHoles; i++) {
        let hole = document.createElement('div');
        let number = document.createElement('span');

        hole.className = 'hole';
        number.className = 'number';
        number.textContent = i + 1;

        hole.appendChild(number);
        board.appendChild(hole);
        positionHole(hole);
        holes.push(hole);
    }
}

function positionBall() {
    const boardRect = document.querySelector('#board').getBoundingClientRect();
    document.querySelector('#ball').style.left = `${boardRect.width / 2 - 10}px`;
    document.querySelector('#ball').style.top = `${boardRect.height / 2 - 10}px`;
}

function positionHole(hole) {
    const boardRect = document.querySelector('#board').getBoundingClientRect();
    hole.style.left = `${Math.random() * (boardRect.width - hole.offsetWidth)}px`;
    hole.style.top = `${Math.random() * (boardRect.height - hole.offsetHeight)}px`;
}

function animate() {
    moveBall();
    checkCollision();
    updateTime();
    requestAnimationFrame(animate);
}

function moveBall() {
    const ball = document.querySelector('#ball');
    const boardRect = document.querySelector('#board').getBoundingClientRect();
    const maxAngle = 45;
    const radius = Math.min(boardRect.width, boardRect.height) / 2;
    const x = Math.min(Math.max(0, (gamma / maxAngle) * radius + boardRect.width / 2), boardRect.width - ball.offsetWidth);
    const y = Math.min(Math.max(0, (beta / maxAngle) * radius + boardRect.height / 2), boardRect.height - ball.offsetHeight);
    ball.style.left = `${x}px`;
    ball.style.top = `${y}px`;
}

function checkCollision() {
    const ballRect = document.querySelector('#ball').getBoundingClientRect();
    const holeRect = holes[holeIndex].getBoundingClientRect();
    const distance = Math.sqrt(Math.pow((ballRect.x + ballRect.width / 2) - (holeRect.x + holeRect.width / 2), 2) + Math.pow((ballRect.y + ballRect.height / 2) - (holeRect.y + holeRect.height / 2), 2));

    if (distance < 15) {
        score++;
        document.querySelector('#score').textContent = `Score: ${score}`;
        holes[holeIndex].style.visibility = 'hidden';  
        holeIndex++;
        if (holeIndex >= holes.length) {
            let time = document.querySelector('#time').textContent;
            saveResult(time, score);
            alert(`You completed them all in: ${time}`);
            resetGame();
        }
    }
}

function updateTime() {
    const now = Date.now();
    const elapsed = now - startTime;
    const minutes = Math.floor(elapsed / 60000);
    const seconds = Math.floor((elapsed % 60000) / 1000);
    const centiseconds = Math.floor((elapsed % 1000) / 10);
    document.querySelector('#time').textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`;
}

function saveResult(time, score) {
    const results = JSON.parse(localStorage.getItem('results') || '[]');
    results.push({ time, score });
    localStorage.setItem('results', JSON.stringify(results));
    displayResults();
}

function displayResults() {
    const resultsTableBody = document.querySelector('#resultsTable').querySelector('tbody');
    resultsTableBody.innerHTML = '';
    const results = JSON.parse(localStorage.getItem('results') || '[]');
    results.forEach(result => {
        const row = document.createElement('tr');
        const timeCell = document.createElement('td');
        const scoreCell = document.createElement('td');
        timeCell.textContent = result.time;
        scoreCell.textContent = result.score;
        row.appendChild(timeCell);
        row.appendChild(scoreCell);
        resultsTableBody.appendChild(row);
    });
}

function resetGame() {
    holeIndex = 0;
    score = 0;
    holes.forEach(hole => hole.style.visibility = 'visible');
    positionBall();
    startTime = Date.now();
}

window.addEventListener('DOMContentLoaded', displayResults);
