document.addEventListener('DOMContentLoaded', () => {
    
    // 1. ANIMACIONES AL HACER SCROLL (Efecto de revelación)
    // Seleccionamos todos los elementos a los que queremos aplicar la animación
    const hiddenElements = document.querySelectorAll('.service-card, .promo-section, .care-section > div > div');
    
    // Configuramos el "observador" (Intersection Observer)
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // Si el elemento entra en la pantalla, le añadimos la clase 'show'
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
                // Opcional: dejar de observar una vez que ya apareció para mejor rendimiento
                // observer.unobserve(entry.target); 
            }
        });
    }, {
        threshold: 0.15 // El elemento debe estar 15% visible para la animación
    });

    // Le decimos al observador que vigile a cada elemento seleccionado
    hiddenElements.forEach(el => observer.observe(el));


    // 2. BARRA DE NAVEGACIÓN INTELIGENTE Y SCROLL SUAVE
    const header = document.querySelector('header');
    
    window.addEventListener('scroll', () => {
        // Si el usuario bajó más de 50px, añadimos la clase 'scrolled'
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Scroll suave para los enlaces del menú
    document.querySelectorAll('nav a[href^="#"], .service-link, .btn[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Calculamos la posición considerando la altura del header (aprox 80px)
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
  
                window.scrollTo({
                     top: offsetPosition,
                     behavior: "smooth"
                });
            }
        });
    });


    // 3. ACORDEÓN DE PREGUNTAS FRECUENTES (FAQ)
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const isOpen = question.classList.contains('active');
            
            // Obtener la respuesta asociada (el elemento siguiente en el HTML)
            const answer = question.nextElementSibling;
            
            // Si la respuesta está abierta, la cerramos (maxHeight = null)
            // Si está cerrada, calculamos su altura real para abrirla dinámicamente
            if (isOpen) {
                // Preparar para cerrar
                question.classList.remove('active');
                
                // Forzar el height exacto pixel por pixel antes de contraer
                answer.style.maxHeight = answer.scrollHeight + "px";
                void answer.offsetWidth; // Reflow para que el navegador registre la altura en píxeles
                
                // Ahora sí contraemos
                answer.style.maxHeight = "0px";
                answer.style.paddingTop = "0";
                answer.style.paddingBottom = "0";
                answer.style.overflowY = "hidden"; // Ocultar contenidos excedentes
                
                // Limpiamos los estilos en línea al finalizar
                setTimeout(() => {
                    if (!question.classList.contains('active')) {
                        answer.style.maxHeight = null;
                        answer.style.paddingTop = null;
                        answer.style.paddingBottom = null;
                    }
                }, 400); // 400ms es la transición en CSS
            } else {
                // Abrir
                question.classList.add('active');
                
                // Temporalmente limpiar altura para saber cuánto debe medir con todo el texto en esta pantalla
                answer.style.maxHeight = "none";
                answer.style.paddingTop = "1rem";
                answer.style.paddingBottom = "1.5rem";
                const neededHeight = answer.scrollHeight;
                
                // Regresar a 0 para que nazca la animación
                answer.style.paddingTop = "0";
                answer.style.paddingBottom = "0";
                answer.style.maxHeight = "0px";
                void answer.offsetWidth; // Reflow forzado
                
                // Aplicar altura final para animar
                answer.style.paddingTop = "1rem";
                answer.style.paddingBottom = "1.5rem"; 
                answer.style.maxHeight = neededHeight + "px";
                
                // Tras la animación, dejar libre para que se ajuste si el usuario voltea la pantalla
                setTimeout(() => {
                    if (question.classList.contains('active')) {
                        answer.style.maxHeight = "none";
                    }
                }, 400);
            }
        });
    });

    // Recalcular alturas correctas en caso de que cambien el tamaño de ventana o giren el celular
    window.addEventListener('resize', () => {
        document.querySelectorAll('.faq-question.active').forEach(question => {
            const answer = question.nextElementSibling;
            answer.style.maxHeight = 'none'; // reset
            answer.style.maxHeight = answer.scrollHeight + "px"; // readaptar
        });
    });

});
