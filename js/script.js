document.addEventListener('DOMContentLoaded', () => {
    
    // ---------------------------------------------------------
    // 0. CUSTOM CURSOR
    // ---------------------------------------------------------
    const cursor = document.createElement('div');
    const cursorOutline = document.createElement('div');
    cursor.className = 'custom-cursor';
    cursorOutline.className = 'custom-cursor-outline';
    document.body.appendChild(cursor);
    document.body.appendChild(cursorOutline);

    document.addEventListener('mousemove', (e) => {
        gsap.to(cursor, {
            x: e.clientX,
            y: e.clientY,
            duration: 0.15,
            ease: "power2.out"
        });
        gsap.to(cursorOutline, {
            x: e.clientX,
            y: e.clientY,
            duration: 0.4,
            ease: "power2.out"
        });
    });

    const clickables = document.querySelectorAll('a, button, .btn, .faq-question, .service-card, .ba-slider');
    clickables.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('hover');
            cursorOutline.classList.add('hover');
        });
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('hover');
            cursorOutline.classList.remove('hover');
        });
    });

    
    // ---------------------------------------------------------
    // 1. INICIALIZACIÓN DE LENIS (Scroll Suave con Inercia)
    // ---------------------------------------------------------
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Función de suavizado estándar
        smoothWheel: true
    });

    // Sincronizar Lenis con GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);


    // ---------------------------------------------------------
    // 2. BARRA DE NAVEGACIÓN INTELIGENTE (Efecto Glassmorphism)
    // ---------------------------------------------------------
    const header = document.querySelector('header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 15) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Scroll suave mejorado (usando Lenis)
    document.querySelectorAll('nav a, .service-link, .btn').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            // Si el enlace no es un ancla interna o es a otra página, dejamos que el navegador lo maneje
            if (!targetId || !targetId.startsWith('#')) return;

            // Si es un ancla interna
            e.preventDefault();
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                lenis.scrollTo(targetElement, {
                    offset: -80,
                    duration: 1.5
                });
            }
        });
    });


    // ---------------------------------------------------------
    // 3. ANIMACIONES PREMIUM CON GSAP (ScrollTrigger)
    // ---------------------------------------------------------
    
    // Registro de plugin
    gsap.registerPlugin(ScrollTrigger);

    // Animación de aparición para las tarjetas y secciones
    const revealElements = document.querySelectorAll('.service-card, .promo-section, .care-section > div > div, .faq-item, .before-after-container, .testimonial-card, .contact-info, .contact-form-wrapper, .profile-block, .treatment-detail-block, .page-hero');
    
    revealElements.forEach((el) => {
        gsap.from(el, {
            scrollTrigger: {
                trigger: el,
                start: "top 85%",
                toggleActions: "play none none none"
            },
            y: 40,
            opacity: 0,
            duration: 1,
            ease: "power3.out"
        });
    });

    // Animación de entrada para el Hero (Título e Imagen)
    gsap.from('.hero-content h1', {
        opacity: 0,
        x: -50,
        duration: 1.2,
        delay: 0.2,
        ease: "power3.out"
    });

    gsap.from('.hero-image', {
        opacity: 0,
        scale: 0.9,
        duration: 1.5,
        delay: 0.4,
        ease: "expo.out"
    });


    // ---------------------------------------------------------
    // 4. ACORDEÓN DE PREGUNTAS FRECUENTES (FAQ)
    // ---------------------------------------------------------
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const isOpen = question.classList.contains('active');
            const answer = question.nextElementSibling;
            
            // Cerramos otros abiertos (opcional, para limpieza)
            if (!isOpen) {
                document.querySelectorAll('.faq-question.active').forEach(q => {
                    q.classList.remove('active');
                    gsap.to(q.nextElementSibling, { maxHeight: 0, paddingBottom: 0, duration: 0.4 });
                });
            }

            if (isOpen) {
                question.classList.remove('active');
                gsap.to(answer, { maxHeight: 0, paddingBottom: 0, duration: 0.4, ease: "power2.inOut" });
            } else {
                question.classList.add('active');
                gsap.to(answer, { 
                    maxHeight: answer.scrollHeight + 50, 
                    paddingBottom: "1.5rem", 
                    duration: 0.5, 
                    ease: "power2.out" 
                });
            }
        });
    });

    // ---------------------------------------------------------
    // 5. BEFORE & AFTER SLIDER INTERACTION
    // ---------------------------------------------------------
    const baSlider = document.querySelector('.ba-slider');
    if (baSlider) {
        const afterImage = baSlider.querySelector('.ba-image-after');
        const handle = baSlider.querySelector('.ba-handle');

        const moveSlider = (e) => {
            const rect = baSlider.getBoundingClientRect();
            let pageX = e.pageX || (e.touches && e.touches[0].pageX);
            let x = pageX - rect.left - window.scrollX;
            
            if (x < 0) x = 0;
            if (x > rect.width) x = rect.width;

            const percentage = (x / rect.width) * 100;
            afterImage.style.clipPath = `inset(0 ${100 - percentage}% 0 0)`;
            handle.style.left = `${percentage}%`;
        };

        baSlider.addEventListener('mousemove', moveSlider);
        baSlider.addEventListener('touchmove', (e) => {
            moveSlider(e);
            e.preventDefault();
        }, { passive: false });
    }

    // ---------------------------------------------------------
    // 7. MAGNETIC BUTTONS (Premium Effect)
    // ---------------------------------------------------------
    const magneticBtns = document.querySelectorAll('.btn, .social-icon-btn, .logo img');
    
    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            gsap.to(btn, {
                x: x * 0.3,
                y: y * 0.3,
                duration: 0.3,
                ease: "power2.out"
            });
        });
        
        btn.addEventListener('mouseleave', () => {
            gsap.to(btn, {
                x: 0,
                y: 0,
                duration: 0.5,
                ease: "elastic.out(1, 0.3)"
            });
        });
    });

    const contactForm = document.getElementById('premium-contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('contact-name').value;
            const treatment = document.getElementById('contact-treatment').value;
            const message = document.getElementById('contact-message').value;
            const phone = "50684320647"; 

            const btn = contactForm.querySelector('button');
            const originalText = btn.innerText;
            btn.innerText = 'Redirigiendo a WhatsApp...';
            btn.disabled = true;

            // Formatear mensaje para WhatsApp
            let text = `Hola *Esteti'Kas*, mi nombre es *${name}*.\n\n`;
            text += `Me interesa el tratamiento: *${treatment.toUpperCase()}*.\n`;
            if (message) {
                text += `Mensaje adicional: ${message}\n`;
            }
            text += `\n_Enviado desde el sitio web._`;

            const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;

            setTimeout(() => {
                window.open(whatsappUrl, '_blank');
                btn.innerText = '¡Solicitud Abierta!';
                btn.style.backgroundColor = '#28a745';
                btn.style.borderColor = '#28a745';
                contactForm.reset();
                
                setTimeout(() => {
                    btn.innerText = originalText;
                    btn.disabled = false;
                    btn.style.backgroundColor = '';
                    btn.style.borderColor = '';
                }, 3000);
            }, 800);
        });
    }

    // ---------------------------------------------------------
    // 8. PARALLAX EFFECTS
    // ---------------------------------------------------------
    gsap.to(".hero-image", {
        scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            scrub: true
        },
        y: 100,
        ease: "none"
    });

    const parallaxImages = document.querySelectorAll('.promo-section img');
    parallaxImages.forEach(img => {
        gsap.to(img, {
            scrollTrigger: {
                trigger: img,
                start: "top bottom",
                scrub: true
            },
            y: -50,
            ease: "none"
        });
    });

    // ---------------------------------------------------------
    // 9. PAGE ENTRANCE TRANSITION
    // ---------------------------------------------------------
    gsap.from("body", {
        opacity: 0,
        duration: 1,
        ease: "power2.inOut"
    });

});


