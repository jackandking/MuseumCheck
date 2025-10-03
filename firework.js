/**
 * Fireworks Animation System
 * Standalone canvas-based fireworks animation
 */

class FireworksCanvasSystem {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.rockets = [];
        this.animationId = null;
        this.isRunning = false;
    }
    
    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.animate();
    }
    
    stop() {
        this.isRunning = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
    
    animate() {
        if (!this.isRunning) return;
        
        // Clear canvas with fade effect for trails
        this.ctx.fillStyle = 'rgba(10, 14, 39, 0.2)'; // Dark blue background with transparency
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Update and draw rockets
        for (let i = this.rockets.length - 1; i >= 0; i--) {
            const rocket = this.rockets[i];
            rocket.update();
            rocket.draw(this.ctx);
            
            // Check if rocket reached explosion point
            if (rocket.shouldExplode()) {
                this.createExplosion(rocket.x, rocket.y, rocket.color);
                this.rockets.splice(i, 1);
            }
        }
        
        // Update and draw particles
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            particle.update();
            particle.draw(this.ctx);
            
            // Remove dead particles
            if (particle.isDead()) {
                this.particles.splice(i, 1);
            }
        }
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }
    
    launchFirework(ageGroup, childNickname) {
        const x = Math.random() * this.canvas.width * 0.6 + this.canvas.width * 0.2; // Launch from middle 60%
        const targetY = Math.random() * this.canvas.height * 0.4 + this.canvas.height * 0.1; // Explode in top 40%
        const colors = this.getRandomFireworkColors();
        
        const rocket = new Rocket(x, this.canvas.height, targetY, colors[0], ageGroup, childNickname);
        this.rockets.push(rocket);
        
        // Sometimes launch multiple fireworks for more spectacle
        if (Math.random() > 0.6) {
            setTimeout(() => {
                const x2 = Math.random() * this.canvas.width * 0.6 + this.canvas.width * 0.2;
                const targetY2 = Math.random() * this.canvas.height * 0.4 + this.canvas.height * 0.1;
                const rocket2 = new Rocket(x2, this.canvas.height, targetY2, colors[1] || colors[0]);
                this.rockets.push(rocket2);
            }, 300 + Math.random() * 500);
        }
    }
    
    createExplosion(x, y, color) {
        const particleCount = 80 + Math.random() * 40; // 80-120 particles
        const angleStep = (Math.PI * 2) / particleCount;
        
        for (let i = 0; i < particleCount; i++) {
            const angle = angleStep * i + (Math.random() - 0.5) * 0.5;
            const speed = 2 + Math.random() * 4;
            const particle = new Particle(x, y, angle, speed, color);
            this.particles.push(particle);
        }
        
        // Add some extra sparkle particles
        for (let i = 0; i < 20; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 1 + Math.random() * 2;
            const sparkle = new Particle(x, y, angle, speed, '#FFFFFF', 0.5);
            this.particles.push(sparkle);
        }
    }
    
    getRandomFireworkColors() {
        const colorSets = [
            ['#FF1744', '#FF9800', '#FFD700'], // Red-Orange-Gold
            ['#00E676', '#76FF03', '#FFEB3B'], // Green-Lime-Yellow
            ['#2979FF', '#00B0FF', '#18FFFF'], // Blue-Cyan
            ['#E040FB', '#EA80FC', '#F8BBD0'], // Purple-Pink
            ['#FF6B35', '#FFD700', '#FFC107'], // Orange-Gold
            ['#FF1744', '#F50057', '#FF4081'], // Red-Pink
            ['#00E5FF', '#1DE9B6', '#64FFDA']  // Cyan-Teal
        ];
        
        return colorSets[Math.floor(Math.random() * colorSets.length)];
    }
}

// Rocket class - represents a rocket flying upward
class Rocket {
    constructor(x, startY, targetY, color, ageGroup = '', childNickname = '') {
        this.x = x;
        this.y = startY;
        this.targetY = targetY;
        this.color = color;
        this.ageGroup = ageGroup;
        this.childNickname = childNickname;
        this.speed = 3 + Math.random() * 2; // 3-5 pixels per frame
        this.trail = [];
        this.maxTrailLength = 20;
    }
    
    update() {
        this.trail.push({x: this.x, y: this.y});
        if (this.trail.length > this.maxTrailLength) {
            this.trail.shift();
        }
        
        this.y -= this.speed;
        
        // Add slight horizontal wobble
        this.x += (Math.random() - 0.5) * 0.5;
    }
    
    draw(ctx) {
        // Draw trail
        for (let i = 0; i < this.trail.length; i++) {
            const point = this.trail[i];
            const alpha = (i / this.trail.length) * 0.7;
            const size = (i / this.trail.length) * 3;
            
            ctx.fillStyle = this.color + Math.floor(alpha * 255).toString(16).padStart(2, '0');
            ctx.beginPath();
            ctx.arc(point.x, point.y, size, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Draw rocket head
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 15;
        ctx.shadowColor = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
    }
    
    shouldExplode() {
        return this.y <= this.targetY;
    }
}

// Particle class - represents a particle in an explosion
class Particle {
    constructor(x, y, angle, speed, color, sizeMultiplier = 1) {
        this.x = x;
        this.y = y;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        this.color = color;
        this.alpha = 1;
        this.decay = 0.01 + Math.random() * 0.01; // 0.01-0.02
        this.gravity = 0.05;
        this.size = (2 + Math.random() * 2) * sizeMultiplier; // 2-4 pixels
        this.shrink = 0.02;
    }
    
    update() {
        this.vx *= 0.98; // Air resistance
        this.vy *= 0.98;
        this.vy += this.gravity; // Gravity
        
        this.x += this.vx;
        this.y += this.vy;
        
        this.alpha -= this.decay;
        this.size -= this.shrink;
        if (this.size < 0) this.size = 0;
    }
    
    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
    
    isDead() {
        return this.alpha <= 0 || this.size <= 0;
    }
}
