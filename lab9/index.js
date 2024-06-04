document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('animationCanvas');
    const ctx = canvas.getContext('2d');

    const numBallsInput = document.getElementById('numBalls');
    const distanceInput = document.getElementById('distance');
    const forceInput = document.getElementById('force');
    const startButton = document.getElementById('startButton');
    const resetButton = document.getElementById('resetButton');

    let balls = [];
    let animationId;
    let mouseX = 0;
    let mouseY = 0;
    let isRunning = false;

    class Ball {
        constructor(x, y, dx, dy, radius) {
            this.x = x;
            this.y = y;
            this.dx = dx;
            this.dy = dy;
            this.radius = radius;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = 'blue';
            ctx.fill();
            ctx.closePath();
        }

        update() {
            if (this.x + this.dx > canvas.width - this.radius || this.x + this.dx < this.radius) {
                this.dx = -this.dx;
            }
            if (this.y + this.dy > canvas.height - this.radius || this.y + this.dy < this.radius) {
                this.dy = -this.dy;
            }

            const distanceToMouse = Math.hypot(this.x - mouseX, this.y - mouseY);
            const force = parseFloat(forceInput.value);
            if (distanceToMouse < parseInt(distanceInput.value)) {
                const angle = Math.atan2(this.y - mouseY, this.x - mouseX);
                const attractionForce = force / (distanceToMouse / 10);
                this.dx += Math.cos(angle) * attractionForce;
                this.dy += Math.sin(angle) * attractionForce;
            }

            this.x += this.dx;
            this.y += this.dy;
        }

        isClicked(x, y) {
            return Math.hypot(this.x - x, this.y - y) < this.radius;
        }
    }

    function initBalls(numBalls) {
        balls = [];
        for (let i = 0; i < numBalls; i++) {
            addNewBall();
        }
    }

    function addNewBall() {
        const radius = 10;
        const x = Math.random() * (canvas.width - radius * 2) + radius;
        const y = Math.random() * (canvas.height - radius * 2) + radius;
        const dx = (Math.random() - 0.5) * 2;
        const dy = (Math.random() - 0.5) * 2;
        balls.push(new Ball(x, y, dx, dy, radius));
    }

    function drawLines() {
        const threshold = parseInt(distanceInput.value);
        for (let i = 0; i < balls.length; i++) {
            for (let j = i + 1; j < balls.length; j++) {
                const distance = Math.hypot(balls[i].x - balls[j].x, balls[i].y - balls[j].y);
                if (distance < threshold) {
                    ctx.beginPath();
                    ctx.moveTo(balls[i].x, balls[i].y);
                    ctx.lineTo(balls[j].x, balls[j].y);
                    ctx.strokeStyle = 'rgba(0, 0, 255, 0.1)';
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawLines();
        balls.forEach(ball => {
            ball.update();
            ball.draw();
        });
        animationId = requestAnimationFrame(animate);
    }

    function startAnimation() {
        if (isRunning) return;
        isRunning = true;
        const numBalls = parseInt(numBallsInput.value);
        initBalls(numBalls);
        animate();
    }

    function resetAnimation() {
        if (isRunning) {
            cancelAnimationFrame(animationId);
            isRunning = false;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }

    canvas.addEventListener('mousemove', (event) => {
        mouseX = event.offsetX;
        mouseY = event.offsetY;
    });

    canvas.addEventListener('click', (event) => {
        const clickX = event.offsetX;
        const clickY = event.offsetY;
        balls.forEach((ball, index) => {
            if (ball.isClicked(clickX, clickY)) {
                balls.splice(index, 1);
                addNewBall();
                addNewBall();
            }
        });
    });

    startButton.addEventListener('click', startAnimation);
    resetButton.addEventListener('click', resetAnimation);
});
