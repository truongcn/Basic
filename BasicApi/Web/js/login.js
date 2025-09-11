const apiBase = "http://localhost:5283/api"

async function login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const res = await fetch(`${apiBase}/Auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });

    if (res.ok) {
        window.location.href = '../html/crud.html';
    } else {
        alert("Login failed!");
    }
}


async function register() {
    const username = document.getElementById("reg_username").value;
    const email = document.getElementById("reg_email").value;
    const password = document.getElementById("reg_password").value;
    const confirmPassword = document.getElementById("reg_confirm_password").value;

    // Always default to User
    const role = "User";

    const res = await fetch(`${apiBase}/Auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password, confirmPassword, role })
    });

    if (res.ok) {
        const data = await res.json();
        alert(data.message); // Should say "Registered successfully..."
    } else {
        const error = await res.json();
        alert("Register failed: " + (error.message || "Unknown error"));
    }
}



