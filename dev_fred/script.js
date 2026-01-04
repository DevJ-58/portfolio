// ============================================
// LENIS SMOOTH SCROLL INITIALIZATION
// ============================================
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

// Update scroll progress bar
lenis.on('scroll', ({ scroll, limit }) => {
    const progress = (scroll / limit) * 100;
    document.getElementById('scrollProgress').style.width = progress + '%';
});

// ============================================
// GSAP + SCROLLTRIGGER + LENIS INTEGRATION
// ============================================
lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
});

gsap.ticker.lagSmoothing(0);

// ============================================
// PRELOADER
// ============================================
window.addEventListener('load', () => {
    setTimeout(() => {
        const preloader = document.getElementById('preloader');
        preloader.style.opacity = '0';
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 500);
    }, 2000);
});

// ============================================
// PARTICLES BACKGROUND
// ============================================
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const particles = [];
const particleCount = 80;
const connectionDistance = 150;

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.size = Math.random() * 2 + 1;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
    }

    draw() {
        ctx.fillStyle = 'rgba(220, 20, 60, 0.6)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });

    // Draw connections
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < connectionDistance) {
                const opacity = (1 - distance / connectionDistance) * 0.3;
                ctx.strokeStyle = `rgba(220, 20, 60, ${opacity})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    }

    requestAnimationFrame(animateParticles);
}

animateParticles();

// ============================================
// NAVIGATION
// ============================================
const navbar = document.getElementById('navbar');
const burger = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');
const navLinkItems = document.querySelectorAll('.nav-link');

// Sticky navbar on scroll
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile menu toggle
burger.addEventListener('click', () => {
    burger.classList.toggle('active');
    navLinks.classList.toggle('active');
});

// Close mobile menu when clicking on a link
navLinkItems.forEach(link => {
    link.addEventListener('click', () => {
        burger.classList.remove('active');
        navLinks.classList.remove('active');
    });
});

// Active navigation link on scroll
const sections = document.querySelectorAll('section[id]');

function activateNavLink() {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinkItems.forEach(link => link.classList.remove('active'));
            if (navLink) navLink.classList.add('active');
        }
    });
}

window.addEventListener('scroll', activateNavLink);

// ============================================
// SMOOTH SCROLLING
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            lenis.scrollTo(target, {
                offset: 0,
                duration: 1.5,
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
            });
        }
    });
});

// ============================================
// HORIZONTAL PROJECTS SCROLL WITH GSAP
// ============================================
function initHorizontalScroll() {
    const projectsSection = document.querySelector('.projects-horizontal');
    const projectsTrack = document.querySelector('.projects-track');
    
    if (!projectsSection || !projectsTrack) return;

    // Calculate total scroll distance
    const trackWidth = projectsTrack.scrollWidth;
    const windowWidth = window.innerWidth;
    const scrollDistance = trackWidth - windowWidth + (windowWidth * 0.5);

    // Create horizontal scroll animation
    const horizontalScroll = gsap.to(projectsTrack, {
        x: -scrollDistance,
        ease: "none",
        scrollTrigger: {
            trigger: projectsSection,
            start: "top top",
            end: () => `+=${scrollDistance}`,
            scrub: 1,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
        }
    });

    // Animate individual project cards
    const projectCards = gsap.utils.toArray('.project-card-horizontal');
    
    projectCards.forEach((card, index) => {
        gsap.from(card, {
            scale: 0.8,
            opacity: 0,
            y: 100,
            rotation: -10,
            scrollTrigger: {
                trigger: card,
                containerAnimation: horizontalScroll,
                start: "left right",
                end: "left center",
                scrub: 1,
            }
        });

        // Parallax effect on project images
        const projectImage = card.querySelector('.project-image-horizontal img');
        if (projectImage) {
            gsap.to(projectImage, {
                scale: 1.2,
                scrollTrigger: {
                    trigger: card,
                    containerAnimation: horizontalScroll,
                    start: "left right",
                    end: "right left",
                    scrub: 1,
                }
            });
        }

        // Animate project number
        const projectNumber = card.querySelector('.project-number');
        if (projectNumber) {
            gsap.from(projectNumber, {
                scale: 0,
                rotation: 360,
                scrollTrigger: {
                    trigger: card,
                    containerAnimation: horizontalScroll,
                    start: "left 80%",
                    end: "left 50%",
                    scrub: 1,
                }
            });
        }

        // Stagger animate features
        const features = card.querySelectorAll('.feature-item');
        gsap.from(features, {
            x: -50,
            opacity: 0,
            stagger: 0.1,
            scrollTrigger: {
                trigger: card,
                containerAnimation: horizontalScroll,
                start: "left 70%",
                end: "left 40%",
                scrub: 1,
            }
        });
    });

    // Animate scroll hint
    gsap.to('.scroll-hint', {
        opacity: 0,
        y: -20,
        scrollTrigger: {
            trigger: projectsSection,
            start: "top top",
            end: "top -100",
            scrub: 1,
        }
    });
}

// ============================================
// HERO PARALLAX ANIMATIONS
// ============================================
function initHeroAnimations() {
    // Hero content reveal
    gsap.from('.hero-content > *', {
        y: 100,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out",
        delay: 2.2
    });

    // Hero image reveal
    gsap.from('.hero-image', {
        x: 100,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out",
        delay: 2.5
    });

    // Parallax scrolling for hero elements
    gsap.to('.hero-image', {
        y: 200,
        scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: 1.5,
        }
    });

    gsap.to('.tech-circle', {
        rotation: 360,
        scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: 2,
        }
    });

    gsap.to('.float-icon', {
        y: -100,
        rotation: 20,
        scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: 1,
        }
    });
}

// ============================================
// SECTION REVEAL ANIMATIONS
// ============================================
function initSectionAnimations() {
    // Animate section headers
    gsap.utils.toArray('.section-header').forEach(header => {
        gsap.from(header.children, {
            y: 50,
            opacity: 0,
            duration: 0.8,
            stagger: 0.1,
            scrollTrigger: {
                trigger: header,
                start: 'top 80%',
                end: 'top 50%',
                scrub: 1,
            }
        });
    });

    // Skills cards animation
    gsap.utils.toArray('.skill-card').forEach((card, index) => {
        gsap.from(card, {
            y: 100,
            opacity: 0,
            rotation: -10,
            scrollTrigger: {
                trigger: card,
                start: 'top 85%',
                end: 'top 60%',
                scrub: 1,
            }
        });
    });

    // Service cards animation with 3D effect
    gsap.utils.toArray('.service-card').forEach((card, index) => {
        gsap.from(card, {
            y: 100,
            opacity: 0,
            rotationX: -30,
            transformOrigin: 'top center',
            scrollTrigger: {
                trigger: card,
                start: 'top 85%',
                end: 'top 55%',
                scrub: 1,
            }
        });
    });

    // Currently cards stagger
    gsap.from('.currently-card', {
        y: 80,
        opacity: 0,
        stagger: 0.2,
        scrollTrigger: {
            trigger: '.currently-grid',
            start: 'top 80%',
            end: 'top 50%',
            scrub: 1,
        }
    });

    // Stats fade in
    gsap.from('.stat-card', {
        scale: 0.8,
        opacity: 0,
        stagger: 0.2,
        scrollTrigger: {
            trigger: '.stats-container',
            start: 'top 80%',
            end: 'top 50%',
            scrub: 1,
        }
    });

    // Contact form slide in
    gsap.from('.contact-form', {
        x: 100,
        opacity: 0,
        scrollTrigger: {
            trigger: '.contact-container',
            start: 'top 80%',
            end: 'top 50%',
            scrub: 1,
        }
    });

    gsap.from('.contact-info', {
        x: -100,
        opacity: 0,
        scrollTrigger: {
            trigger: '.contact-container',
            start: 'top 80%',
            end: 'top 50%',
            scrub: 1,
        }
    });
}

// ============================================
// MAGNETIC BUTTON EFFECT
// ============================================
function initMagneticButtons() {
    const buttons = document.querySelectorAll('.btn, .social-icon, .project-icon-horizontal');
    
    buttons.forEach(button => {
        button.addEventListener('mousemove', (e) => {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            gsap.to(button, {
                x: x * 0.3,
                y: y * 0.3,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
        
        button.addEventListener('mouseleave', () => {
            gsap.to(button, {
                x: 0,
                y: 0,
                duration: 0.5,
                ease: 'elastic.out(1, 0.3)'
            });
        });
    });
}

// ============================================
// TEXT SPLIT ANIMATION
// ============================================
function initTextAnimations() {
    // Animate about text paragraphs
    gsap.utils.toArray('.about-text p').forEach((p, index) => {
        gsap.from(p, {
            y: 30,
            opacity: 0,
            duration: 0.8,
            delay: index * 0.1,
            scrollTrigger: {
                trigger: p,
                start: 'top 85%',
                end: 'top 65%',
                scrub: 1,
            }
        });
    });
}

// ============================================
// INIT ALL ANIMATIONS
// ============================================
function initAllAnimations() {
    initHeroAnimations();
    initHorizontalScroll();
    initSectionAnimations();
    initMagneticButtons();
    initTextAnimations();
}

// Call after page load
window.addEventListener('load', () => {
    setTimeout(() => {
        initAllAnimations();
    }, 2500);
});

// ============================================
// TYPED TEXT EFFECT
// ============================================
const typedTextSpan = document.querySelector('.typed-text');
const textArray = ['Développeur Frontend', 'Créateur Numérique', 'Future Ingénieur IA', 'Tech Enthusiast'];
const typingDelay = 100;
const erasingDelay = 50;
const newTextDelay = 2000;
let textArrayIndex = 0;
let charIndex = 0;

function type() {
    if (charIndex < textArray[textArrayIndex].length) {
        typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
        charIndex++;
        setTimeout(type, typingDelay);
    } else {
        setTimeout(erase, newTextDelay);
    }
}

function erase() {
    if (charIndex > 0) {
        typedTextSpan.textContent = textArray[textArrayIndex].substring(0, charIndex - 1);
        charIndex--;
        setTimeout(erase, erasingDelay);
    } else {
        textArrayIndex++;
        if (textArrayIndex >= textArray.length) textArrayIndex = 0;
        setTimeout(type, typingDelay + 500);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(type, newTextDelay + 250);
});

// ============================================
// SCROLL ANIMATIONS
// ============================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            
            // Animate skill bars when section is visible
            if (entry.target.classList.contains('skills')) {
                animateSkillBars();
            }
        }
    });
}, observerOptions);

document.querySelectorAll('.section').forEach(section => {
    observer.observe(section);
});

// ============================================
// SKILL BARS ANIMATION
// ============================================
let skillsAnimated = false;

function animateSkillBars() {
    if (skillsAnimated) return;
    skillsAnimated = true;

    const skillBars = document.querySelectorAll('.skill-progress');
    skillBars.forEach((bar, index) => {
        setTimeout(() => {
            const progress = bar.getAttribute('data-progress');
            bar.style.width = progress + '%';
        }, index * 100);
    });
}

// ============================================
// STATS COUNTER ANIMATION
// ============================================
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    const counter = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target + (target === 100 ? '%' : '+');
            clearInterval(counter);
        } else {
            element.textContent = Math.floor(start) + (target === 100 ? '%' : '+');
        }
    }, 16);
}

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumbers = entry.target.querySelectorAll('.stat-item strong');
            statNumbers.forEach(stat => {
                const targetText = stat.textContent;
                const targetValue = parseInt(targetText);
                if (!isNaN(targetValue)) {
                    stat.textContent = '0';
                    animateCounter(stat, targetValue);
                }
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

const heroStats = document.querySelector('.hero-stats');
if (heroStats) {
    statsObserver.observe(heroStats);
}

// ============================================
// CONTACT FORM TO WHATSAPP
// ============================================
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;
    
    const whatsappMessage = encodeURIComponent(
        `Bonjour DevJ!\n\n` +
        `Nom: ${name}\n` +
        `Email: ${email}\n` +
        `Sujet: ${subject}\n\n` +
        `Message:\n${message}`
    );
    
    const whatsappURL = `https://wa.me/2250767998373?text=${whatsappMessage}`;
    window.open(whatsappURL, '_blank');
    
    // Reset form
    contactForm.reset();
});

