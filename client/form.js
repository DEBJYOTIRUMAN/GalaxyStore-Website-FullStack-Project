const token = JSON.parse(localStorage.getItem("token"));

if (token && token?.access_token) {
    window.location.href = 'home.html';
}

const sign_in_btn = document.querySelector("#sign-in-btn");
const sign_up_btn = document.querySelector("#sign-up-btn");
const container = document.querySelector(".container");

sign_up_btn.addEventListener("click", () => {
    container.classList.add("sign-up-mode");
});

sign_in_btn.addEventListener("click", () => {
    container.classList.remove("sign-up-mode");
});

document.getElementById('login-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('error-message');

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordPattern = /^[a-zA-Z0-9]{3,30}$/;

    if (!emailPattern.test(email)) {
        errorMessage.textContent = 'Invalid email address.';
        return;
    }

    if (!passwordPattern.test(password)) {
        errorMessage.textContent = 'Password must be 3-30 characters and contain only letters and numbers.';
        return;
    }

    errorMessage.textContent = '';

    const payload = {
        email: email,
        password: password
    };

    try {
        const response = await fetch('http://localhost:3000/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            const token = await response.json();

            if (!token.access_token) {
                window.alert("Login failed! Please try again later.");
                return;
            }

            localStorage.setItem("token", JSON.stringify(token));
            window.location.href = 'home.html';

        } else {
            window.alert("Login failed! Username or password is wrong!");
        }
    } catch (error) {
        window.alert("An unexpected error occurred. Please try again later.");
    }
});

document.getElementById('register-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const errorMessage = document.getElementById('register-error-message');

    const namePattern = /^[a-zA-Z ]{3,30}$/;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordPattern = /^[a-zA-Z0-9]{3,30}$/;

    if (!namePattern.test(name)) {
        errorMessage.textContent = 'Name must be 3-30 characters long and contain only letters and spaces.';
        return;
    }

    if (!emailPattern.test(email)) {
        errorMessage.textContent = 'Invalid email address.';
        return;
    }

    if (!passwordPattern.test(password)) {
        errorMessage.textContent = 'Password must be 3-30 characters and contain only letters and numbers.';
        return;
    }

    errorMessage.textContent = '';

    const payload = {
        name: name,
        email: email,
        password: password,
        repeat_password: password
    };

    try {
        const response = await fetch('http://localhost:3000/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            const token = await response.json();

            if (!token.access_token) {
                window.alert("Registration failed! Please try again later.");
                return;
            }

            localStorage.setItem("token", JSON.stringify(token));
            window.location.href = 'home.html';

        } else {
            window.alert("Registration failed! Username or password is wrong!");
        }
    } catch (error) {
        window.alert("An unexpected error occurred. Please try again later.");
    }
});