const apiBase = "http://localhost:5283/api";
const token = localStorage.getItem("token");

const popup = document.getElementById("popupForm");
const closePopup = document.getElementById("closePopup");
const form = document.getElementById("studentForm");
const popupTitle = document.getElementById("popupTitle");
const hiddenId = document.getElementById("studentId"); // input hidden để lưu id khi edit

// load danh sách
async function loadStudents() {
  const res = await fetch(`${apiBase}/Students`, {
    headers: { "Authorization": `Bearer ${token}` }
  });
  if (!res.ok) { alert("Failed to load"); return; }

  const students = await res.json();
  const tbody = document.querySelector("#studentTable tbody");
  tbody.innerHTML = "";

  students.forEach(s => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${s.name}</td>
      <td>${s.phone}</td>
      <td>${s.description || ""}</td>
      <td>
        <button onclick='openPopup(${JSON.stringify(s)})' class="btn-edit">Edit</button>
        <button onclick="deleteStudent('${s.id}')" class="btn-delete">Delete</button>
      </td>`;
    tbody.appendChild(row);
  });
}

// mở popup khi bấm nút Add New Student
document.getElementById("btnShowForm").addEventListener("click", () => {
  openPopup(); // mở form ở chế độ thêm mới
});

// mở popup cho add hoặc edit
function openPopup(student = null) {
  if (student) {
    popupTitle.textContent = "Edit Student";
    hiddenId.value = student.id;
    document.getElementById("name").value = student.name;
    document.getElementById("phone").value = student.phone;
    document.getElementById("description").value = student.description || "";
  } else {
    popupTitle.textContent = "Add Student";
    hiddenId.value = "";
    form.reset();
  }
  popup.style.display = "block";
}

// đóng popup
closePopup.addEventListener("click", () => popup.style.display = "none");
window.addEventListener("click", e => { if (e.target === popup) popup.style.display = "none"; });

// submit form
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const id = hiddenId.value;
  const name = document.getElementById("name").value;
  const phone = parseInt(document.getElementById("phone").value);
  const description = document.getElementById("description").value;

  const url = id ? `${apiBase}/Students/${id}` : `${apiBase}/Students`;
  const method = id ? "PUT" : "POST";

  const res = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({ name, phone, description })
  });

  if (res.ok) {
    popup.style.display = "none";
    alert("Success!");
    loadStudents();
  } else {
    const err = await res.json();
    alert(err.message || "Error saving student");
  }
});

// xóa
async function deleteStudent(id) {
  const ok = confirm("Do you want to delete?");
  if (!ok) return;

  const res = await fetch(`${apiBase}/Students/${id}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });

  if (res.ok) {
    alert("Success!");
    loadStudents(); // tải lại danh sách
  } else {
    const error = await res.json();
    alert("Xóa thất bại: " + (error.message || "Unknown error"));
  }
}


loadStudents();
