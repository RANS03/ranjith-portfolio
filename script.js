/**
 * Ranjith K Portfolio - Main Scripts
 * Includes Custom Cursor, Canvas Network Animation, Scroll Reveals, and Interactions
 */

document.addEventListener('DOMContentLoaded', () => {
    
    /* ==========================================================================
       1. Custom Cursor & Magnetic Hover Effects
       ========================================================================== */
    const cursor = document.querySelector('.cursor');
    const follower = document.querySelector('.cursor-follower');
    const magneticElements = document.querySelectorAll('.magnetic, .nav-link, .btn, .tag, .skill-tag');
    
    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;
    
    // Update real mouse coordinates
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Instant cursor update
        cursor.style.left = `${mouseX}px`;
        cursor.style.top = `${mouseY}px`;
    });
    
    // Smooth follower animation loop
    const updateFollower = () => {
        // Easing for smooth follow effect
        followerX += (mouseX - followerX) * 0.15;
        followerY += (mouseY - followerY) * 0.15;
        
        follower.style.left = `${followerX}px`;
        follower.style.top = `${followerY}px`;
        
        requestAnimationFrame(updateFollower);
    };
    updateFollower();
    
    // Hover states for magnetic elements
    magneticElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            document.body.classList.add('hovering');
        });
        
        el.addEventListener('mouseleave', () => {
            document.body.classList.remove('hovering');
            // Reset magnetic transform
            el.style.transform = '';
        });
        
        // Subtle magnetic pull
        if(el.classList.contains('magnetic')) {
            el.addEventListener('mousemove', (e) => {
                const rect = el.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                el.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
            });
        }
    });

    /* ==========================================================================
       2. Loader Animation
       ========================================================================== */
    const loader = document.getElementById('loader');
    const loaderProgress = document.querySelector('.loader-progress');
    const heroReveals = document.querySelectorAll('#home .reveal-up');
    
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress > 100) progress = 100;
        loaderProgress.style.width = `${progress}%`;
        
        if (progress === 100) {
            clearInterval(interval);
            setTimeout(() => {
                loader.classList.add('hidden');
                
                // Trigger hero animations after loader disappears
                setTimeout(() => {
                    heroReveals.forEach(el => el.classList.add('active'));
                }, 500);
            }, 500);
        }
    }, 100);

    /* ==========================================================================
       3. Scroll Revelations (Intersection Observer)
       ========================================================================== */
    const revealElements = document.querySelectorAll('.reveal-up:not(#home .reveal-up)');
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    });
    
    revealElements.forEach(el => revealObserver.observe(el));

    /* ==========================================================================
       4. Canvas Neural Network Background
       ========================================================================== */
    const canvas = document.getElementById('bg-canvas');
    const ctx = canvas.getContext('2d');
    
    let width, height;
    let particles = [];
    
    const resizeCanvas = () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    };
    
    window.addEventListener('resize', () => {
        resizeCanvas();
        initParticles();
    });
    resizeCanvas();
    
    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.radius = Math.random() * 1.5 + 0.5;
        }
        
        update() {
            this.x += this.vx;
            this.y += this.vy;
            
            // Wrap around edges
            if (this.x < 0) this.x = width;
            if (this.x > width) this.x = 0;
            if (this.y < 0) this.y = height;
            if (this.y > height) this.y = 0;
            
            // Mouse interaction (repel slightly)
            const dx = mouseX - this.x;
            const dy = mouseY - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < 150) {
                const angle = Math.atan2(dy, dx);
                this.x -= Math.cos(angle) * 1;
                this.y -= Math.sin(angle) * 1;
            }
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(0, 242, 254, 0.5)';
            ctx.fill();
        }
    }
    
    const initParticles = () => {
        particles = [];
        const particleCount = Math.min(Math.floor((width * height) / 15000), 100);
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    };
    initParticles();
    
    const animateParticles = () => {
        ctx.clearRect(0, 0, width, height);
        
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
            
            // Draw connections
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist < 150) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    // Opacity based on distance
                    const opacity = 1 - (dist / 150);
                    ctx.strokeStyle = `rgba(0, 242, 254, ${opacity * 0.2})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
            
            // Draw connection to mouse
            const dxMouse = mouseX - particles[i].x;
            const dyMouse = mouseY - particles[i].y;
            const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
            
            if (distMouse < 200) {
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(mouseX, mouseY);
                const opacity = 1 - (distMouse / 200);
                ctx.strokeStyle = `rgba(142, 45, 226, ${opacity * 0.3})`; // Purple accent connection
                ctx.lineWidth = 0.5;
                ctx.stroke();
            }
        }
        
        requestAnimationFrame(animateParticles);
    };
    animateParticles();

    /* ==========================================================================
       5. 3D Tilt Effect on Hover
       ========================================================================== */
    const tiltCards = document.querySelectorAll('.tilt-card');
    
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left; // x position within the element.
            const y = e.clientY - rect.top;  // y position within the element.
            
            // Update CSS variables for radial glow effect
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
            
            // Calculate tilt angles
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -5; // max 5 deg rotation
            const rotateY = ((x - centerX) / centerX) * 5;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        });
    });

    /* ==========================================================================
       6. Scroll Progress & Navbar & Timeline & Skills
       ========================================================================== */
    const navbar = document.querySelector('.navbar');
    const scrollProgressBar = document.querySelector('.scroll-progress-bar');
    
    const timelineItems = document.querySelectorAll('.timeline-item');
    const timelineProgress = document.querySelector('.timeline-progress');
    const timelineSection = document.querySelector('.timeline');
    
    const skillBars = document.querySelectorAll('.skill-progress');
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.body.scrollHeight - window.innerHeight;
        
        // Navbar Scrolled State
        if (scrollTop > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Global Scroll Progress Bar
        const scrollPercent = (scrollTop / docHeight) * 100;
        scrollProgressBar.style.width = `${scrollPercent}%`;
        
        // Timeline Logic
        if(timelineSection) {
            const rect = timelineSection.getBoundingClientRect();
            // Start filling progress when timeline top hits middle of screen
            const startScroll = rect.top - window.innerHeight / 2; 
            const endScroll = rect.bottom - window.innerHeight / 2;
            
            if (startScroll < 0 && endScroll > 0) {
                const heightPercent = Math.abs(startScroll) / rect.height * 100;
                timelineProgress.style.height = `${Math.min(heightPercent, 100)}%`;
            } else if (startScroll >= 0) {
                timelineProgress.style.height = `0%`;
            } else {
                timelineProgress.style.height = `100%`;
            }
            
            // Activate timeline nodes
            timelineItems.forEach(item => {
                const itemRect = item.getBoundingClientRect();
                if (itemRect.top < window.innerHeight / 2 + 50) {
                    item.classList.add('active');
                }
            });
        }
        
        // Skills Bar Logic
        skillBars.forEach(bar => {
            const rect = bar.getBoundingClientRect();
            if (rect.top < window.innerHeight - 50) {
                bar.style.width = bar.getAttribute('data-width');
            }
        });
    });

});
