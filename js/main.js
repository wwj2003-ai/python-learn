/**
 * 吴卫杰 个人主页 - 交互效果
 */

// ===== 加载动画 =====
(function initLoading() {
    const overlay = document.getElementById('loading-overlay');
    if (!overlay) return;

    const hide = () => overlay.classList.add('hidden');

    window.addEventListener('load', () => {
        setTimeout(hide, 600);
    });

    // 兜底：最多等 5 秒强制隐藏
    setTimeout(hide, 5000);
})();

// ===== 入场动画（Intersection Observer） =====
(function initReveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.15 });

    document.querySelectorAll('.fade-in-up').forEach(el => observer.observe(el));

    // 首屏卡片立即触发
    const heroCard = document.querySelector('.hero .card');
    if (heroCard) {
        setTimeout(() => heroCard.classList.add('visible'), 200);
    }
})();

// ===== 深色/浅色模式切换 =====
(function initThemeToggle() {
    const html = document.documentElement;
    const toggle = document.getElementById('theme-toggle');
    if (!toggle) return;

    const saved = localStorage.getItem('theme');
    if (saved === 'light' || saved === 'dark') {
        html.setAttribute('data-theme', saved);
    }

    toggle.addEventListener('click', () => {
        const current = html.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        html.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
        updateParticleTheme();
    });
})();

// ===== 粒子背景 =====
(function initParticles() {
    const canvas = document.getElementById('particles');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width, height;
    const particles = [];
    const count = 80;

    function getParticleColor(opacity) {
        const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
        const r = isDark ? 168 : 124;
        const g = isDark ? 85 : 58;
        const b = isDark ? 247 : 237;
        return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }

    function getLineColor(opacity) {
        const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
        const r = isDark ? 168 : 124;
        const g = isDark ? 85 : 58;
        const b = isDark ? 247 : 237;
        return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }

    class Particle {
        constructor() {
            this.reset(true);
        }

        reset(initial) {
            this.x = initial ? Math.random() * width  : 0;
            this.y = initial ? Math.random() * height : Math.random() * height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.4;
            this.speedY = (Math.random() - 0.5) * 0.4;
            this.opacity = Math.random() * 0.5 + 0.1;
            this.opacitySpeed = (Math.random() - 0.5) * 0.005;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.opacity += this.opacitySpeed;

            if (this.opacity <= 0.05 || this.opacity >= 0.55) {
                this.opacitySpeed *= -1;
            }

            if (this.x < -10 || this.x > width + 10 || this.y < -10 || this.y > height + 10) {
                this.reset(false);
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = getParticleColor(this.opacity);
            ctx.fill();
        }
    }

    for (let i = 0; i < count; i++) {
        particles.push(new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });

        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 120) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = getLineColor(0.06 * (1 - dist / 120));
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }

        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', resize);
    resize();
    animate();

    window.updateParticleTheme = () => {}; // 占位，粒子颜色在 animate 中实时读取
})();

// ===== 打字动画 =====
(function typingEffect() {
    const el = document.getElementById('typing-text');
    if (!el) return;
    const texts = ['编程爱好者', '热爱开源', '持续学习中...'];
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let isPaused = false;

    function type() {
        const current = texts[textIndex];

        if (isPaused) {
            setTimeout(() => {
                isPaused = false;
                isDeleting = true;
                type();
            }, 2000);
            return;
        }

        if (!isDeleting) {
            charIndex++;
            el.textContent = current.slice(0, charIndex);
            if (charIndex === current.length) {
                isPaused = true;
                setTimeout(type, 2000);
                return;
            }
            setTimeout(type, 100 + Math.random() * 60);
        } else {
            charIndex--;
            el.textContent = current.slice(0, charIndex);
            if (charIndex === 0) {
                isDeleting = false;
                textIndex = (textIndex + 1) % texts.length;
                setTimeout(type, 300);
                return;
            }
            setTimeout(type, 50);
        }
    }

    type();
})();

// ===== 头像上传 =====
(function initAvatarUpload() {
    const avatar = document.getElementById('avatar-upload');
    const input = document.getElementById('avatar-input');
    const img = document.getElementById('avatar-img');
    if (!avatar || !input) return;

    // 页面加载时恢复已保存的头像
    const saved = localStorage.getItem('avatar');
    if (saved) {
        img.src = saved;
        avatar.classList.add('uploaded');
    }

    avatar.addEventListener('click', () => input.click());

    input.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (ev) => {
            // 缩放到 200x200，减小 localStorage 占用
            const tmp = new Image();
            tmp.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = 200;
                canvas.height = 200;
                const ctx = canvas.getContext('2d');
                // 居中裁剪为正方形
                const size = Math.min(tmp.width, tmp.height);
                const sx = (tmp.width - size) / 2;
                const sy = (tmp.height - size) / 2;
                ctx.drawImage(tmp, sx, sy, size, size, 0, 0, 200, 200);
                const base64 = canvas.toDataURL('image/jpeg', 0.85);
                img.src = base64;
                avatar.classList.add('uploaded');
                localStorage.setItem('avatar', base64);
            };
            tmp.src = ev.target.result;
        };
        reader.readAsDataURL(file);
        // 允许重复选择同一文件
        input.value = '';
    });

    // 右键点击头像可重置
    avatar.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        img.src = '';
        avatar.classList.remove('uploaded');
        localStorage.removeItem('avatar');
    });
})();

// ===== 平滑滚动到"关于"区域 =====
(function initScrollHint() {
    const hint = document.getElementById('scroll-hint');
    const about = document.getElementById('about');
    if (!hint || !about) return;

    hint.addEventListener('click', () => {
        about.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
})();

// ===== 社交按钮点击涟漪 =====
(function initRipple() {
    document.querySelectorAll('.ripple').forEach(btn => {
        btn.addEventListener('click', function (e) {
            // 移除旧涟漪再重新触发
            this.classList.remove('ripple');
            void this.offsetWidth;
            this.classList.add('ripple');
        });
    });
})();
