const toggleMenuState = () => {
    const mobileMenu = document.getElementById("mobileMenu");
    let isHidden = mobileMenu.classList.contains("hidden");

    if (isHidden) {
        mobileMenu.classList.remove("hidden");
        setTimeout(() => {
            mobileMenu.classList.remove("opacity-0");
            mobileMenu.classList.add("opacity-100", "flex");
        }, 10);
    } else {
        mobileMenu.classList.remove("opacity-100", "flex");
        mobileMenu.classList.add("opacity-0");
        setTimeout(() => {
            mobileMenu.classList.add("hidden");
        }, 300);
    }
};

let isDragging = false;

const startDrag = (e) => {
    // Solo permitir un toque
    if (e.type === "touchstart" && e.touches.length > 1) {
        return;
    }

    e.preventDefault();
    isDragging = true;
    document.body.style.userSelect = "none";

    const container = document.getElementById("container");
    const beforeContainer = document.getElementById("beforeContainer");
    const slider = document.getElementById("slider");
    const containerRect = container.getBoundingClientRect();
    const containerWidth = containerRect.width;

    const handleMove = (moveEvent) => {
        if (!isDragging) return;

        let clientX;
        if (moveEvent.type === "touchmove") {
            if (moveEvent.touches.length === 0) return;
            clientX = moveEvent.touches[0].clientX;
            moveEvent.preventDefault();
        } else {
            clientX = moveEvent.clientX;
        }

        // Calcular posición limitada al contenedor
        let xPos = clientX - containerRect.left;
        xPos = Math.max(0, Math.min(xPos, containerWidth));

        // Calcular porcentaje para clip-path
        const percentage = (xPos / containerWidth) * 100;

        // Aplicar clip-path
        beforeContainer.style.clipPath = `inset(0 ${100 - percentage}% 0 0)`;

        // Actualizar posición del slider
        slider.style.left = `${percentage}%`;
    };

    const handleEnd = () => {
        isDragging = false;
        document.body.style.userSelect = "";

        document.removeEventListener("mousemove", handleMove);
        document.removeEventListener("mouseup", handleEnd);
        document.removeEventListener("touchmove", handleMove);
        document.removeEventListener("touchend", handleEnd);
        document.removeEventListener("touchcancel", handleEnd);
    };

    // Agregar listeners para ambos tipos de eventos
    document.addEventListener("mousemove", handleMove);
    document.addEventListener("mouseup", handleEnd);
    document.addEventListener("touchmove", handleMove, { passive: false });
    document.addEventListener("touchend", handleEnd);
    document.addEventListener("touchcancel", handleEnd);
};

// Scroll Animation for Process Steps
const observeProcessSteps = () => {
    const steps = document.querySelectorAll(".process-step");

    const observerOptions = {
        threshold: 0.5, // Se activa/desactiva al 50% de visibilidad
        rootMargin: "0px",
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            // Obtenemos el círculo dentro del elemento observado
            const circle = entry.target.querySelector(".step-circle");
            if (!circle) return; // Salir si no se encuentra el círculo

            if (entry.isIntersecting) {
                // --- PROCESO ---
                // El elemento está entrando en la vista
                circle.classList.remove("bg-gray-300");
                circle.classList.add(
                    "bg-primary-color",
                    "scale-110",
                    "shadow-lg"
                );
            } else {
                // --- REVERSA ---
                // El elemento está saliendo de la vista (ya sea por scroll hacia arriba o hacia abajo)
                circle.classList.add("bg-gray-300");
                circle.classList.remove(
                    "bg-primary-color",
                    "scale-110",
                    "shadow-lg"
                );
            }
        });
    }, observerOptions);

    steps.forEach((step) => observer.observe(step));
};
const initMarquee = () => {
    // 1. Crear las animaciones CSS
    const style = document.createElement("style");
    style.innerHTML = `
        @keyframes slide-left {
            from { transform: translateX(0); }
            to { transform: translateX(-50%); }
        }
        @keyframes slide-right {
            from { transform: translateX(-50%); }
            to { transform: translateX(0); }
        }
    `;
    document.head.appendChild(style);

    // 2. Seleccionar las filas
    const row1 = document.getElementById("marquee-row-1");
    const row2 = document.getElementById("marquee-row-2");

    // 3. Calcular velocidad y aplicar la animación
    // (Asegurarse de que el elemento existe antes de calcular)
    if (row1) {
        // Ajusta el '150' para más velocidad (número más bajo) o menos (número más alto)
        const duration1 = row1.scrollWidth / 150;
        row1.style.animation = `slide-left ${duration1}s linear infinite`;
    }

    if (row2) {
        const duration2 = row2.scrollWidth / 150;
        row2.style.animation = `slide-right ${duration2}s linear infinite`;
    }
};

const initFAQ = () => {
    const faqQuestions = document.querySelectorAll(".faq-question");

    faqQuestions.forEach((button) => {
        button.addEventListener("click", () => {
            const item = button.closest(".faq-item");
            const answer = item.querySelector(".faq-answer");
            const icon = button.querySelector("i");

            // Comprobar si este item ya está activo
            const isActive = item.classList.contains("active");

            // Abrir o cerrar el item actual
            if (isActive) {
                // Cerrar
                item.classList.remove("active");
                answer.style.maxHeight = "0px";
                icon.style.transform = "rotate(0deg)";
            } else {
                // Abrir
                item.classList.add("active");
                // La clave: scrollHeight da la altura total del contenido
                answer.style.maxHeight = answer.scrollHeight + "px";
                icon.style.transform = "rotate(180deg)";
            }
        });
    });
};

// Initialize on page load
window.addEventListener("load", () => {
    observeProcessSteps();
    initMarquee();
    initFAQ();
});
