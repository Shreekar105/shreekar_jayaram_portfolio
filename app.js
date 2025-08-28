// Portfolio Website JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Navigation functionality
    const nav = document.querySelector('.nav');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav__link');
    const sections = document.querySelectorAll('section[id]');

    // Mobile menu toggle
    navToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });

    // Close mobile menu when clicking on nav links
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });

    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Update active navigation link on scroll
    function updateActiveNavLink() {
        const scrollY = window.pageYOffset;
        const headerHeight = document.querySelector('.header').offsetHeight;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - headerHeight - 50;
            const sectionBottom = sectionTop + section.offsetHeight;
            const sectionId = section.getAttribute('id');
            const correspondingNavLink = document.querySelector(`.nav__link[href="#${sectionId}"]`);

            if (scrollY >= sectionTop && scrollY < sectionBottom) {
                // Remove active class from all nav links
                navLinks.forEach(link => link.classList.remove('active'));
                // Add active class to current section's nav link
                if (correspondingNavLink) {
                    correspondingNavLink.classList.add('active');
                }
            }
        });
    }

    // Header background on scroll
    function updateHeaderBackground() {
        const header = document.querySelector('.header');
        if (window.scrollY > 100) {
            header.style.backgroundColor = 'rgba(252, 252, 249, 0.98)';
            header.style.backdropFilter = 'blur(20px)';
        } else {
            header.style.backgroundColor = 'rgba(252, 252, 249, 0.95)';
            header.style.backdropFilter = 'blur(10px)';
        }
    }

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Animate skill bars when skills section is visible
                if (entry.target.classList.contains('skills')) {
                    animateSkillBars();
                }
            }
        });
    }, observerOptions);

    // Add fade-in animation to sections
    const animatedElements = document.querySelectorAll('.hero__content, .about__content, .projects__grid, .skills__grid, .timeline, .contact__content');
    animatedElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });

    // Skill bar animation with proper width values
    function animateSkillBars() {
        const skillsSection = document.querySelector('.skills');
        const skillProgressBars = document.querySelectorAll('.skill__progress');
        
        // Define skill levels and their corresponding widths
        const skillLevels = {
            'Python': 90,
            'SQL': 90,
            'R': 70,
            'Spark/Big Data': 75,
            'AWS': 85,
            'Azure': 70,
            'GCP': 70,
            'Docker/Kubernetes': 75,
            'Tableau': 90,
            'Power BI': 85,
            'Excel/Advanced Analytics': 95,
            'QuickSight': 70,
            'TensorFlow/PyTorch': 75,
            'Scikit-learn': 85,
            'Neural Networks': 70,
            'Statistical Modeling': 85
        };
        
        skillsSection.classList.add('animate');
        
        skillProgressBars.forEach((bar, index) => {
            const skillName = bar.parentElement.previousElementSibling.querySelector('.skill__name').textContent;
            const width = skillLevels[skillName] || 70; // Default to 70% if not found
            
            // Set the width as a CSS custom property
            bar.style.setProperty('--progress-width', width + '%');
            
            setTimeout(() => {
                bar.style.width = width + '%';
            }, index * 100);
        });
    }

    // Project card interactions
    const projectCards = document.querySelectorAll('.project__card');
    projectCards.forEach(card => {
        const viewDetailsBtn = card.querySelector('.btn--outline');
        
        if (viewDetailsBtn) {
            viewDetailsBtn.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Close other expanded cards
                projectCards.forEach(otherCard => {
                    if (otherCard !== card && otherCard.classList.contains('expanded')) {
                        otherCard.classList.remove('expanded');
                        const otherBtn = otherCard.querySelector('.btn--outline');
                        if (otherBtn) {
                            otherBtn.textContent = 'View Details';
                        }
                    }
                });
                
                // Toggle current card
                card.classList.toggle('expanded');
                
                if (card.classList.contains('expanded')) {
                    this.textContent = 'Hide Details';
                    
                    // Smooth scroll to show the full expanded card
                    setTimeout(() => {
                        card.scrollIntoView({
                            behavior: 'smooth',
                            block: 'center'
                        });
                    }, 300);
                } else {
                    this.textContent = 'View Details';
                }
            });
        }
    });

    // Contact form handling
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const formObject = {};
            formData.forEach((value, key) => {
                formObject[key] = value;
            });

            // Simulate form submission
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;

            setTimeout(() => {
                // Show success message
                showNotification('Thank you for your message! I\'ll get back to you soon.', 'success');
                
                // Reset form
                this.reset();
                
                // Reset button
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 2000);
        });
    }

    // Notification system
    function showNotification(message, type = 'success') {
        // Remove existing notification
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification status status--${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            padding: 16px 20px;
            border-radius: 8px;
            max-width: 400px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        notification.textContent = message;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Auto remove after 5 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 5000);
    }

    // Scroll event listeners
    window.addEventListener('scroll', function() {
        updateActiveNavLink();
        updateHeaderBackground();
    });

    // Resume download functionality
    const downloadResumeBtn = document.querySelector('.hero__cta .btn--outline');
    if (downloadResumeBtn) {
        downloadResumeBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Create a temporary notification since we don't have an actual resume file
            showNotification('Resume download would be available here. Please contact via email for the latest version.', 'info');
            
            // In a real implementation, you would have:
            // window.open('path-to-resume.pdf', '_blank');
        });
    }

    // Parallax effect for hero section
    function parallaxEffect() {
        const hero = document.querySelector('.hero');
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        if (hero && scrolled < hero.offsetHeight) {
            hero.style.transform = `translateY(${rate}px)`;
        }
    }

    // Add parallax effect on scroll (optional, only if performance allows)
    let ticking = false;
    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(function() {
                parallaxEffect();
                ticking = false;
            });
            ticking = true;
        }
    });

    // Keyboard navigation support
    document.addEventListener('keydown', function(e) {
        // Close mobile menu with Escape key
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        }

        // Close expanded project cards with Escape key
        if (e.key === 'Escape') {
            const expandedCards = document.querySelectorAll('.project__card.expanded');
            expandedCards.forEach(card => {
                card.classList.remove('expanded');
                const btn = card.querySelector('.btn--outline');
                if (btn) {
                    btn.textContent = 'View Details';
                }
            });
        }
    });

    // External link handling
    const externalLinks = document.querySelectorAll('a[href^="http"], a[href^="https://"], a[target="_blank"]');
    externalLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Add a small delay to show the link is being followed
            this.style.opacity = '0.7';
            setTimeout(() => {
                this.style.opacity = '1';
            }, 200);
        });
    });

    // Initialize scroll position
    updateActiveNavLink();
    updateHeaderBackground();

    // Performance: Debounce scroll events
    function debounce(func, wait, immediate) {
        let timeout;
        return function executedFunction() {
            const context = this;
            const args = arguments;
            const later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    }

    // Apply debouncing to scroll events for better performance
    const debouncedScrollHandler = debounce(function() {
        updateActiveNavLink();
        updateHeaderBackground();
    }, 10);

    window.addEventListener('scroll', debouncedScrollHandler);

    // Add loading animation
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
        
        // Trigger initial animations
        setTimeout(() => {
            const heroContent = document.querySelector('.hero__content');
            if (heroContent) {
                heroContent.classList.add('visible');
            }
        }, 100);
    });

    // Theme detection and handling
    function handleThemeChange() {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
        
        function updateTheme(e) {
            if (e.matches) {
                document.documentElement.setAttribute('data-color-scheme', 'dark');
            } else {
                document.documentElement.setAttribute('data-color-scheme', 'light');
            }
        }
        
        // Initial theme setup
        updateTheme(prefersDark);
        
        // Listen for theme changes
        prefersDark.addListener(updateTheme);
    }

    // Initialize theme handling
    handleThemeChange();

    // Add custom cursor effect for interactive elements (optional enhancement)
    const interactiveElements = document.querySelectorAll('.btn, .nav__link, .project__card, a');
    
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            this.style.transform = this.style.transform || '';
            if (!this.style.transform.includes('scale')) {
                this.style.transform += ' scale(1.02)';
            }
        });
        
        element.addEventListener('mouseleave', function() {
            this.style.transform = this.style.transform.replace(' scale(1.02)', '');
        });
    });

    // Trigger skills animation if skills section is already visible
    const skillsSection = document.querySelector('.skills');
    if (skillsSection) {
        const skillsObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('animate')) {
                    setTimeout(() => {
                        animateSkillBars();
                    }, 500);
                }
            });
        }, { threshold: 0.3 });
        
        skillsObserver.observe(skillsSection);
    }

    console.log('Portfolio website initialized successfully!');
});