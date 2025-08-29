// Portfolio Website JavaScript with EmailJS Integration
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing portfolio website...');

    // EmailJS Configuration
    // SETUP INSTRUCTIONS:
    // 1. Sign up for EmailJS account at https://www.emailjs.com/
    // 2. Create an email service (Gmail, Outlook, etc.)
    // 3. Create an email template with these variables:
    //    - from_name: {{from_name}}
    //    - from_email: {{from_email}}
    //    - subject: {{subject}}
    //    - message: {{message}}
    //    - reply_to: {{reply_to}}
    // 4. Replace the placeholder values below with your actual EmailJS credentials
    const EMAILJS_CONFIG = {
        serviceID: 'YOUR_SERVICE_ID',      // Replace with your EmailJS service ID
        templateID: 'YOUR_TEMPLATE_ID',    // Replace with your EmailJS template ID
        publicKey: 'YOUR_PUBLIC_KEY'       // Already initialized in HTML head
    };

    // Notification system - moved to top to be available everywhere
    function showNotification(message, type = 'success') {
        console.log(`Showing notification: ${message} (${type})`);
        
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
            cursor: pointer;
            font-size: 14px;
            line-height: 1.4;
        `;
        notification.textContent = message;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Auto remove after duration
        const duration = type === 'error' ? 10000 : 7000;
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.transform = 'translateX(100%)';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.remove();
                    }
                }, 300);
            }
        }, duration);

        // Add click to dismiss
        notification.addEventListener('click', () => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        });
    }

    // Navigation functionality
    const nav = document.querySelector('.nav');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav__link');
    const sections = document.querySelectorAll('section[id]');

    console.log(`Found ${navLinks.length} navigation links`);

    // Mobile menu toggle
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
            console.log('Mobile menu toggled');
        });
    }

    // Close mobile menu when clicking on nav links
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (navMenu) {
                navMenu.classList.remove('active');
            }
            if (navToggle) {
                navToggle.classList.remove('active');
            }
        });
    });

    // Smooth scrolling for navigation links - FIXED
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            console.log('Navigation link clicked:', this.getAttribute('href'));
            e.preventDefault();
            
            const href = this.getAttribute('href');
            if (!href || !href.startsWith('#')) {
                console.log('Invalid href:', href);
                return;
            }
            
            const targetId = href.substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                console.log('Scrolling to section:', targetId);
                const header = document.querySelector('.header');
                const headerHeight = header ? header.offsetHeight : 80;
                const targetPosition = targetSection.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: Math.max(0, targetPosition),
                    behavior: 'smooth'
                });
                
                // Update active state immediately
                navLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
            } else {
                console.log('Target section not found:', targetId);
            }
        });
    });

    // Update active navigation link on scroll
    function updateActiveNavLink() {
        const scrollY = window.pageYOffset;
        const header = document.querySelector('.header');
        const headerHeight = header ? header.offsetHeight : 80;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - headerHeight - 100;
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
        if (!header) return;
        
        if (window.scrollY > 100) {
            header.style.backgroundColor = 'rgba(252, 252, 249, 0.98)';
            header.style.backdropFilter = 'blur(20px)';
        } else {
            header.style.backgroundColor = 'rgba(252, 252, 249, 0.95)';
            header.style.backdropFilter = 'blur(10px)';
        }
    }

    // Project card interactions - FIXED
    const projectCards = document.querySelectorAll('.project__card');
    console.log(`Found ${projectCards.length} project cards`);
    
    projectCards.forEach((card, index) => {
        const viewDetailsBtn = card.querySelector('.btn--outline');
        
        if (viewDetailsBtn) {
            console.log(`Setting up project card ${index + 1} button`);
            viewDetailsBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                console.log(`Project card ${index + 1} details button clicked`);
                
                // Close other expanded cards
                projectCards.forEach(otherCard => {
                    if (otherCard !== card && otherCard.classList.contains('expanded')) {
                        otherCard.classList.remove('expanded');
                        const otherBtn = otherCard.querySelector('.btn--outline');
                        if (otherBtn && otherBtn.textContent.includes('Hide')) {
                            otherBtn.textContent = 'View Details';
                        }
                    }
                });
                
                // Toggle current card
                const isExpanded = card.classList.contains('expanded');
                card.classList.toggle('expanded');
                
                if (!isExpanded) {
                    this.textContent = 'Hide Details';
                    console.log(`Expanded project card ${index + 1}`);
                    
                    // Smooth scroll to show the full expanded card
                    setTimeout(() => {
                        card.scrollIntoView({
                            behavior: 'smooth',
                            block: 'center'
                        });
                    }, 300);
                } else {
                    this.textContent = 'View Details';
                    console.log(`Collapsed project card ${index + 1}`);
                }
            });
        } else {
            console.log(`No view details button found for project card ${index + 1}`);
        }
    });

    // Form Validation Functions
    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function validateField(field, fieldName) {
        if (!field) return false;
        
        const value = field.value.trim();
        const errorElement = document.getElementById(`${field.name}-error`);
        
        console.log(`Validating field: ${fieldName}, value: ${value ? 'has value' : 'empty'}`);
        
        // Clear previous error states
        field.classList.remove('error');
        if (errorElement) {
            errorElement.classList.remove('visible');
            errorElement.textContent = '';
        }

        // Check if field is empty
        if (!value) {
            showFieldError(field, errorElement, `${fieldName} is required.`);
            return false;
        }

        // Additional validation for email field
        if (field.type === 'email' && !validateEmail(value)) {
            showFieldError(field, errorElement, 'Please enter a valid email address.');
            return false;
        }

        // Additional validation for message length
        if (field.name === 'message' && value.length < 10) {
            showFieldError(field, errorElement, 'Message must be at least 10 characters long.');
            return false;
        }

        console.log(`Field ${fieldName} is valid`);
        return true;
    }

    function showFieldError(field, errorElement, message) {
        console.log(`Showing field error: ${message}`);
        field.classList.add('error');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.add('visible');
        }
    }

    function clearAllErrors() {
        const formControls = document.querySelectorAll('.form-control');
        const errorElements = document.querySelectorAll('.form-error');
        
        formControls.forEach(control => control.classList.remove('error'));
        errorElements.forEach(error => {
            error.classList.remove('visible');
            error.textContent = '';
        });
    }

    // EmailJS Integration - Contact Form Handling - FIXED
    const contactForm = document.getElementById('contact-form');
    console.log('Contact form found:', !!contactForm);
    
    if (contactForm) {
        // Real-time validation
        const formFields = contactForm.querySelectorAll('.form-control');
        console.log(`Found ${formFields.length} form fields`);
        
        formFields.forEach(field => {
            field.addEventListener('blur', function() {
                const fieldName = this.getAttribute('name');
                const displayName = fieldName.charAt(0).toUpperCase() + fieldName.slice(1);
                validateField(this, displayName);
            });

            // Clear error on focus
            field.addEventListener('focus', function() {
                this.classList.remove('error');
                const errorElement = document.getElementById(`${this.name}-error`);
                if (errorElement) {
                    errorElement.classList.remove('visible');
                }
            });
        });

        // Form submission with EmailJS - FIXED
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            console.log('Form submitted');
            
            // Clear any previous errors
            clearAllErrors();
            
            // Get form elements
            const nameField = document.getElementById('name');
            const emailField = document.getElementById('email');
            const subjectField = document.getElementById('subject');
            const messageField = document.getElementById('message');
            
            // Get form data
            const name = nameField ? nameField.value.trim() : '';
            const email = emailField ? emailField.value.trim() : '';
            const subject = subjectField ? subjectField.value.trim() : '';
            const message = messageField ? messageField.value.trim() : '';

            console.log('Form data:', { name: !!name, email: !!email, subject: !!subject, message: !!message });

            // Validate all fields
            const nameValid = validateField(nameField, 'Name');
            const emailValid = validateField(emailField, 'Email');
            const subjectValid = validateField(subjectField, 'Subject');
            const messageValid = validateField(messageField, 'Message');

            console.log('Validation results:', { nameValid, emailValid, subjectValid, messageValid });

            // If validation fails, don't proceed
            if (!nameValid || !emailValid || !subjectValid || !messageValid) {
                showNotification('Please fix the errors above before submitting.', 'error');
                return;
            }

            // Get form elements for button state
            const submitBtn = document.getElementById('submit-btn');
            const btnText = submitBtn ? submitBtn.querySelector('.btn-text') : null;
            const btnSpinner = submitBtn ? submitBtn.querySelector('.btn-spinner') : null;
            
            console.log('Button elements found:', { submitBtn: !!submitBtn, btnText: !!btnText, btnSpinner: !!btnSpinner });
            
            // Show loading state
            if (btnText) btnText.classList.add('hidden');
            if (btnSpinner) btnSpinner.classList.remove('hidden');
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.style.opacity = '0.7';
            }

            // Check if EmailJS is configured
            const isConfigured = EMAILJS_CONFIG.serviceID !== 'YOUR_SERVICE_ID' && 
                               EMAILJS_CONFIG.templateID !== 'YOUR_TEMPLATE_ID';

            try {
                if (!isConfigured) {
                    console.log('EmailJS not configured, showing demo behavior');
                    
                    // Simulate processing time for demo
                    await new Promise(resolve => setTimeout(resolve, 2000));
                    
                    showNotification('Demo: Message would be sent successfully! Please configure EmailJS for actual email sending.', 'success');
                    contactForm.reset();
                    clearAllErrors();
                } else {
                    // Check if EmailJS is available
                    if (typeof emailjs === 'undefined') {
                        throw new Error('EmailJS library not loaded');
                    }

                    console.log('Sending email via EmailJS...');

                    // Prepare template parameters for EmailJS
                    const templateParams = {
                        from_name: name,
                        from_email: email,
                        subject: subject,
                        message: message,
                        reply_to: email
                    };

                    // Send email using EmailJS
                    const response = await emailjs.send(
                        EMAILJS_CONFIG.serviceID,
                        EMAILJS_CONFIG.templateID,
                        templateParams
                    );

                    console.log('EmailJS Response:', response);

                    // Show success message
                    showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
                    
                    // Reset form after successful submission
                    contactForm.reset();
                    clearAllErrors();
                }
            } catch (error) {
                console.error('EmailJS Error:', error);
                
                // Show error message based on error type
                let errorMessage = 'Failed to send message. Please try again or contact me directly.';
                
                if (error.status === 400) {
                    errorMessage = 'Invalid form data. Please check your inputs and try again.';
                } else if (error.status === 401) {
                    errorMessage = 'Email service configuration error. Please contact the site administrator.';
                } else if (error.status === 413) {
                    errorMessage = 'Message is too long. Please shorten your message and try again.';
                }
                
                showNotification(errorMessage, 'error');
            } finally {
                // Reset button state
                if (btnText) btnText.classList.remove('hidden');
                if (btnSpinner) btnSpinner.classList.add('hidden');
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.style.opacity = '1';
                }
                
                console.log('Form submission completed');
            }
        });
    }

    // External links handling - FIXED
    console.log('Setting up external links...');
    
    // Handle all external links with target="_blank" or containing external domains
    const externalLinks = document.querySelectorAll('a[target="_blank"], a[href*="github"], a[href*="linkedin"]');
    console.log(`Found ${externalLinks.length} external links`);
    
    externalLinks.forEach((link, index) => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            const text = this.textContent.trim();
            
            console.log(`External link ${index + 1} clicked: ${text} (${href})`);
            
            if (href && href !== '#' && !href.startsWith('#')) {
                // Try to open the actual link
                window.open(href, '_blank');
                showNotification(`Opening ${text} in a new tab...`, 'info');
            } else {
                // Show appropriate demo message
                if (text.toLowerCase().includes('github')) {
                    showNotification('GitHub repository link would open here. Please contact for actual repository access.', 'info');
                } else if (text.toLowerCase().includes('linkedin')) {
                    showNotification('LinkedIn profile would open here.', 'info');
                } else {
                    showNotification(`${text} would open in a new tab.`, 'info');
                }
            }
        });
    });

    // Resume download functionality
    const downloadResumeBtn = document.querySelector('.hero__cta .btn--outline');
    if (downloadResumeBtn) {
        downloadResumeBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Resume download clicked');
            showNotification('Resume download would be available here. Please contact via email for the latest version.', 'info');
        });
    }

    // Skill bar animation
    function animateSkillBars() {
        const skillsSection = document.querySelector('.skills');
        const skillProgressBars = document.querySelectorAll('.skill__progress');
        
        if (!skillsSection || !skillProgressBars.length) return;
        
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
            const skillNameElement = bar.parentElement.previousElementSibling.querySelector('.skill__name');
            const skillName = skillNameElement ? skillNameElement.textContent : '';
            const width = skillLevels[skillName] || 70;
            
            bar.style.setProperty('--progress-width', width + '%');
            
            setTimeout(() => {
                bar.style.width = width + '%';
            }, index * 100);
        });
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

    // Scroll event listeners
    window.addEventListener('scroll', function() {
        updateActiveNavLink();
        updateHeaderBackground();
    });

    // Initialize scroll position
    updateActiveNavLink();
    updateHeaderBackground();

    // Skills section observer
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

    // Theme handling
    function handleThemeChange() {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
        
        function updateTheme(e) {
            if (e.matches) {
                document.documentElement.setAttribute('data-color-scheme', 'dark');
            } else {
                document.documentElement.setAttribute('data-color-scheme', 'light');
            }
        }
        
        updateTheme(prefersDark);
        prefersDark.addListener(updateTheme);
    }

    handleThemeChange();

    // EmailJS Configuration Check
    if (typeof emailjs === 'undefined') {
        console.warn('EmailJS library not loaded. Please ensure the EmailJS CDN script is included.');
    } else {
        console.log('EmailJS library loaded successfully.');
    }

    console.log('Portfolio website with EmailJS integration initialized successfully!');
});