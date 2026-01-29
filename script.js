// Smooth Scrolling for Navigation Links
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href.startsWith('#')) {
            e.preventDefault();
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
            }
        }
    });
});

// Add Animation on Scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe product cards
document.querySelectorAll('.product-card').forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = `all 0.6s ease ${index * 0.1}s`;
    observer.observe(card);
});

// CTA Button Click Handler
document.querySelector('.cta-button').addEventListener('click', () => {
    // For demo purposes - add your actual sign-up logic here
    alert('Welcome to reTHINKit! 🧠\n\nGet your first month free and unlock AI excellence.');
});

// Add parallax effect to hero
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero-content');
    if (hero) {
        hero.style.transform = `translateY(${scrolled * 0.3}px)`;
        hero.style.opacity = 1 - (scrolled / 500);
    }
});

// Add gradient animation to CTA button
const ctaButton = document.querySelector('.cta-button');
ctaButton.addEventListener('mousemove', (e) => {
    const rect = ctaButton.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    ctaButton.style.background = `radial-gradient(circle at ${x}px ${y}px, #FFB800 0%, #FF9500 50%, #FF6B00 100%)`;
});

ctaButton.addEventListener('mouseleave', () => {
    ctaButton.style.background = 'linear-gradient(135deg, #FF9500 0%, #FF6B00 100%)';
});

console.log('🧠 reTHINKit.ai - Unlocking AI Excellence');
