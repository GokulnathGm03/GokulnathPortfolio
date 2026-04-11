/* ========================================
   PORTFOLIO — MAIN JAVASCRIPT
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ------ EmailJS Initialization ------
    // REPLACE these with your real EmailJS credentials:
    const EMAILJS_PUBLIC_KEY = 'AyYEkYg-iaCanxiWk';
    const EMAILJS_SERVICE_ID = 'service_lximc8n';
    const EMAILJS_TEMPLATE_ID = 'template_ljx2sz9';

    if (typeof emailjs !== 'undefined') {
        emailjs.init(EMAILJS_PUBLIC_KEY);
    }

    // ------ DOM Elements ------
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const themeToggle = document.getElementById('theme-toggle');
    const contactForm = document.getElementById('contact-form');
    const submitBtn = document.getElementById('submit-btn');
    const backToTop = document.getElementById('back-to-top');
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');
    const statNumbers = document.querySelectorAll('.stat-number');

    // ========================================
    // THEME TOGGLE
    // ========================================
    const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);

    themeToggle.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('portfolio-theme', next);
    });

    // ========================================
    // MOBILE MENU
    // ========================================
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('open');
        document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : '';
    });

    // Close menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('open');
            document.body.style.overflow = '';
        });
    });

    // ========================================
    // NAVBAR SCROLL EFFECT
    // ========================================
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;

        // Add/remove scrolled class
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Back to top button visibility
        if (currentScroll > 600) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }

        lastScroll = currentScroll;
    });

    // ========================================
    // ACTIVE NAV LINK ON SCROLL
    // ========================================
    const observerNavOptions = {
        root: null,
        rootMargin: '-30% 0px -70% 0px',
        threshold: 0
    };

    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerNavOptions);

    sections.forEach(section => navObserver.observe(section));

    // ========================================
    // SCROLL REVEAL ANIMATIONS
    // ========================================
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        root: null,
        rootMargin: '0px 0px -80px 0px',
        threshold: 0.1
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // ========================================
    // ANIMATED STAT COUNTERS
    // ========================================
    let statsAnimated = false;

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !statsAnimated) {
                statsAnimated = true;
                animateStats();
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) {
        statsObserver.observe(heroStats);
    }

    function animateStats() {
        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'), 10);
            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;

            const counter = setInterval(() => {
                current += step;
                if (current >= target) {
                    stat.textContent = target;
                    clearInterval(counter);
                } else {
                    stat.textContent = Math.floor(current);
                }
            }, 16);
        });
    }

    // ========================================
    // CONTACT FORM — EmailJS
    // ========================================
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Basic validation
        const name = document.getElementById('user_name').value.trim();
        const email = document.getElementById('user_email').value.trim();
        const subject = document.getElementById('subject').value.trim();
        const message = document.getElementById('message').value.trim();

        if (!name || !email || !subject || !message) {
            showToast('Please fill in all fields.', 'error');
            return;
        }

        if (!isValidEmail(email)) {
            showToast('Please enter a valid email address.', 'error');
            return;
        }

        // Show loading state
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoading = submitBtn.querySelector('.btn-loading');
        const btnIcon = submitBtn.querySelector('svg:last-child');
        btnText.style.display = 'none';
        if (btnIcon) btnIcon.style.display = 'none';
        btnLoading.style.display = 'inline-flex';
        submitBtn.disabled = true;

        // Check if EmailJS is configured
        if (EMAILJS_PUBLIC_KEY === 'YOUR_PUBLIC_KEY') {
            // Demo mode — simulate sending
            setTimeout(() => {
                resetButton();
                contactForm.reset();
                showToast('Message sent successfully! (Demo mode — configure EmailJS to send real emails)', 'success');
            }, 1500);
            return;
        }

        // Send email via EmailJS
        emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
            from_name: name,
            from_email: email,
            subject: subject,
            message: message
        })
            .then(() => {
                resetButton();
                contactForm.reset();
                showToast('Message sent successfully! I\'ll get back to you soon.', 'success');
            })
            .catch((error) => {
                console.error('EmailJS Error:', error);
                resetButton();
                showToast('Something went wrong. Please try again later.', 'error');
            });

        function resetButton() {
            btnText.style.display = 'inline';
            if (btnIcon) btnIcon.style.display = 'inline';
            btnLoading.style.display = 'none';
            submitBtn.disabled = false;
        }
    });

    // ========================================
    // TOAST NOTIFICATION
    // ========================================
    function showToast(message, type = 'success') {
        toastMessage.textContent = message;
        toast.className = 'toast show ' + type;

        // Auto-hide after 4 seconds
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                toast.className = 'toast';
            }, 400);
        }, 4000);
    }

    // ========================================
    // UTILITY FUNCTIONS
    // ========================================
    function isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    // ========================================
    // SMOOTH SCROLL FOR ALL ANCHOR LINKS
    // ========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

});
