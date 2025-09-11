const apiBase = "http://localhost:5283/api";
const token = localStorage.getItem("token");

// Load all students
async function loadStudents() {
    const res = await fetch(`${apiBase}/Students`, {
        headers: { "Authorization": `Bearer ${token}` }
    });
    if (!res.ok) {
        alert("Failed to load students");
        return;
    }
    const students = await res.json();
    const tbody = document.querySelector("#studentTable tbody");
    tbody.innerHTML = "";
    students.forEach(s => {
        const row = document.createElement("tr");
        row.innerHTML = `
      <td>${s.id}</td>
      <td>${s.name}</td>
      <td>${s.phone}</td>
      <td>${s.description || ""}</td>
      <td>
        <button onclick="deleteStudent('${s.id}')">Delete</button>
        <button onclick="editStudent('${s.id}', '${s.name}', ${s.phone}, '${s.description || ""}')">Edit</button>
      </td>`;
        tbody.appendChild(row);
    });
}

// Add student
document.getElementById("studentForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("name").value;
    const phone = parseInt(document.getElementById("phone").value);
    const description = document.getElementById("description").value;

    await fetch(`${apiBase}/Students`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, phone, description })
    });

    e.target.reset();
    loadStudents();
});

// Delete student
async function deleteStudent(id) {
    await fetch(`${apiBase}/Students/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
    });
    loadStudents();
}

// Edit student
async function editStudent(id, currentName, currentPhone, currentDesc) {
    const name = prompt("New name:", currentName);
    const phone = prompt("New phone:", currentPhone);
    const description = prompt("New description:", currentDesc);

    if (!name || !phone) return;

    await fetch(`${apiBase}/Students/${id}`, {
        method: "PUT",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, phone: parseInt(phone), description })
    });

    loadStudents();
}

// tìm 1 học sinh theo id
async function findStudent(id) {
    const res = await fetch(`${apiBase}/Students/${id}`, {
        method: "GET",
        headers: { "Authorization": `Bearer ${token}` }
    });

    if (!res.ok) {
        alert("Không tìm thấy học sinh!");
        return;
    }

    const s = await res.json(); // lấy student từ API

    // hiển thị ra bảng
    const tbody = document.querySelector("#studentTable tbody");
    tbody.innerHTML = ""; // xoá dữ liệu cũ

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${s.id}</td>
      <td>${s.name}</td>
      <td>${s.phone}</td>
      <td>${s.description || ""}</td>
      <td>
        <button class="btn-edit" onclick="editStudent('${s.id}', '${s.name}', ${s.phone}, '${s.description || ""}')">Edit</button>
        <button class="btn-delete" onclick="deleteStudent('${s.id}')">Delete</button>
      </td>`;
    tbody.appendChild(row);
}


loadStudents();
