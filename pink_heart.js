const canvas = document.getElementById("pinkboard");
const ctx = canvas.getContext("2d");

// تحديث حجم الـ canvas عند تغيير حجم النافذة
window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    updateParticleSettings(); // تحديث إعدادات الجزيئات عند تغيير حجم الشاشة
});

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const particles = [];
const settings = {
    particles: {
        length: window.innerWidth > 600 ? 1500 : 800, // تقليل عدد الجسيمات على الشاشات الصغيرة
        maxSize: window.innerWidth > 600 ? 6 : 3,     // تصغير حجم الجسيمات على الشاشات الصغيرة
        minSize: window.innerWidth > 600 ? 2 : 1.5,
        colors: ["rgba(255,105,180,0.9)", "rgba(255,182,193,0.7)", "rgba(255,20,147,0.5)"],
        speed: 0.02,
        maxLifetime: 300,
        sparkleIntensity: 0.02,
        spiralIntensity: 0.1,
    },
};

// تحديث إعدادات الجزيئات بناءً على حجم الشاشة
function updateParticleSettings() {
    settings.particles.length = window.innerWidth > 600 ? 1500 : 800;
    settings.particles.maxSize = window.innerWidth > 600 ? 6 : 3;
    settings.particles.minSize = window.innerWidth > 600 ? 2 : 1.5;
}

// معادلة لرسم شكل القلب
function getHeartCoordinates(angle) {
    const scale = 18;
    const x = scale * (16 * Math.pow(Math.sin(angle), 3));
    const y = -scale * (13 * Math.cos(angle) - 5 * Math.cos(2 * angle) - 2 * Math.cos(3 * angle) - Math.cos(4 * angle));
    return { x, y };
}

class Particle {
    constructor(x, y) {
        this.baseX = x + canvas.width / 2;
        this.baseY = y + canvas.height / 2;
        this.x = this.baseX;
        this.y = this.baseY;
        this.size = Math.random() * (settings.particles.maxSize - settings.particles.minSize) + settings.particles.minSize;
        this.color = settings.particles.colors[Math.floor(Math.random() * settings.particles.colors.length)];
        this.angle = Math.random() * Math.PI * 2;
        this.speed = Math.random() * settings.particles.speed + 0.01;
        this.range = Math.random() * 80 + 20;
        this.lifetime = Math.random() * settings.particles.maxLifetime;
        this.opacity = 1;
    }

    draw() {
        const sparkle = Math.random() < settings.particles.sparkleIntensity ? 1.5 : 1;
        ctx.fillStyle = this.color.replace(/0.\d+/, this.opacity.toFixed(2));
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * sparkle, 0, Math.PI * 2);
        ctx.fill();
    }

    update() {
        this.angle += this.speed;
        this.x += Math.cos(this.angle + this.lifetime * settings.particles.spiralIntensity) * this.range * 0.02;
        this.y += Math.sin(this.angle + this.lifetime * settings.particles.spiralIntensity) * this.range * 0.02;
        
        this.color = settings.particles.colors[Math.floor(Math.random() * settings.particles.colors.length)];
        
        this.lifetime--;
        if (this.lifetime > 0) {
            this.opacity = this.lifetime / settings.particles.maxLifetime;
        } else {
            this.opacity = 0;
        }

        if (this.lifetime <= 0) {
            this.x = this.baseX;
            this.y = this.baseY;
            this.lifetime = Math.random() * settings.particles.maxLifetime;
            this.opacity = 1;
        }
    }
}

function createHeartParticles() {
    for (let i = 0; i < settings.particles.length; i++) {
        const angle = Math.random() * Math.PI * 2;
        const { x, y } = getHeartCoordinates(angle);
        particles.push(new Particle(x, y));
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((particle) => {
        particle.update();
        particle.draw();
    });

    requestAnimationFrame(animate);
}

createHeartParticles();
animate();
