// chạy khi tải trang
window.onload = () => {
    const token = localStorage.getItem("token");

    // Nếu chưa login thì quay về login.html
    if (!token) {
        window.location.href = "../html/login.html";
        return;
    }

    // Nếu có token thì hiện nút logout
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
        logoutBtn.style.display = "block";
        logoutBtn.addEventListener("click", logout);
    }
};

// Hàm logout
function logout() {
    localStorage.removeItem("token");
    window.location.href = "../html/login.html";
}

function showPage(pageId) {
    document.querySelectorAll(".page").forEach(div => div.style.display = "none");
    document.getElementById(pageId).style.display = "block";
}

// Load trang con vào content
async function loadPage(page) {
    try {
        const res = await fetch(page);
        const html = await res.text();
        document.getElementById("content").innerHTML = html;

        // Nếu load CRUD thì reset script crud.js
        if (page.includes("crud.html")) {
            if (typeof CrudModule === "undefined") {
                const script = document.createElement("script");
                script.src = "../js/crud.js";
                script.onload = () => CrudModule.initCrud();
                document.body.appendChild(script);
            } else {
                CrudModule.initCrud();
            }
        }


    } catch (err) {
        console.error("Error loading page:", err);
    }
}