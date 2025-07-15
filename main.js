// Enhanced Navigation
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const navbar = document.querySelector('.navbar');

if (hamburger && navLinks) {
    hamburger.addEventListener('click', (e) => {
        e.stopPropagation();
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        if (navLinks.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    });

    // Close mobile menu when clicking on a link
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Close mobile menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navLinks.classList.contains('active')) {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// Enhanced navbar scroll effect
if (navbar) {
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add scrolled class for styling
        if (scrollTop > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Hide/show navbar on scroll (optional)
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // Scrolling down
            navbar.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            // Close mobile menu if open
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                hamburger.classList.remove('active');
            }
        }
    });
});

// Scroll-triggered animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
};

const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.animate-on-scroll').forEach((el) => {
    scrollObserver.observe(el);
});

// Enhanced Form validation and submission with EmailJS
const forms = document.querySelectorAll('form');
forms.forEach(form => {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"], input[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;
        
        // Validate required fields
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                showError(field, 'This field is required');
                isValid = false;
            }
        });
        
        // Validate email format if present
        const emailField = form.querySelector('input[type="email"]');
        if (emailField) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailField.value)) {
                showError(emailField, 'Please enter a valid email address');
                isValid = false;
            }
        }
        
        if (isValid) {
            try {
                // Collect form data
                const formData = new FormData(form);
                const data = Object.fromEntries(formData);
                
                // Add timestamp and page info
                data.timestamp = new Date().toISOString();
                data.page = window.location.pathname;
                data.userAgent = navigator.userAgent;
                
                // Send email using EmailJS
                await sendEmailToFayedy(data);
                
                showSuccess('Message sent successfully! We will get back to you soon.');
                form.reset();
            } catch (error) {
                console.error('Form submission error:', error);
                showError(form, 'An error occurred while submitting the form. Please try again.');
            }
        }
        
        // Reset button state
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    });
});



// Form error handling
function showError(element, message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    
    // Remove existing error messages
    const existingError = element.parentElement.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    element.parentElement.appendChild(errorDiv);
    
    // Add error class to input
    element.classList.add('error');
    
    // Remove error after 3 seconds
    setTimeout(() => {
        errorDiv.remove();
        element.classList.remove('error');
    }, 3000);
}

// Toast notifications
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

function showSuccess(message) {
    showToast(message, 'success');
}

function showError(element, message) {
    showToast(message, 'error');
}

// Lazy loading for images
const lazyImages = document.querySelectorAll('img[data-src]');
const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            imageObserver.unobserve(img);
        }
    });
}, {
    threshold: 0.1
});

lazyImages.forEach(img => {
    imageObserver.observe(img);
});

// Navbar background change on scroll
const header = document.querySelector('.navbar');
if (header) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

// Card animations
const cards = document.querySelectorAll('.card');
cards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-5px)';
        card.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
        card.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
    });
});