// ============================================
// PARALLAX EFFECT
// ============================================
// Managed by GSAP ScrollTrigger now

// ============================================
// SCROLL TO TOP BUTTON
// ============================================
const scrollTopBtn = document.getElementById('scrollTop');

window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
        scrollTopBtn.classList.add('visible');
    } else {
        scrollTopBtn.classList.remove('visible');
    }
});

scrollTopBtn.addEventListener('click', () => {
    lenis.scrollTo('top', {
        duration: 2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
    });
});

// ============================================
// PROJECT CARDS ANIMATION
// ============================================
const projectCards = document.querySelectorAll('.project-card');

projectCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.zIndex = '10';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.zIndex = '1';
    });
});

// ============================================
// CURSOR EFFECT (DESKTOP ONLY)
// ============================================
if (window.innerWidth > 768) {
    const cursor = document.createElement('div');
    cursor.classList.add('custom-cursor');
    cursor.style.cssText = `
        position: fixed;
        width: 20px;
        height: 20px;
        border: 2px solid var(--crimson-red);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        transition: all 0.15s ease;
        transform: translate(-50%, -50%);
        mix-blend-mode: difference;
    `;
    document.body.appendChild(cursor);

    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animateCursor() {
        const dx = mouseX - cursorX;
        const dy = mouseY - cursorY;
        
        cursorX += dx * 0.2;
        cursorY += dy * 0.2;
        
        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';
        
        requestAnimationFrame(animateCursor);
    }
    
    animateCursor();

    // Hover effects for interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .project-card, .skill-card, .service-card');
    
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
            cursor.style.borderColor = 'var(--bright-red)';
            cursor.style.backgroundColor = 'rgba(220, 20, 60, 0.2)';
        });
        
        el.addEventListener('mouseleave', () => {
            cursor.style.transform = 'translate(-50%, -50%) scale(1)';
            cursor.style.backgroundColor = 'transparent';
        });
    });
}

