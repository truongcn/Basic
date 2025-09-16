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
        <button class="btn-edit" onclick="editStudent('${s.id}', '${s.name}', ${s.phone}, '${s.description || ""}')">Edit</button>
        <button class="btn-delete" onclick="deleteStudent('${s.id}')">Delete</button>
      </td>`;
        tbody.appendChild(row);
    });
}

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
    if (!id || id.trim() === "") {
        alert("Please enter a student ID to search!");
        return;
    }

    const res = await fetch(`${apiBase}/Students/${id}`, {
        method: "GET",
        headers: { "Authorization": `Bearer ${token}` }
    });

    if (!res.ok) {
        alert("Student not found!");
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

// Lấy các phần tử
const btnShowForm = document.getElementById("btnShowForm");
const studentFormContainer = document.getElementById("studentFormContainer");
const btnCancel = document.getElementById("btnCancel");

// Khi bấm Add New Student → hiện form
btnShowForm.addEventListener("click", () => {
    studentFormContainer.style.display = "block";
});

// Khi bấm Cancel → ẩn form
btnCancel.addEventListener("click", () => {
    studentFormContainer.style.display = "none";
});

// Xử lý khi submit form
document.getElementById("studentForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const phone = document.getElementById("phone").value;
    const description = document.getElementById("description").value;

    const res = await fetch(`${apiBase}/Students`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
            name: name,
            phone: parseInt(phone),
            description: description
        })
    });

    if (res.ok) {
        alert("Student added successfully!");
        document.getElementById("studentForm").reset();
        studentFormContainer.style.display = "none"; // ẩn form sau khi thêm
        loadStudents(); // reload bảng
    } else {
        const error = await res.json();
        alert("Error: " + (error.message || "Failed to add student"));
    }
});


loadStudents();
