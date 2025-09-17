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



