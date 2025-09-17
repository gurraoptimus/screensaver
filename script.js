class AppleScreensaver {
    constructor() {
        this.container = document.querySelector('.screensaver-container');
        this.floatingLogosContainer = document.querySelector('.floating-logos');
        this.particlesContainer = document.querySelector('.particles');
        this.isActive = true;
        this.mouseTimeout = null;
        
        this.init();
    }
    
    init() {
        this.createFloatingLogos();
        this.createParticles();
        this.setupMouseHandler();
        this.setupKeyboardHandler();
        this.startScreensaver();
    }
    
    createFloatingLogos() {
        const logoSVG = `
            <svg width="30" height="30" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <path d="M85.5 45.5c-.5-5.5-4.5-10.5-10-12.5 2-3.5 2-8-0.5-11.5-3-4-8.5-5-13-3-2.5 1-4.5 2.5-6 4.5-1.5-2-3.5-3.5-6-4.5-4.5-2-10 -1-13 3-2.5 3.5-2.5 8-0.5 11.5-5.5 2-9.5 7-10 12.5-0.5 8 3 15.5 9 20.5 3 2.5 7 4 11 4 2.5 0 5-0.5 7-1.5 2 1 4.5 1.5 7 1.5 4 0 8-1.5 11-4 6-5 9.5-12.5 9-20.5z" fill="white"/>
                <path d="M65 15c1.5-2 2.5-4.5 2-7-2.5 0.5-5.5 2-7 4-1.5 2-2.5 4.5-2 7 2.5 0 5.5-2 7-4z" fill="white"/>
            </svg>
        `;
        
        // Create 8 floating logos
        for (let i = 0; i < 8; i++) {
            const logo = document.createElement('div');
            logo.className = 'floating-logo';
            logo.innerHTML = logoSVG;
            
            // Random starting position
            logo.style.left = Math.random() * 100 + '%';
            logo.style.animationDelay = Math.random() * 20 + 's';
            logo.style.animationDuration = (15 + Math.random() * 10) + 's';
            
            this.floatingLogosContainer.appendChild(logo);
        }
    }
    
    createParticles() {
        // Create 50 particles
        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            // Random starting position
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 25 + 's';
            particle.style.animationDuration = (20 + Math.random() * 10) + 's';
            
            // Random particle size
            const size = Math.random() * 3 + 1;
            particle.style.width = size + 'px';
            particle.style.height = size + 'px';
            
            this.particlesContainer.appendChild(particle);
        }
    }
    
    setupMouseHandler() {
        let mouseTimeout;
        
        const hideMouseCursor = () => {
            this.container.classList.add('hide-cursor');
        };
        
        const showMouseCursor = () => {
            this.container.classList.remove('hide-cursor');
            clearTimeout(mouseTimeout);
            mouseTimeout = setTimeout(hideMouseCursor, 3000);
        };
        
        document.addEventListener('mousemove', showMouseCursor);
        document.addEventListener('mousedown', this.exitScreensaver.bind(this));
        
        // Initially hide cursor after 3 seconds
        mouseTimeout = setTimeout(hideMouseCursor, 3000);
    }
    
    setupKeyboardHandler() {
        document.addEventListener('keydown', this.exitScreensaver.bind(this));
    }
    
    exitScreensaver() {
        if (this.isActive) {
            this.isActive = false;
            this.showExitMessage();
        }
    }
    
    showExitMessage() {
        const message = document.createElement('div');
        message.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 20px 40px;
            border-radius: 10px;
            font-size: 18px;
            z-index: 1000;
            text-align: center;
            backdrop-filter: blur(10px);
        `;
        message.innerHTML = `
            <div>Apple Screensaver Deactivated</div>
            <div style="font-size: 14px; margin-top: 10px; opacity: 0.7;">
                Click anywhere or press any key to restart
            </div>
        `;
        
        document.body.appendChild(message);
        
        // Pause all animations
        this.container.style.animationPlayState = 'paused';
        const animatedElements = this.container.querySelectorAll('.floating-logo, .particle, .apple-logo');
        animatedElements.forEach(el => {
            el.style.animationPlayState = 'paused';
        });
        
        // Setup restart functionality
        const restart = () => {
            document.body.removeChild(message);
            this.isActive = true;
            this.container.style.animationPlayState = 'running';
            animatedElements.forEach(el => {
                el.style.animationPlayState = 'running';
            });
        };
        
        message.addEventListener('click', restart);
        document.addEventListener('keydown', restart, { once: true });
    }
    
    startScreensaver() {
        // Add some dynamic color changes
        setInterval(() => {
            if (this.isActive) {
                this.changeColors();
            }
        }, 30000); // Change colors every 30 seconds
    }
    
    changeColors() {
        const colors = [
            'linear-gradient(45deg, #000428, #004e92, #000428)',
            'linear-gradient(45deg, #2C1810, #8B4513, #2C1810)',
            'linear-gradient(45deg, #0F0F23, #1E3A8A, #0F0F23)',
            'linear-gradient(45deg, #1A1A2E, #16213E, #1A1A2E)',
            'linear-gradient(45deg, #0D0221, #2D1B69, #0D0221)'
        ];
        
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        this.container.style.background = randomColor;
    }
}

// Initialize the screensaver when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new AppleScreensaver();
});

// Prevent context menu
document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
});

// Enter fullscreen on double-click
document.addEventListener('dblclick', () => {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
            console.log('Fullscreen not supported');
        });
    }
});