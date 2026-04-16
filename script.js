// Minimal Aesthetic Portfolio JavaScript
// Author: Gitishan Biswal

class MinimalPortfolio {
    constructor() {
        this.currentTypeIndex = 0;
        this.currentCharIndex = 0;
        this.isDeleting = false;
        this.typeDelay = 100;
        this.deleteDelay = 50;
        this.nextWordDelay = 500;
        
        // Typing texts for hero section
        this.typingTexts = [
            'Software Engineer',
            'Cloud Consultant',
            'Data Analyst',
            'Designer',
            'Video Editor',
            
            'Cloud Consultant',
        ];
        
        // DOM Elements
        this.loadingScreen = document.getElementById('loading-screen');
        this.navbar = document.getElementById('navbar');
        this.navMenu = document.getElementById('nav-menu');
        this.navToggle = document.getElementById('nav-toggle');
        this.navOverlay = document.getElementById('nav-overlay');
        this.typingText = document.getElementById('typing-text');

        this.downloadResume = document.getElementById('download-resume');
        this.skillsTrack = document.getElementById('skills-track');
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.showLoading();
        this.initializeAOS();
        this.duplicateSkillsTrack();
        
        // Hide loading screen after animation
        this.startLoadingSequence();
        setTimeout(() => {
            this.hideLoading();
            this.startTypingAnimation();
            this.initializeScrollAnimations();
        }, 1000);
    }
    
