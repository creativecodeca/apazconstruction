document.addEventListener('DOMContentLoaded', () => {
    const nav = document.querySelector('nav');
    const reveals = document.querySelectorAll('.reveal');
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    // Mobile Menu Toggle
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // Close menu when clicking a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }

    // Scroll effect for Navbar
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });

    // Scroll Reveal Animation
    const revealOnScroll = () => {
        reveals.forEach(reveal => {
            const windowHeight = window.innerHeight;
            const revealTop = reveal.getBoundingClientRect().top;
            const revealPoint = 150;

            if (revealTop < windowHeight - revealPoint) {
                reveal.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Run once on load

    // --- Tile Master CAPTCHA Logic ---
    const draggableTile = document.getElementById('tile-to-drag');
    const dropZone = document.getElementById('drop-zone');
    const submitBtn = document.getElementById('submit-btn');
    const successMsg = document.getElementById('captcha-success');

    if (draggableTile && dropZone) {
        draggableTile.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', 'tile');
        });

        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZone.style.background = '#334155'; // Darken on hover
        });

        dropZone.addEventListener('dragleave', () => {
            dropZone.style.background = '#475569';
        });

        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            const data = e.dataTransfer.getData('text/plain');
            if (data === 'tile') {
                // Success!
                dropZone.appendChild(draggableTile);
                draggableTile.setAttribute('draggable', 'false');
                draggableTile.style.cursor = 'default';
                dropZone.style.background = '#fff';
                dropZone.style.border = 'none';

                // Show success and enable button
                successMsg.style.display = 'block';
                submitBtn.removeAttribute('disabled');
            }
        });
    }

    // --- Form Submission Logic ---
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const formData = new FormData(contactForm);
            const submitBtnText = submitBtn.textContent;

            // Loading state
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';
            formStatus.style.display = 'none';

            try {
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    formStatus.textContent = "Thanks! Your message has been sent successfully. Almas will get back to you soon.";
                    formStatus.style.background = '#dcfce7';
                    formStatus.style.color = '#166534';
                    formStatus.style.display = 'block';
                    contactForm.reset();
                    submitBtn.textContent = 'Sent!';

                    // Reset captcha if needed, but usually just keep it done
                } else {
                    const data = await response.json();
                    throw new Error(data.errors ? data.errors[0].message : "Submission failed");
                }
            } catch (error) {
                formStatus.textContent = "Oops! Product submission failed. Please try again or call us directly.";
                formStatus.style.background = '#fee2e2';
                formStatus.style.color = '#991b1b';
                formStatus.style.display = 'block';
                submitBtn.disabled = false;
                submitBtn.textContent = submitBtnText;
            }
        });
    }
});