// ============================================
// PAGE TRANSITION EFFECT
// ============================================
window.addEventListener('beforeunload', () => {
    document.body.style.opacity = '0';
});

// ============================================
// PERFORMANCE OPTIMIZATION
// ============================================
// Lazy loading for images
const images = document.querySelectorAll('img[data-src]');
const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            imageObserver.unobserve(img);
        }
    });
});

images.forEach(img => imageObserver.observe(img));

// ============================================
// CONSOLE MESSAGE
// ============================================
console.log('%c👋 Bonjour! Développeur Frontend passionné ici!', 'color: #DC143C; font-size: 20px; font-weight: bold;');
console.log('%cVous cherchez le code source? Visitez: https://github.com/devj-58', 'color: #ffffff; font-size: 14px;');
console.log('%c💼 Intéressé par une collaboration? Contactez-moi!', 'color: #DC143C; font-size: 14px;');

// ============================================
// KEYBOARD SHORTCUTS
// ============================================
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + K to focus contact form
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const contactSection = document.getElementById('contact');
        contactSection.scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => {
            document.getElementById('name').focus();
        }, 1000);
    }
    
    // Escape to close mobile menu
    if (e.key === 'Escape') {
        burger.classList.remove('active');
        navLinks.classList.remove('active');
    }
});