    setupEventListeners() {
        // Navigation
        this.navToggle.addEventListener('click', () => this.toggleMobileMenu());
        
        // Smooth scroll for navigation links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => this.handleNavClick(e));
        });
        
        
        // Resume download
        this.downloadResume.addEventListener('click', (e) => this.handleResumeDownload(e));
        
        // Navbar scroll effect
        window.addEventListener('scroll', () => this.handleScroll());
        
        // Active navigation link highlighting
        window.addEventListener('scroll', () => this.updateActiveNavLink());
        
        // Skills track hover pause
        if (this.skillsTrack) {
            this.skillsTrack.addEventListener('mouseenter', () => this.pauseSkillsAnimation());
            this.skillsTrack.addEventListener('mouseleave', () => this.resumeSkillsAnimation());
        }
        
        // Smooth scroll buttons - only for hash links, exclude mailto and external links
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            // Skip mailto links and other non-hash links
            if (link.getAttribute('href') && !link.getAttribute('href').startsWith('mailto:') && !link.getAttribute('href').startsWith('http')) {
                link.addEventListener('click', (e) => this.smoothScroll(e));
            }
        });
        
        // Ensure mailto links work properly - explicitly allow default behavior
        document.querySelectorAll('a[href^="mailto:"]').forEach(link => {
            link.addEventListener('click', (e) => {
                // Ensure mailto links are not prevented
                e.stopPropagation();
                // Let browser handle mailto naturally - don't prevent default
            }, { passive: true });
        });
        
        // Close mobile menu when clicking overlay
        if (this.navOverlay) {
            this.navOverlay.addEventListener('click', () => {
                if (this.navMenu.classList.contains('active')) {
                    this.toggleMobileMenu();
                }
            });
        }
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.navbar.contains(e.target) && this.navMenu.classList.contains('active')) {
                this.toggleMobileMenu();
            }
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
        
        // Window resize handler
        window.addEventListener('resize', () => this.handleResize());
    }
    
    // Loading Screen
    showLoading() {
        this.loadingScreen.classList.remove('hidden');
    }
    
    hideLoading() {
        this.loadingScreen.classList.add('hidden');
        setTimeout(() => {
            this.loadingScreen.style.display = 'none';
        }, 600);
    }
    
    startLoadingSequence() {
        const percentage = document.querySelector('.loading-percentage');
        const status = document.querySelector('.loading-status');
        const messages = [
            'Loading assets...',
            'Initializing components...',
            'Setting up animations...',
            'Preparing experience...',
            'Almost ready...'
        ];
        
        let progress = 0;
        let messageIndex = 0;
        
        const updateProgress = () => {
            progress += Math.random() * 35 + 10;
            if (progress > 100) progress = 100;
            
            if (percentage) {
                percentage.textContent = Math.floor(progress) + '%';
            }
            
            if (status && messageIndex < messages.length) {
                if (progress > (messageIndex + 1) * 20) {
                    status.textContent = messages[messageIndex];
                    messageIndex++;
                }
            }
            
            if (progress < 100) {
                setTimeout(updateProgress, 100 + Math.random() * 150);
            } else {
                if (status) {
                    status.textContent = 'Ready! Welcome to the experience.';
                }
            }
        };
        
        setTimeout(updateProgress, 400);
    }
    
    // Typing Animation
    startTypingAnimation() {
        this.typeText();
    }
    
    typeText() {
        const currentText = this.typingTexts[this.currentTypeIndex];
        
        if (!this.isDeleting) {
            // Typing
            this.typingText.textContent = currentText.substring(0, this.currentCharIndex + 1);
            this.currentCharIndex++;
            
            if (this.currentCharIndex === currentText.length) {
                // Finished typing, wait before deleting
                setTimeout(() => {
                    this.isDeleting = true;
                    this.typeText();
                }, this.nextWordDelay);
                return;
            }
            
            setTimeout(() => this.typeText(), this.typeDelay + Math.random() * 50);
        } else {
            // Deleting
            this.typingText.textContent = currentText.substring(0, this.currentCharIndex - 1);
            this.currentCharIndex--;
            
            if (this.currentCharIndex === 0) {
                // Finished deleting, move to next word
                this.isDeleting = false;
                this.currentTypeIndex = (this.currentTypeIndex + 1) % this.typingTexts.length;
                setTimeout(() => this.typeText(), 500);
                return;
            }
            
            setTimeout(() => this.typeText(), this.deleteDelay + Math.random() * 30);
        }
    }
    
    // Navigation
    toggleMobileMenu() {
        const isActive = this.navMenu.classList.contains('active');
        this.navMenu.classList.toggle('active');
        this.navToggle.classList.toggle('active');
        if (this.navOverlay) {
            this.navOverlay.classList.toggle('active');
        }
        document.body.style.overflow = !isActive ? 'hidden' : '';
    }
    
    handleNavClick(e) {
        e.preventDefault();
        const targetId = e.target.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            // Close mobile menu if open
            if (this.navMenu.classList.contains('active')) {
                this.toggleMobileMenu();
            }
            
            // Smooth scroll to section
            this.scrollToSection(targetSection);
            
            // Update active nav link
            this.setActiveNavLink(e.target);
        }
    }
    
    smoothScroll(e) {
        // Get the href from the link element, not the target (which might be an icon)
        const link = e.target.closest('a');
        if (!link) return;
        
        const href = link.getAttribute('href');
        
        // Only handle hash links, let mailto and other links work normally
        if (href && href.startsWith('#') && !href.startsWith('mailto:') && !href.startsWith('http')) {
            e.preventDefault();
            const targetSection = document.querySelector(href);
            if (targetSection) {
                this.scrollToSection(targetSection);
            }
        }
        // For mailto and other external links, let the browser handle them normally
    }
    
    scrollToSection(section) {
        const offsetTop = section.getBoundingClientRect().top + window.pageYOffset - 80;
        
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
    
    handleScroll() {
        const scrolled = window.pageYOffset > 50;
        this.navbar.style.background = scrolled 
            ? 'rgba(10, 10, 10, 0.98)' 
            : 'rgba(10, 10, 10, 0.95)';
        this.navbar.style.boxShadow = scrolled 
            ? '0 2px 20px rgba(0, 0, 0, 0.5)' 
            : '0 2px 20px rgba(0, 0, 0, 0.3)';
    }
    
    updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link, .nav-link-visible');
        const scrollPos = window.pageYOffset + 100;
        
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top + window.pageYOffset;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }
    
    setActiveNavLink(activeLink) {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        activeLink.classList.add('active');
    }
    
    // Skills Animation
    duplicateSkillsTrack() {
        if (this.skillsTrack) {
            const skillItems = this.skillsTrack.innerHTML;
            this.skillsTrack.innerHTML = skillItems + skillItems;
        }
    }

    pauseSkillsAnimation() {
        if (this.skillsTrack) this.skillsTrack.style.animationPlayState = 'paused';
    }

    resumeSkillsAnimation() {
        if (this.skillsTrack) this.skillsTrack.style.animationPlayState = 'running';
    }
    

    
    // Resume Download
    handleResumeDownload(e) {
        // Don't prevent default - let the browser handle the PDF download/view
        
        // Add loading animation
        const btn = e.target.closest('.btn');
        const originalContent = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Opening...';
        
        setTimeout(() => {
            btn.innerHTML = originalContent;
            this.showNotification('Resume opened successfully!', 'success');
        }, 800);
    }
    
    // Keyboard Navigation
    handleKeyboard(e) {
        // Close mobile menu with Escape key
        if (e.key === 'Escape' && this.navMenu.classList.contains('active')) {
            this.toggleMobileMenu();
        }
        
        // Quick navigation with number keys
        if (e.altKey) {
            const sections = ['home', 'about', 'skills', 'projects', 'experience', 'leadership', 'education', 'certifications', 'contact'];
            const keyNum = parseInt(e.key);
            if (keyNum >= 1 && keyNum <= sections.length) {
                e.preventDefault();
                const section = document.getElementById(sections[keyNum - 1]);
                if (section) {
                    this.scrollToSection(section);
                }
            }
        }
    }
    
    // Window Resize Handler
    handleResize() {
        // Keep menu behavior consistent across all screen sizes
        // Menu can stay open on resize if needed
    }
    
    // Initialize AOS (Animate On Scroll)
    initializeAOS() {
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 600,
                easing: 'ease-out',
                once: true,
                offset: 100,
                disable: 'mobile'
            });
            
            // Refresh AOS to recognize new sections
            setTimeout(() => {
                AOS.refresh();
            }, 100);
        }
    }
    
    // Scroll Animations
    initializeScrollAnimations() {
        // Intersection Observer for scroll animations
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
        
        // Observe elements for scroll animations
        document.querySelectorAll('.project-card, .timeline-item, .contact-item').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
            observer.observe(el);
        });
        
        // Counter animation for stats
        this.animateCounters();
    }
    
    animateCounters() {
        const counters = document.querySelectorAll('.stat-number');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        });
        
        counters.forEach(counter => observer.observe(counter));
    }
    
    animateCounter(element) {
        const target = parseInt(element.textContent);
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target + '+';
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current) + '+';
            }
        }, 16);
    }
    
    // Utility Methods
    throttle(func, delay) {
        let timeoutId;
        let lastExecTime = 0;
        return function (...args) {
            const currentTime = Date.now();
            
            if (currentTime - lastExecTime > delay) {
                func.apply(this, args);
                lastExecTime = currentTime;
            } else {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(() => {
                    func.apply(this, args);
                    lastExecTime = Date.now();
                }, delay - (currentTime - lastExecTime));
            }
        };
    }
    
    debounce(func, delay) {
        let timeoutId;
        return function (...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func.apply(this, args), delay);
        };
    }
}

