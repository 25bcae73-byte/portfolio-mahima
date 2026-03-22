
// Scroll to Contact
const contactBtn = document.getElementById("contactBtn");
if (contactBtn) {
    contactBtn.addEventListener("click", () => {
        document.getElementById("contact").scrollIntoView({ behavior: "smooth" });
    });
}

// Scroll Reveal Animation (Adding Intersection Observer)
const observerOptions = {
    threshold: 0.15
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // Stop tracking once it is visible to save resources
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Grab all sections and the hero content, make them initially faded, and observe them
document.querySelectorAll('.section-container, .hero-content').forEach((el) => {
    el.classList.add('fade-in');
    observer.observe(el);
});

// Contact Form Submission
document.getElementById("contactForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const message = document.getElementById("message").value;
    const submitBtn = this.querySelector("button[type='submit']");

    try {
        submitBtn.textContent = "Sending...";
        submitBtn.disabled = true;

        const response = await fetch("/api/contact", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name, email, message })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Failed to connect to backend");
        }

        alert("Message sent successfully!");
        this.reset();
    } catch (error) {
        console.error("Error from backend: ", error);
        alert("Backend Error: " + error.message + "\n(Check the VS Code terminal for more details!)");
    } finally {
        submitBtn.textContent = "Send Message";
        submitBtn.disabled = false;
    }
});

// Mobile Navigation Toggle
const hamburger = document.querySelector(".hamburger");
const navLinks = document.querySelector(".nav-links");

if (hamburger) {
    hamburger.addEventListener("click", () => {
        navLinks.classList.toggle("active");
    });
}

// Close menu when a link is clicked
document.querySelectorAll(".nav-links a").forEach(link => {
    link.addEventListener("click", () => {
        navLinks.classList.remove("active");
    });
});