// ============================================
// DYNAMIC YEAR IN FOOTER
// ============================================
const yearElements = document.querySelectorAll('.current-year');
const currentYear = new Date().getFullYear();
yearElements.forEach(el => {
    el.textContent = currentYear;
});

// ============================================
// COPY EMAIL ON CLICK
// ============================================
const emailLinks = document.querySelectorAll('a[href^="mailto:"]');
emailLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const email = link.href.replace('mailto:', '');
        
        navigator.clipboard.writeText(email).then(() => {
            // Show tooltip
            const tooltip = document.createElement('div');
            tooltip.textContent = 'Email copié!';
            tooltip.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: var(--crimson-red);
                color: white;
                padding: 1rem 2rem;
                border-radius: 5px;
                z-index: 10000;
                font-weight: 600;
                box-shadow: 0 10px 30px rgba(220, 20, 60, 0.5);
            `;
            document.body.appendChild(tooltip);
            
            setTimeout(() => {
                tooltip.style.opacity = '0';
                tooltip.style.transition = 'opacity 0.3s';
                setTimeout(() => tooltip.remove(), 300);
            }, 2000);
        });
    });
});

// ============================================
// INITIALIZE ON PAGE LOAD
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    // Add fade-in animation to body
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s';
        document.body.style.opacity = '1';
    }, 100);
    
    // Initialize active nav link
    activateNavLink();
    
    console.log('%c✨ Portfolio loaded successfully!', 'color: #DC143C; font-size: 16px; font-weight: bold;');
});