document.addEventListener("DOMContentLoaded", () => {
    // 1. Sign In Button Click
    const signInButton = document.querySelector(".signin");
    if (signInButton) {
        signInButton.addEventListener("click", () => {
            alert("Redirecting to Sign In...");
            // You can redirect to login page here
            // window.location.href = "/login";
        });
    }

    // 2. Language Change Handler
    const langSelects = document.querySelectorAll("select#lang");
    langSelects.forEach(select => {
        select.addEventListener("change", (e) => {
            const selectedLang = e.target.value;
            alert(`Language changed to ${selectedLang}`);
            // Implement translation feature or language reload here
        });
    });

    // 3. Email Validation for Get Started buttons
    const emailInputs = document.querySelectorAll("input[type='email']");
    const submitButtons = document.querySelectorAll("button[type='submit']");

    submitButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
            emailInputs.forEach((input) => {
                const email = input.value.trim();
                if (!validateEmail(email)) {
                    alert("Please enter a valid email address.");
                } else {
                    alert(`Proceeding with ${email}`);
                    // Implement sign-up flow here
                }
            });
        });
    });

    function validateEmail(email) {
        // Basic regex for email validation
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    // 4. Trending Movies Carousel Scroll
    const scrollBtn = document.querySelector(".topmovies button");
    const movieList = document.querySelector(".topmovies");

    if (scrollBtn && movieList) {
        scrollBtn.addEventListener("click", () => {
            movieList.scrollBy({
                left: 300,
                behavior: "smooth"
            });
        });
    }

    // 5. Optional - Smooth toggle for FAQ (if needed)
    const faqCheckboxes = document.querySelectorAll(".faq .questions input[type='checkbox']");
    faqCheckboxes.forEach(checkbox => {
        checkbox.addEventListener("change", () => {
            if (checkbox.checked) {
                // Close all other questions
                faqCheckboxes.forEach(cb => {
                    if (cb !== checkbox) cb.checked = false;
                });
            }
        });
    });
});