// Contact Form Handler
class ContactFormHandler {
    constructor() {
        this.form = document.getElementById('contact-form');
        this.submitBtn = document.getElementById('submit-btn');
        this.emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (this.form) {
            this.init();
        }
    }
    
    init() {
        // Add event listeners
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        // Real-time validation
        const inputs = this.form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearError(input));
        });
    }
    
    validateField(field) {
        const fieldName = field.name;
        const fieldValue = field.value.trim();
        const errorElement = document.getElementById(`${fieldName}-error`);
        let isValid = true;
        let errorMessage = '';
        
        // Check if required field is empty
        if (field.hasAttribute('required') && !fieldValue) {
            isValid = false;
            errorMessage = `${this.getFieldLabel(fieldName)} is required`;
        }
        
        // Email validation
        if (fieldName === 'email' && fieldValue) {
            if (!this.emailRegex.test(fieldValue)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
        }
        
        // Update UI
        if (isValid) {
            this.showSuccess(field, errorElement);
        } else {
            this.showError(field, errorElement, errorMessage);
        }
        
        return isValid;
    }
    
    validateForm() {
        const inputs = this.form.querySelectorAll('input[required], textarea[required]');
        let isFormValid = true;
        
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isFormValid = false;
            }
        });
        
        return isFormValid;
    }
    
    showError(field, errorElement, message) {
        field.classList.add('error');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.add('show');
        }
    }
    
    showSuccess(field, errorElement) {
        field.classList.remove('error');
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.classList.remove('show');
        }
    }
    
    clearError(field) {
        if (field.classList.contains('error')) {
            const fieldName = field.name;
            const errorElement = document.getElementById(`${fieldName}-error`);
            this.showSuccess(field, errorElement);
        }
    }
    
    getFieldLabel(fieldName) {
        const labels = {
            'name': 'Name',
            'email': 'Email',
            'subject': 'Subject',
            'message': 'Message'
        };
        return labels[fieldName] || fieldName;
    }
    
    handleSubmit(e) {
        e.preventDefault();
        
        // Validate all fields
        if (!this.validateForm()) {
            // Focus on first error field
            const firstError = this.form.querySelector('.error');
            if (firstError) {
                firstError.focus();
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return;
        }
        
        // Get form data
        const formData = new FormData(this.form);
        const name = formData.get('name').trim();
        const email = formData.get('email').trim();
        const subject = formData.get('subject').trim();
        const message = formData.get('message').trim();
        
        // Show loading state
        this.setLoadingState(true);
        
        // Create mailto link with pre-filled data
        const emailBody = `Hello,\n\n${message}\n\nBest regards,\n${name}`;
        const mailtoLink = `mailto:gitishan@yahoo.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;
        
        // Small delay for better UX
        setTimeout(() => {
            // Open mail client
            window.location.href = mailtoLink;
            
            // Reset loading state after a moment
            setTimeout(() => {
                this.setLoadingState(false);
                this.showSuccessMessage();
            }, 1000);
        }, 500);
    }
    
    setLoadingState(isLoading) {
        if (isLoading) {
            this.submitBtn.classList.add('loading');
            this.submitBtn.disabled = true;
        } else {
            this.submitBtn.classList.remove('loading');
            this.submitBtn.disabled = false;
        }
    }
    
    showSuccessMessage() {
        // Create and show success notification
        const notification = document.createElement('div');
        notification.className = 'form-success-notification';
        notification.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <span>Form submitted! Your email client should open shortly.</span>
        `;
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => notification.classList.add('show'), 10);
        
        // Remove after 5 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }
}