// Contact form submission - Gmail Integration
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const form = e.target;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Validate required fields
        const requiredFields = ['name', 'email', 'message'];
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!data[field] || data[field].trim() === '') {
                showErrorMessage(`Please fill in the ${field} field`);
                isValid = false;
            }
        });
        
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            showErrorMessage('Please enter a valid email address');
            isValid = false;
        }
        
        if (isValid) {
            try {
                // Create Gmail mailto link with form data
                const subject = data.subject ? `Contact Form: ${data.subject}` : 'Contact Form Submission from TERRA Website';
                const body = `
Dear TERRA Team,

You have received a new contact form submission:

Name: ${data.name}
Email: ${data.email}
Company: ${data.company || 'Not provided'}
Subject: ${data.subject || 'General Inquiry'}
Message:
${data.message}

---
This message was sent from the TERRA Technologies website contact form.
Timestamp: ${new Date().toLocaleString()}
Page: ${window.location.href}
                `.trim();
                
                const mailtoLink = `mailto:fayedy7@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                
                // Open Gmail with pre-filled data
                window.open(mailtoLink);
                
                // Show success message
                showSuccessMessage('Gmail opened with your message! Please click send to complete the process.');
                
                // Add confirmation overlay in Arabic
                const confirmOverlay = document.createElement('div');
                confirmOverlay.style.position = 'fixed';
                confirmOverlay.style.top = 0;
                confirmOverlay.style.left = 0;
                confirmOverlay.style.width = '100vw';
                confirmOverlay.style.height = '100vh';
                confirmOverlay.style.background = 'rgba(0,0,0,0.6)';
                confirmOverlay.style.display = 'flex';
                confirmOverlay.style.alignItems = 'center';
                confirmOverlay.style.justifyContent = 'center';
                confirmOverlay.style.zIndex = 9999;
                confirmOverlay.innerHTML = `
                  <div style="background: #fff; padding: 2.5rem 2rem; border-radius: 18px; box-shadow: 0 8px 32px rgba(0,0,0,0.18); text-align: center; max-width: 90vw;">
                    <div style="font-size:2.2rem; color: #059669; margin-bottom: 1rem;"><i class='fas fa-check-circle'></i></div>
                    <div style="font-size:1.3rem; color:#222; font-weight:600; margin-bottom:0.5rem;">تم فتح Gmail</div>
                    <div style="font-size:1.1rem; color:#444;">من فضلك اضغط <b>إرسال</b> لإكمال العملية.</div>
                  </div>
                `;
                document.body.appendChild(confirmOverlay);
                setTimeout(() => { confirmOverlay.remove(); }, 3000);
                
                // Reset form
                form.reset();
                
            } catch (error) {
                showErrorMessage('An error occurred. Please try again or contact us directly at fayedy7@gmail.com');
            }
        }
    });
}

// Toast message functions
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

function showSuccessMessage(message) {
    showToast(message, 'success');
}

function showErrorMessage(message) {
    showToast(message, 'error');
}

// Form validation and Gmail integration for all forms
const forms2 = document.querySelectorAll('form');
forms2.forEach(form => {
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const data = Object.fromEntries(formData);
        
        // Check if this is a contact form (has name, email, message fields)
        if (data.name && data.email && data.message) {
            // Validate required fields
            const requiredFields = ['name', 'email', 'message'];
            let isValid = true;
            
            requiredFields.forEach(field => {
                if (!data[field] || data[field].trim() === '') {
                    showErrorMessage(`Please fill in the ${field} field`);
                    isValid = false;
                }
            });
            
            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(data.email)) {
                showErrorMessage('Please enter a valid email address');
                isValid = false;
            }
            
            if (isValid) {
                try {
                    // Create Gmail mailto link with form data
                    const subject = data.subject ? `Contact Form: ${data.subject}` : 'Contact Form Submission from TERRA Website';
                    const body = `
Dear TERRA Team,

You have received a new contact form submission:

Name: ${data.name}
Email: ${data.email}
Company: ${data.company || 'Not provided'}
Subject: ${data.subject || 'General Inquiry'}
Message:
${data.message}

---
This message was sent from the TERRA Technologies website contact form.
Timestamp: ${new Date().toLocaleString()}
Page: ${window.location.href}
                    `.trim();
                    
                    const mailtoLink = `mailto:fayedy7@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                    
                    // Open Gmail with pre-filled data
                    window.open(mailtoLink);
                    
                    // Show success message
                    showSuccessMessage('Gmail opened with your message! Please click send to complete the process.');
                    
                    // Add confirmation overlay in Arabic
                    const confirmOverlay = document.createElement('div');
                    confirmOverlay.style.position = 'fixed';
                    confirmOverlay.style.top = 0;
                    confirmOverlay.style.left = 0;
                    confirmOverlay.style.width = '100vw';
                    confirmOverlay.style.height = '100vh';
                    confirmOverlay.style.background = 'rgba(0,0,0,0.6)';
                    confirmOverlay.style.display = 'flex';
                    confirmOverlay.style.alignItems = 'center';
                    confirmOverlay.style.justifyContent = 'center';
                    confirmOverlay.style.zIndex = 9999;
                    confirmOverlay.innerHTML = `
                      <div style="background: #fff; padding: 2.5rem 2rem; border-radius: 18px; box-shadow: 0 8px 32px rgba(0,0,0,0.18); text-align: center; max-width: 90vw;">
                        <div style="font-size:2.2rem; color: #059669; margin-bottom: 1rem;"><i class='fas fa-check-circle'></i></div>
                        <div style="font-size:1.3rem; color:#222; font-weight:600; margin-bottom:0.5rem;">تم فتح Gmail</div>
                        <div style="font-size:1.1rem; color:#444;">من فضلك اضغط <b>إرسال</b> لإكمال العملية.</div>
                      </div>
                    `;
                    document.body.appendChild(confirmOverlay);
                    setTimeout(() => { confirmOverlay.remove(); }, 3000);
                    
                    // Reset form
                    this.reset();
                    
                } catch (error) {
                    showErrorMessage('An error occurred. Please try again or contact us directly at fayedy7@gmail.com');
                }
            }
        } else {
            // For other forms, just validate inputs
            const inputs = this.querySelectorAll('input, textarea');
            let isValid = true;
            
            inputs.forEach(input => {
                if (!input.checkValidity()) {
                    isValid = false;
                    input.classList.add('invalid');
                } else {
                    input.classList.remove('invalid');
                }
            });
            
            if (!isValid) {
                const toast = document.createElement('div');
                toast.className = 'toast-message error';
                toast.innerHTML = `
                    <div class="toast-icon">
                        <i class="fas fa-exclamation-circle"></i>
                    </div>
                    <div class="toast-content">
                        <h3>Please fix the errors</h3>
                        <p>Some fields are missing or invalid.</p>
                    </div>
                `;
                document.body.appendChild(toast);
                setTimeout(() => {
                    toast.remove();
                }, 3000);
            }
        }
    });
});

