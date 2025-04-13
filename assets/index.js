document.addEventListener("DOMContentLoaded", () => {

    
    const langSelects = document.querySelectorAll("select#lang");
    langSelects.forEach(select => {
        select.addEventListener("change", (e) => {
            const selectedLang = e.target.value;
            alert(`Language changed to ${selectedLang}`);
            // Implement translation feature or language reload here
        });
    });

    // 3. Email Validation 
    const emailInputs = document.querySelectorAll("input[type='email']");
    const submitButtons = document.querySelectorAll("button[type='submit']");

    submitButtons.forEach((btn, index) => {
        btn.addEventListener("click", () => {
            const input = emailInputs[index];
            if (input) {
                const email = input.value.trim();
                if (!validateEmail(email)) {
                    alert("Please enter a valid email address.");
                } else {
                    alert(`Proceeding with ${email}`);
                
                }
            } else {
                alert("No corresponding email input found.");
            }
        });
    });

    function validateEmail(email) {
        // Basic regex for email validation
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

});