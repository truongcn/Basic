const apiBase = "http://localhost:5283/api"

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
    // register success and call login
    const loginRes = await fetch(`${apiBase}/Auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }) // use infomation register
    });

    if (loginRes.ok) {
      const data = await loginRes.json();
      localStorage.setItem("token", data.token); // save token
      alert("Register and Login success!");
      window.location.href = "crud.html"; // next to CRUD
    } else {
      alert("Register success but can't Login!");
    }
  } else {
    const error = await res.json();
    alert("Register failed: " + (error.message || "Unknown error"));
  }
}