// Image lazy loading for data-src images
const dataSrcImages = document.querySelectorAll('img[data-src]');
const dataSrcImageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            dataSrcImageObserver.unobserve(img);
        }
    });
}, { threshold: 0.1 });

dataSrcImages.forEach(img => dataSrcImageObserver.observe(img));

// Scroll animations
const animateOnScroll = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
        }
    });
}, { threshold: 0.1 });

// Observe all elements with animate-on-scroll class
document.querySelectorAll('.animate-on-scroll').forEach(element => {
    animateOnScroll.observe(element);
});

// Scroll-triggered animations
const observerOptions2 = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
};

const observer2 = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions2);

// Observe all elements with animate-on-scroll class
document.querySelectorAll('.animate-on-scroll').forEach((el) => {
    observer2.observe(el);
});

// Add error handling for fetch requests
window.fetch = (url, options) => {
    return new Promise((resolve, reject) => {
        fetch(url, options)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response;
            })
            .then(resolve)
            .catch(reject);
    });
};

// Add error handling for scripts
window.onerror = function(msg, url, line, col, error) {
    console.error('Error:', {
        message: msg,
        url: url,
        line: line,
        column: col,
        error: error
    });
    return false;
};

// Add animation on scroll
const observerOptions3 = {
    threshold: 0.1
};

const observer3 = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
        }
    });
}, observerOptions3);

// Observe service cards
document.querySelectorAll('.service-card').forEach(card => {
    observer3.observe(card);
});

// Navbar background change on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';
    } else {
        navbar.style.background = 'white';
        navbar.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';
    }
});

// Add parallax effect to hero section
window.addEventListener('scroll', () => {
    const hero = document.querySelector('.hero');
    const scrolled = window.pageYOffset;
    hero.style.backgroundPositionY = `${scrolled * 0.5}px`;
});

// Add animation on scroll for expertise cards
const expertiseObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, {
    threshold: 0.1
});

document.querySelectorAll('.expertise-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    expertiseObserver.observe(card);
});

// Add hover animation for expertise cards
const expertiseCards = document.querySelectorAll('.expertise-card');
expertiseCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px) scale(1.02)';
        card.style.boxShadow = '0 10px 20px rgba(0,0,0,0.2)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
        card.style.boxShadow = '0 3px 10px rgba(0,0,0,0.1)';
    });
});

