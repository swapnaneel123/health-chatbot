document.getElementById("signupForm").addEventListener("submit", function(event) {
    event.preventDefault();

    let password = document.getElementById("password").value;
    let confirmPassword = document.getElementById("confirmPassword").value;
    let phone = document.getElementById("phone").value;
    let age = document.getElementById("age").value;
    let height = document.getElementById("height").value;
    let weight = document.getElementById("weight").value;

    // Phone Number Validation (Only Numbers)
    let phonePattern = /^[0-9]{10}$/;
    if (!phonePattern.test(phone)) {
        alert("Please enter a valid 10-digit phone number.");
        return;
    }

    // Age Validation
    if (age < 18 || age > 100) {
        alert("Age must be between 18 and 100.");
        return;
    }

    // Height Validation
    if (height < 50 || height > 250) {
        alert("Height must be between 50 cm and 250 cm.");
        return;
    }

    // Weight Validation
    if (weight < 20 || weight > 300) {
        alert("Weight must be between 20 kg and 300 kg.");
        return;
    }

    // Password Match Validation
    if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }

    alert("Account Created Successfully!");
});

// Toggle Forms
document.getElementById("showLogin").addEventListener("click", function(event) {
    event.preventDefault();
    document.getElementById("signupFormContainer").classList.add("hidden");
    document.getElementById("loginFormContainer").classList.remove("hidden");
});

document.getElementById("showSignup").addEventListener("click", function(event) {
    event.preventDefault();
    document.getElementById("loginFormContainer").classList.add("hidden");
    document.getElementById("signupFormContainer").classList.remove("hidden");
});