// Initialize portfolio when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.portfolio = new MinimalPortfolio();
    window.contactForm = new ContactFormHandler();
});

// Performance monitoring
window.addEventListener('load', () => {
    const loadTime = performance.now();
    console.log(`Portfolio loaded in ${loadTime.toFixed(2)}ms`);
});

// Service Worker registration (if available)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Error handling
window.addEventListener('error', (e) => {
    console.error('Global error:', e.error);
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
});

// Add CSS for notification (since we're creating it dynamically)
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    .notification-content {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    .notification-content i {
        font-size: 1.125rem;
    }
    
    @media (max-width: 768px) {
        .notification {
            right: 10px !important;
            left: 10px !important;
            transform: translateY(-100px) !important;
        }
        
        .notification.show {
            transform: translateY(0) !important;
        }
    }
`;
document.head.appendChild(notificationStyles);

// ===== SCROLL PROGRESS BAR =====
const scrollProgressBar = document.createElement('div');
scrollProgressBar.className = 'scroll-progress-bar';
document.body.appendChild(scrollProgressBar);

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    scrollProgressBar.style.width = progress + '%';
}, { passive: true });

// ===== CURSOR GLOW =====
const cursorGlow = document.createElement('div');
cursorGlow.className = 'cursor-glow';
document.body.appendChild(cursorGlow);

// ===== CUSTOM CURSOR =====
const cursorDot  = document.createElement('div');
const cursorRing = document.createElement('div');
cursorDot.className  = 'cursor-dot';
cursorRing.className = 'cursor-ring';
document.body.appendChild(cursorDot);
document.body.appendChild(cursorRing);

let mouseX = 0, mouseY = 0;
let ringX  = 0, ringY  = 0;
let rafId  = null;

function animateRing() {
    // Ring follows with smooth lag
    ringX += (mouseX - ringX) * 0.14;
    ringY += (mouseY - ringY) * 0.14;
    cursorRing.style.left = ringX + 'px';
    cursorRing.style.top  = ringY + 'px';
    rafId = requestAnimationFrame(animateRing);
}
animateRing();

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // Dot snaps instantly
    cursorDot.style.left = mouseX + 'px';
    cursorDot.style.top  = mouseY + 'px';

    // Ambient glow follows
    cursorGlow.style.left    = mouseX + 'px';
    cursorGlow.style.top     = mouseY + 'px';
    cursorGlow.style.opacity = '1';
}, { passive: true });

document.addEventListener('mouseleave', () => {
    cursorGlow.style.opacity = '0';
    cursorDot.style.opacity  = '0';
    cursorRing.style.opacity = '0';
});

document.addEventListener('mouseenter', () => {
    cursorDot.style.opacity  = '1';
    cursorRing.style.opacity = '1';
});

// Scale ring on interactive elements
const hoverTargets = 'a, button, .cert-card, .proj-card, .tl-card, .skill-tag, .nav-link, .cta-btn';

document.querySelectorAll(hoverTargets).forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursorRing.style.width        = '48px';
        cursorRing.style.height       = '48px';
        cursorRing.style.borderColor  = 'rgba(139, 92, 246, 0.9)';
        cursorRing.style.background   = 'rgba(139, 92, 246, 0.08)';
        cursorDot.style.transform     = 'translate(-50%, -50%) scale(0.4)';
    });
    el.addEventListener('mouseleave', () => {
        cursorRing.style.width        = '32px';
        cursorRing.style.height       = '32px';
        cursorRing.style.borderColor  = 'rgba(139, 92, 246, 0.6)';
        cursorRing.style.background   = 'rgba(139, 92, 246, 0.04)';
        cursorDot.style.transform     = 'translate(-50%, -50%) scale(1)';
    });
});


// ===== SECTION SUBTITLE FADE =====
document.querySelectorAll('.section-subtitle').forEach(el => {
    const obs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('sub-animated');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    obs.observe(el);
});

// ===== iOS TOUCH HOVER FIX =====
// iOS only fires :hover on elements with a touch/click listener.
// Adding empty touchstart makes all interactive elements respond to hover CSS.
document.querySelectorAll(
    'a, button, .cert-card, .proj-card, .tl-card, .skill-item, .social-link, .btn, .nav-link'
).forEach(el => {
    el.addEventListener('touchstart', () => {}, { passive: true });
});

console.log('🎨 Minimal Aesthetic Portfolio initialized successfully!');
console.log('✨ Ready to showcase amazing work!');
console.log('🚀 Performance optimized and accessible!'); 