// Add animation for portfolio items
const portfolioObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, {
    threshold: 0.1
});

document.querySelectorAll('.portfolio-item').forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(20px)';
    item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    portfolioObserver.observe(item);
});

// Add interactive overlay for portfolio items
const portfolioItems = document.querySelectorAll('.portfolio-item');
portfolioItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
        const overlay = item.querySelector('.portfolio-overlay');
        overlay.style.bottom = '0';
        overlay.style.opacity = '1';
    });
    
    item.addEventListener('mouseleave', () => {
        const overlay = item.querySelector('.portfolio-overlay');
        overlay.style.bottom = '-100%';
        overlay.style.opacity = '0';
    });
});

// Add click event for view project buttons
const viewProjectButtons = document.querySelectorAll('.view-project');
viewProjectButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        e.preventDefault();
        const projectTitle = button.parentElement.querySelector('h3').textContent;
        alert(`Viewing project: ${projectTitle}`);
        // Here you would typically navigate to the project page
    });
});

// Add scroll animation for expertise details
const expertiseDetails = document.querySelectorAll('.expertise-details');
expertiseDetails.forEach(details => {
    details.style.opacity = '0';
    details.style.transform = 'translateY(20px)';
    details.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.2
    });
    
    observer.observe(details);
});

// Smooth scrolling for expertise cards
const expertiseLinks = document.querySelectorAll('.expertise-card a');
expertiseLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            
            // Add active state to clicked link
            this.classList.add('active');
            setTimeout(() => this.classList.remove('active'), 300);
        }
    });
});

// Add animation on scroll for expertise cards
const expertiseObserver2 = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            
            // Trigger staggered animations for features
            const features = entry.target.querySelectorAll('.detail-item');
            features.forEach((feature, index) => {
                setTimeout(() => {
                    feature.style.opacity = '1';
                    feature.style.transform = 'translateX(0)';
                }, index * 100);
            });
        }
    });
}, {
    threshold: 0.1
});

document.querySelectorAll('.expertise-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    expertiseObserver2.observe(card);
});

// Add interactive animations for stats section
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const stats = entry.target.querySelectorAll('.stat-item');
            stats.forEach(stat => {
                stat.style.opacity = '1';
                stat.style.transform = 'translateY(0)';
            });
        }
    });
}, {
    threshold: 0.1
});

document.querySelectorAll('.card-stats').forEach(stats => {
    stats.style.opacity = '0';
    stats.style.transform = 'translateY(20px)';
    stats.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    statsObserver.observe(stats);
});

// Badge Interactions
const badges = document.querySelectorAll('.badge');
const badgeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const badge = entry.target;
            badge.style.opacity = '1';
            badge.style.transform = 'translateX(0)';
            
            // Trigger icon animation
            const icon = badge.querySelector('.badge-icon');
            if (icon) {
                icon.style.opacity = '1';
                icon.style.transform = 'scale(1)';
            }
            
            // Trigger content animation
            const content = badge.querySelector('.badge-content');
            if (content) {
                content.style.opacity = '1';
                content.style.transform = 'translateY(0)';
            }
        }
    });
}, {
    threshold: 0.1
});

badges.forEach(badge => {
    // Initial state
    badge.style.opacity = '0';
    badge.style.transform = 'translateX(20px)';
    badge.style.transition = 'opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1), transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
    
    // Observe badge
    badgeObserver.observe(badge);
    
    // Add click animation
    badge.addEventListener('click', (e) => {
        e.preventDefault();
        badge.classList.add('active');
        
        // Create ripple effect
        const ripple = document.createElement('div');
        ripple.className = 'badge-ripple';
        badge.appendChild(ripple);
        
        // Position ripple
        const rect = badge.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        
        // Remove ripple after animation
        setTimeout(() => {
            ripple.remove();
            badge.classList.remove('active');
        }, 500);
        
        // Handle badge click actions
        const badgeType = badge.getAttribute('data-badge-type');
        handleBadgeClick(badgeType);
    });
    
    // Add hover effect
    badge.addEventListener('mouseenter', () => {
        const parentCard = badge.closest('.expertise-card');
        if (parentCard) {
            parentCard.style.transform = 'translateY(-5px) scale(1.01)';
            parentCard.style.boxShadow = '0 10px 20px rgba(0,0,0,0.2)';
        }
        
        // Add gradient overlay
        const overlay = badge.querySelector('::before');
        if (overlay) {
            overlay.style.opacity = '1';
        }
    });
    
    badge.addEventListener('mouseleave', () => {
        const parentCard = badge.closest('.expertise-card');
        if (parentCard) {
            parentCard.style.transform = 'translateY(0)';
            parentCard.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
        }
        
        // Remove gradient overlay
        const overlay = badge.querySelector('::before');
        if (overlay) {
            overlay.style.opacity = '0';
        }
    });
});

