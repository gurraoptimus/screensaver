class ISOScreenSaver {
    constructor() {
        this.canvas = document.getElementById('screensaver-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.controls = document.getElementById('controls');
        this.modeSelect = document.getElementById('mode-select');
        this.startBtn = document.getElementById('start-btn');
        this.fullscreenBtn = document.getElementById('fullscreen-btn');
        this.colorPicker = document.getElementById('color-picker');
        this.exitHint = document.getElementById('exit-hint');
        
        this.isActive = false;
        this.animationId = null;
        this.currentMode = 'floating-shapes';
        this.primaryColor = '#00ff00';
        
        // Animation objects
        this.particles = [];
        this.matrixChars = [];
        this.balls = [];
        this.stars = [];
        
        this.init();
    }
    
    init() {
        this.setupCanvas();
        this.bindEvents();
        this.setupModes();
    }
    
    setupCanvas() {
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
    }
    
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    bindEvents() {
        this.startBtn.addEventListener('click', () => this.toggleScreensaver());
        this.fullscreenBtn.addEventListener('click', () => this.toggleFullscreen());
        this.modeSelect.addEventListener('change', (e) => {
            this.currentMode = e.target.value;
            if (this.isActive) {
                this.initCurrentMode();
            }
        });
        this.colorPicker.addEventListener('change', (e) => {
            this.primaryColor = e.target.value;
        });
        
        // Exit screensaver events
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isActive) {
                this.stopScreensaver();
            }
        });
        
        this.canvas.addEventListener('click', () => {
            if (this.isActive) {
                this.stopScreensaver();
            }
        });
        
        // Mouse movement detection
        let mouseTimeout;
        document.addEventListener('mousemove', () => {
            if (this.isActive) {
                this.exitHint.classList.add('visible');
                clearTimeout(mouseTimeout);
                mouseTimeout = setTimeout(() => {
                    this.exitHint.classList.remove('visible');
                }, 2000);
            }
        });
    }
    
    setupModes() {
        this.modes = {
            'floating-shapes': () => this.renderFloatingShapes(),
            'matrix-rain': () => this.renderMatrixRain(),
            'bouncing-balls': () => this.renderBouncingBalls(),
            'starfield': () => this.renderStarfield()
        };
    }
    
    toggleScreensaver() {
        if (this.isActive) {
            this.stopScreensaver();
        } else {
            this.startScreensaver();
        }
    }
    
    startScreensaver() {
        this.isActive = true;
        document.body.classList.add('screensaver-active');
        this.controls.classList.add('hidden');
        this.startBtn.textContent = 'Stop Screensaver';
        this.initCurrentMode();
        this.animate();
    }
    
    stopScreensaver() {
        this.isActive = false;
        document.body.classList.remove('screensaver-active');
        this.controls.classList.remove('hidden');
        this.exitHint.classList.remove('visible');
        this.startBtn.textContent = 'Start Screensaver';
        
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        
        this.clearCanvas();
    }
    
    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.log('Error attempting to enable fullscreen:', err);
            });
        } else {
            document.exitFullscreen();
        }
    }
    
    initCurrentMode() {
        this.clearCanvas();
        this.particles = [];
        this.matrixChars = [];
        this.balls = [];
        this.stars = [];
        
        switch (this.currentMode) {
            case 'floating-shapes':
                this.initFloatingShapes();
                break;
            case 'matrix-rain':
                this.initMatrixRain();
                break;
            case 'bouncing-balls':
                this.initBouncingBalls();
                break;
            case 'starfield':
                this.initStarfield();
                break;
        }
    }
    
    clearCanvas() {
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
    
    animate() {
        if (!this.isActive) return;
        
        this.clearCanvas();
        
        if (this.modes[this.currentMode]) {
            this.modes[this.currentMode]();
        }
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }
    
    // Floating Shapes Mode
    initFloatingShapes() {
        for (let i = 0; i < 20; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 30 + 10,
                speedX: (Math.random() - 0.5) * 2,
                speedY: (Math.random() - 0.5) * 2,
                rotation: 0,
                rotationSpeed: (Math.random() - 0.5) * 0.1
            });
        }
    }
    
    renderFloatingShapes() {
        this.particles.forEach(particle => {
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            particle.rotation += particle.rotationSpeed;
            
            // Bounce off edges
            if (particle.x < 0 || particle.x > this.canvas.width) particle.speedX *= -1;
            if (particle.y < 0 || particle.y > this.canvas.height) particle.speedY *= -1;
            
            // Draw particle
            this.ctx.save();
            this.ctx.translate(particle.x, particle.y);
            this.ctx.rotate(particle.rotation);
            this.ctx.fillStyle = this.primaryColor;
            this.ctx.shadowBlur = 20;
            this.ctx.shadowColor = this.primaryColor;
            this.ctx.fillRect(-particle.size/2, -particle.size/2, particle.size, particle.size);
            this.ctx.restore();
        });
    }
    
    // Matrix Rain Mode
    initMatrixRain() {
        const columns = Math.floor(this.canvas.width / 20);
        for (let i = 0; i < columns; i++) {
            this.matrixChars.push({
                x: i * 20,
                y: Math.random() * this.canvas.height,
                speed: Math.random() * 3 + 1,
                char: String.fromCharCode(0x30A0 + Math.random() * 96)
            });
        }
    }
    
    renderMatrixRain() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.matrixChars.forEach(char => {
            char.y += char.speed;
            
            if (char.y > this.canvas.height) {
                char.y = -20;
                char.char = String.fromCharCode(0x30A0 + Math.random() * 96);
            }
            
            this.ctx.fillStyle = this.primaryColor;
            this.ctx.font = '16px Courier New';
            this.ctx.shadowBlur = 10;
            this.ctx.shadowColor = this.primaryColor;
            this.ctx.fillText(char.char, char.x, char.y);
        });
    }
    
    // Bouncing Balls Mode
    initBouncingBalls() {
        for (let i = 0; i < 15; i++) {
            this.balls.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                radius: Math.random() * 20 + 10,
                speedX: (Math.random() - 0.5) * 8,
                speedY: (Math.random() - 0.5) * 8,
                color: this.getRandomColor()
            });
        }
    }
    
    renderBouncingBalls() {
        this.balls.forEach(ball => {
            ball.x += ball.speedX;
            ball.y += ball.speedY;
            
            // Bounce off edges
            if (ball.x - ball.radius < 0 || ball.x + ball.radius > this.canvas.width) {
                ball.speedX *= -1;
            }
            if (ball.y - ball.radius < 0 || ball.y + ball.radius > this.canvas.height) {
                ball.speedY *= -1;
            }
            
            // Draw ball
            this.ctx.beginPath();
            this.ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = ball.color;
            this.ctx.shadowBlur = 20;
            this.ctx.shadowColor = ball.color;
            this.ctx.fill();
        });
    }
    
    // Starfield Mode
    initStarfield() {
        for (let i = 0; i < 200; i++) {
            this.stars.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                z: Math.random() * 1000,
                speed: Math.random() * 2 + 1
            });
        }
    }
    
    renderStarfield() {
        this.stars.forEach(star => {
            star.z -= star.speed;
            
            if (star.z <= 0) {
                star.x = Math.random() * this.canvas.width;
                star.y = Math.random() * this.canvas.height;
                star.z = 1000;
            }
            
            const x = (star.x - this.canvas.width / 2) * (1000 / star.z) + this.canvas.width / 2;
            const y = (star.y - this.canvas.height / 2) * (1000 / star.z) + this.canvas.height / 2;
            const size = (1000 - star.z) / 1000 * 3;
            
            this.ctx.beginPath();
            this.ctx.arc(x, y, size, 0, Math.PI * 2);
            this.ctx.fillStyle = this.primaryColor;
            this.ctx.shadowBlur = size * 2;
            this.ctx.shadowColor = this.primaryColor;
            this.ctx.fill();
        });
    }
    
    getRandomColor() {
        const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
        return colors[Math.floor(Math.random() * colors.length)];
    }
}

// Initialize the screensaver when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new ISOScreenSaver();
});