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
        const token = data.token;
        localStorage.setItem("token", token);

        // 🔹 Giải mã phần payload của token để lấy role
        const payload = JSON.parse(atob(token.split(".")[1]));
        const role = payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
        localStorage.setItem("role", role);

        // ✅ Redirect
        window.location.href = "../index.html";

    } else {
        alert("Login failed!");
    }
}