// Handle badge click actions
function handleBadgeClick(badgeType) {
    const toast = document.createElement('div');
    toast.className = 'badge-toast';
    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: var(--primary-color);
        color: white;
        padding: 1rem 2rem;
        border-radius: 10px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
        display: flex;
        align-items: center;
        gap: 1rem;
    `;
    
    // Add icon to toast
    const toastIcon = document.createElement('div');
    toastIcon.className = 'toast-icon';
    toastIcon.innerHTML = `<i class="fas fa-check-circle"></i>`;
    toast.appendChild(toastIcon);
    
    // Add message
    const message = document.createElement('div');
    message.className = 'toast-message';
    
    switch (badgeType) {
        case 'featured':
            message.textContent = 'Viewing Featured Solutions...';
            break;
        case 'enterprise':
            message.textContent = 'Enterprise Solutions Activated!';
            break;
        case 'premium':
            message.textContent = 'Premium Features Unlocked!';
            break;
    }
    
    toast.appendChild(message);
    document.body.appendChild(toast);
    
    // Remove toast after 3 seconds
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease-out';
        
        // Remove toast after animation
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Add animations for badge toast
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }

    .badge-ripple {
        position: absolute;
        width: 20px;
        height: 20px;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        transform: scale(0);
        animation: ripple 0.5s ease-out;
    }

    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Add hover animations for badges
const badges2 = document.querySelectorAll('.badge');
badges2.forEach(badge => {
    badge.addEventListener('mouseenter', () => {
        const parentCard = badge.closest('.expertise-card');
        if (parentCard) {
            parentCard.style.transform = 'translateY(-5px) scale(1.01)';
            parentCard.style.boxShadow = '0 10px 20px rgba(0,0,0,0.2)';
        }
    });
    
    badge.addEventListener('mouseleave', () => {
        const parentCard = badge.closest('.expertise-card');
        if (parentCard) {
            parentCard.style.transform = 'translateY(0)';
            parentCard.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
        }
    });
});

// Add gradient sweep animation for buttons
const ctaButtons = document.querySelectorAll('.learn-more, .start-project');
ctaButtons.forEach(button => {
    button.addEventListener('mouseenter', () => {
        const gradient = button.querySelector('::after');
        if (gradient) {
            gradient.style.left = '100%';
        }
    });
    
    button.addEventListener('mouseleave', () => {
        const gradient = button.querySelector('::after');
        if (gradient) {
            gradient.style.left = '-100%';
        }
    });
});

// Add parallax effect to card icons
const icons = document.querySelectorAll('.card-icon');
icons.forEach(icon => {
    icon.addEventListener('mousemove', (e) => {
        const rect = icon.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        icon.style.setProperty('--mouse-x', x + 'px');
        icon.style.setProperty('--mouse-y', y + 'px');
    });
});

// Add scroll animation for card titles
const titles = document.querySelectorAll('.expertise-card h3');
titles.forEach(title => {
    title.style.opacity = '0';
    title.style.transform = 'translateY(20px)';
    title.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
});

const titleObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, {
    threshold: 0.1
});

titles.forEach(title => titleObserver.observe(title));

// Solutions Page Animations
const solutionsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const element = entry.target;
            
            // Animate hero text
            if (element.classList.contains('solutions-hero')) {
                const h1 = element.querySelector('h1');
                const p = element.querySelector('p');
                
                if (h1) {
                    h1.style.opacity = '1';
                    h1.style.transform = 'translateY(0)';
                }
                
                if (p) {
                    p.style.opacity = '1';
                    p.style.transform = 'translateY(0)';
                }
            }
            
            // Animate solution cards
            if (element.classList.contains('solution-card')) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
                
                // Animate badge
                const badge = element.querySelector('.badge');
                if (badge) {
                    badge.style.opacity = '1';
                    badge.style.transform = 'translateX(0)';
                }
                
                // Animate icon
                const icon = element.querySelector('.solution-icon');
                if (icon) {
                    icon.style.opacity = '1';
                    icon.style.transform = 'scale(1)';
                }
            }
        }
    });
}, {
    threshold: 0.1
});

// Observe all solution elements
document.querySelectorAll('.solutions-hero, .solution-card').forEach(element => {
    solutionsObserver.observe(element);
});

// Solution Card Interactions
document.querySelectorAll('.solution-card').forEach(card => {
    // Click animation
    card.addEventListener('click', (e) => {
        if (e.target.closest('.learn-more')) {
            const ripple = document.createElement('div');
            ripple.className = 'solution-ripple';
            card.appendChild(ripple);
            
            // Position ripple
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;
            
            // Remove ripple after animation
            setTimeout(() => {
                ripple.remove();
            }, 500);
        }
    });
    
    // Hover effects
    card.addEventListener('mouseenter', () => {
        const icon = card.querySelector('.solution-icon');
        if (icon) {
            icon.style.transform = 'scale(1.1) rotate(5deg)';
        }
        
        const badge = card.querySelector('.badge');
        if (badge) {
            badge.style.transform = 'translateX(0) translateY(-3px)';
        }
    });
    
    card.addEventListener('mouseleave', () => {
        const icon = card.querySelector('.solution-icon');
        if (icon) {
            icon.style.transform = 'scale(1)';
        }
        
        const badge = card.querySelector('.badge');
        if (badge) {
            badge.style.transform = 'translateX(0)';
        }
    });
});

// Add ripple effect styles
const style2 = document.createElement('style');
style2.textContent = `
    .solution-ripple {
        position: absolute;
        width: 20px;
        height: 20px;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        transform: scale(0);
        animation: solutionRipple 0.5s ease-out;
    }

    @keyframes solutionRipple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style2);

