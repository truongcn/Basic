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
        const data = await res.json();

    // ✅ lưu token trước khi redirect
    localStorage.setItem("token", data.token);

    // ✅ redirect sang index
    window.location.href = "../index.html";

    } else {
        alert("Login failed!");
    }
}



