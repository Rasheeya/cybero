document.addEventListener('DOMContentLoaded', () => {

    // Header scroll background
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Intersection Observer for Reveal Animations
    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: Stop observing after it's visible if we don't want it to trigger again
                // observer.unobserve(entry.target);
            }
        });
    };

    const revealObserver = new IntersectionObserver(revealCallback, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach(el => revealObserver.observe(el));

    // --- Dynamic Counter Animation ---
    const counterSpeed = 2000;

    const animateCounter = (el) => {
        const target = +el.getAttribute('data-target');
        const suffix = el.getAttribute('data-suffix') || '';
        let startTime = null;

        const countStep = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;
            let progress = Math.min(elapsed / counterSpeed, 1);

            // Antigravity easeOutQuart
            const progressEased = 1 - Math.pow(1 - progress, 4);

            const currentVal = Math.floor(progressEased * target);
            el.innerText = currentVal + suffix;

            if (progress < 1) {
                window.requestAnimationFrame(countStep);
            } else {
                el.innerText = target + suffix;
            }
        };

        window.requestAnimationFrame(countStep);
    };

    const statSection = document.querySelector('.stats-section');
    if (statSection) {
        const statObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.querySelectorAll('.stat-number').forEach(num => animateCounter(num));
                    statObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        statObserver.observe(statSection);
    }

    // Mobile Menu Toggle (Simplified)
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            mobileToggle.classList.toggle('active');
        });
    }

    document.querySelectorAll('header .nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                mobileToggle.classList.remove('active');
            }
        });
    });

    // Smooth Scroll for Internal Links with header offset
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerHeight = header ? header.offsetHeight + 10 : 0;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                window.scrollTo({ top: targetPosition, behavior: 'smooth' });
            }
        });
    });

    // Contact Form Validation and Feedback
    const contactForm = document.getElementById('defense-contact-form');
    if (contactForm) {
        let contactStatus = contactForm.querySelector('.form-message');
        if (!contactStatus) {
            contactStatus = document.createElement('div');
            contactStatus.className = 'form-message';
            contactForm.appendChild(contactStatus);
        }

        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const fullNameInput = contactForm.querySelector('input[type="text"]');
            const emailInput = contactForm.querySelector('input[type="email"]');
            const selectInput = contactForm.querySelector('select');
            const messageInput = contactForm.querySelector('textarea');
            const btn = contactForm.querySelector('button');
            const email = emailInput.value.trim();
            const messageText = messageInput.value.trim();
            const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

            if (!fullNameInput.value.trim()) {
                contactStatus.textContent = 'Please enter your full name.';
                contactStatus.className = 'form-message error';
                fullNameInput.focus();
                return;
            }
            if (!email) {
                contactStatus.textContent = 'Please enter your email address.';
                contactStatus.className = 'form-message error';
                emailInput.focus();
                return;
            }
            if (!emailValid) {
                contactStatus.textContent = 'Please enter a valid email address.';
                contactStatus.className = 'form-message error';
                emailInput.focus();
                return;
            }
            if (!messageText) {
                contactStatus.textContent = 'Please share a brief description of your request.';
                contactStatus.className = 'form-message error';
                messageInput.focus();
                return;
            }

            contactStatus.textContent = 'Sending inquiry...';
            contactStatus.className = 'form-message success';
            btn.disabled = true;
            const originalHtml = btn.innerHTML;
            btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Sending...';

            setTimeout(() => {
                contactStatus.textContent = 'Inquiry sent successfully. We will reach out within 24 hours.';
                contactStatus.className = 'form-message success';
                btn.disabled = false;
                btn.innerHTML = originalHtml;
                contactForm.reset();
            }, 1600);
        });
    }

    // Map Section logic handled by native HTML lazy loading and global CSS.

    // Form Handling Mockup
    const newsletterForms = document.querySelectorAll('.newsletter-form');
    newsletterForms.forEach((form) => {
        const input = form.querySelector('input[type="email"]');
        let status = form.querySelector('.form-message');
        if (!status) {
            status = document.createElement('div');
            status.className = 'form-message';
            form.appendChild(status);
        }

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = form.querySelector('button');
            const email = input.value.trim();
            const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

            if (!email) {
                status.textContent = 'Please enter your email address.';
                status.className = 'form-message error';
                input.focus();
                return;
            }

            if (!emailValid) {
                status.textContent = 'Please enter a valid email address.';
                status.className = 'form-message error';
                input.focus();
                return;
            }

            status.textContent = '';
            status.className = 'form-message';
            btn.disabled = true;
            btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Securing...';

            setTimeout(() => {
                btn.innerHTML = 'Subscribed';
                status.textContent = 'Thank you! You are now on our security newsletter list.';
                status.className = 'form-message success';
                setTimeout(() => {
                    btn.disabled = false;
                    btn.innerHTML = 'Join';
                    form.reset();
                    status.textContent = '';
                    status.className = 'form-message';
                }, 1800);
            }, 900);
        });
    });
});