// Smooth scrolling for solution links
document.querySelectorAll('.solution-card .learn-more').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const href = link.getAttribute('href');
        if (href) {
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        }
    });
});

// Add scroll event listener for header
window.addEventListener('scroll', () => {
    const header = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Solutions page specific enhancements
document.addEventListener('DOMContentLoaded', function() {
    // Add smooth scrolling to solution sections
    const solutionLinks = document.querySelectorAll('a[href^="#"]');
    solutionLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Enhanced animations for solution sections
    const solutionSections = document.querySelectorAll('.solution-section');
    const solutionSectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                
                // Animate children with delay
                const children = entry.target.querySelectorAll('.solution-details, .solution-image');
                children.forEach((child, index) => {
                    setTimeout(() => {
                        child.style.opacity = '1';
                        child.style.transform = 'translateY(0)';
                    }, index * 200);
                });
            }
        });
    }, {
        threshold: 0.2,
        rootMargin: '0px 0px -100px 0px'
    });

    solutionSections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        
        const children = section.querySelectorAll('.solution-details, .solution-image');
        children.forEach(child => {
            child.style.opacity = '0';
            child.style.transform = 'translateY(20px)';
            child.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        });
        
        solutionSectionObserver.observe(section);
    });

    // Category card interactions
    const categoryCards = document.querySelectorAll('.category-card');
    categoryCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
        
        // Add click functionality to scroll to section
        const learnMoreLink = card.querySelector('.learn-more');
        if (learnMoreLink) {
            card.addEventListener('click', function(e) {
                if (!e.target.closest('.learn-more')) {
                    const href = learnMoreLink.getAttribute('href');
                    if (href && href.startsWith('#')) {
                        e.preventDefault();
                        const targetSection = document.querySelector(href);
                        if (targetSection) {
                            const headerHeight = document.querySelector('.navbar').offsetHeight;
                            const targetPosition = targetSection.offsetTop - headerHeight - 20;
                            
                            window.scrollTo({
                                top: targetPosition,
                                behavior: 'smooth'
                            });
                        }
                    }
                }
            });
        }
    });

    // Feature card animations
    const features = document.querySelectorAll('.feature');
    features.forEach(feature => {
        feature.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(8px) scale(1.02)';
        });
        
        feature.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0) scale(1)';
        });
    });

    // Parallax effect for hero section
    const heroSection = document.querySelector('.solutions-hero');
    if (heroSection) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            heroSection.style.transform = `translateY(${rate}px)`;
        });
    }

    // Loading animation for solution images
    const solutionImages = document.querySelectorAll('.solution-image img');
    solutionImages.forEach(img => {
        img.addEventListener('load', function() {
            this.style.opacity = '1';
            this.parentElement.classList.add('loaded');
        });
        
        img.addEventListener('error', function() {
            this.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="400" height="300" fill="%23f0f0f0"/><text x="200" y="150" text-anchor="middle" fill="%23999" font-family="Arial" font-size="16">Image not available</text></svg>';
        });
    });

    // Enhanced button interactions
    const buttons = document.querySelectorAll('.btn, .cta-button, .submit-btn, .learn-more, button[type="submit"]');
    buttons.forEach(button => {
        // Add ripple effect
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });

        // Add loading state for submit buttons
        if (button.classList.contains('submit-btn') || button.type === 'submit') {
            button.addEventListener('click', function() {
                if (!this.disabled) {
                    const originalText = this.innerHTML;
                    this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
                    this.disabled = true;
                    
                    // Simulate form submission (replace with actual form handling)
                    setTimeout(() => {
                        this.innerHTML = originalText;
                        this.disabled = false;
                    }, 2000);
                }
            });
        }

        // Enhanced hover effects
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px) scale(1.02)';
            this.style.boxShadow = '0 8px 25px rgba(37, 99, 235, 0.3)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '';
        });

        // Add focus styles
        button.addEventListener('focus', function() {
            this.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.3)';
        });

        button.addEventListener('blur', function() {
            this.style.boxShadow = '';
        });

        // Add sound effect (optional - uncomment if you want sound)
        /*
        button.addEventListener('click', function() {
            const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT');
            audio.volume = 0.1;
            audio.play().catch(() => {});
        });
        */
    });

    // Add CSS for ripple effect and button enhancements
    const style = document.createElement('style');
    style.textContent = `
        .btn, .cta-button, .submit-btn, .learn-more, button[type="submit"] {
            position: relative;
            overflow: hidden;
            cursor: pointer;
            user-select: none;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
        }
        
        .ripple {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            transform: scale(0);
            animation: ripple-animation 0.6s linear;
            pointer-events: none;
            z-index: 1;
        }
        
        @keyframes ripple-animation {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }

        /* Ensure all buttons are clickable */
        button, input[type="submit"], input[type="button"], input[type="reset"] {
            cursor: pointer;
            font-family: inherit;
            font-size: inherit;
            line-height: inherit;
        }

        /* Disabled state styling */
        .btn:disabled, .cta-button:disabled, .submit-btn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            pointer-events: none;
        }

        /* Loading state */
        .btn.loading, .submit-btn.loading {
            position: relative;
            color: transparent;
        }

        .btn.loading::after, .submit-btn.loading::after {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            width: 20px;
            height: 20px;
            margin: -10px 0 0 -10px;
            border: 2px solid transparent;
            border-top: 2px solid currentColor;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        /* Enhanced focus styles for accessibility */
        .btn:focus, .cta-button:focus, .submit-btn:focus, .learn-more:focus {
            outline: none;
            box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.3);
        }

        /* Touch device optimizations */
        @media (hover: none) and (pointer: coarse) {
            .btn, .cta-button, .submit-btn, .learn-more {
                min-height: 44px;
                min-width: 44px;
            }
        }
    `;
    document.head.appendChild(style);
});
