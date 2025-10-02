const StudentCrudModule = (() => {
  const apiBase = "http://localhost:5283/api";
  const token = localStorage.getItem("token");

  let students = [];
  let currentPage = 1;
  const pageSize = 5;

  // Tạo row
  function createRow(s) {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${s.name}</td>
      <td>${s.phone}</td>
      <td>${s.description || ""}</td>
      <td>
        <button onclick='StudentCrudModule.openPopup(${JSON.stringify(s)})' class="btn-edit">Edit</button>
        <button onclick="StudentCrudModule.deleteStudent('${s.id}')" class="btn-delete">Delete</button>
      </td>
    `;
    return row;
  }

  // Render bảng
  function renderTable() {
    const tbody = document.querySelector("#studentTable tbody");
    tbody.innerHTML = "";

    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    const pageData = students.slice(start, end);

    pageData.forEach(s => tbody.appendChild(createRow(s)));
    renderPagination();
  }

  // Render phân trang
  function renderPagination() {
    const totalPages = Math.ceil(students.length / pageSize);
    const pagination = document.getElementById("pagination");
    if (!pagination) return;
    pagination.innerHTML = "";

    for (let i = 1; i <= totalPages; i++) {
      const btn = document.createElement("button");
      btn.textContent = i;
      btn.className = (i === currentPage) ? "active" : "";
      btn.addEventListener("click", () => {
        currentPage = i;
        renderTable();
      });
      pagination.appendChild(btn);
    }
  }

  // Load danh sách
  async function loadStudents() {
    const res = await fetch(`${apiBase}/Students`, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    if (!res.ok) { alert("Failed to load"); return; }
    students = await res.json();
    renderTable();
  }

  // Mở popup add/edit
  function openPopup(student = null) {
    const popup = document.getElementById("popupForm");
    const popupTitle = document.getElementById("popupTitle");
    const hiddenId = document.getElementById("studentId");
    const form = document.getElementById("studentForm");

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

  // Đóng popup
  function closePopup() {
    document.getElementById("popupForm").style.display = "none";
  }

  // Submit form
  async function saveStudent(e) {
    e.preventDefault();
    const hiddenId = document.getElementById("studentId");
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
      closePopup();
      alert("Success!");
      loadStudents();
    } else {
      const err = await res.json();
      alert(err.message || "Error saving student");
    }
  }

  // Xóa
  async function deleteStudent(id) {
    const ok = confirm("Do you want to delete?");
    if (!ok) return;

    const res = await fetch(`${apiBase}/Students/${id}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` }
    });

    if (res.ok) {
      alert("Success!");
      loadStudents();
    } else {
      const error = await res.json();
      alert("Delete failed: " + (error.message || "Unknown error"));
    }
  }

  // Tìm kiếm
  function searchStudents(keyword) {
    const tbody = document.querySelector("#studentTable tbody");
    tbody.innerHTML = "";

    // Nếu không nhập gì -> chỉ load lại toàn bộ bằng renderTable
    if (!keyword || keyword.trim() === "") {
      renderTable();
      return;
    }
    const filtered = students.filter(s =>
      s.name.toLowerCase().includes(keyword.toLowerCase()) ||
      s.phone.toString().includes(keyword) ||
      (s.description && s.description.toLowerCase().includes(keyword.toLowerCase()))
    );

    if (filtered.length === 0) {
      const row = document.createElement("tr");
      row.innerHTML = `<td colspan="4">No students found</td>`;
      tbody.appendChild(row);
    } else {
      filtered.forEach(s => tbody.appendChild(createRow(s)));
    }
  }

  // Khởi tạo
  function initStudentCrud() {
    loadStudents();

    const form = document.getElementById("studentForm");
    form.removeEventListener("submit", saveStudent);
    form.addEventListener("submit", saveStudent);

    const closeBtn = document.getElementById("closePopup");
    if (closeBtn) closeBtn.onclick = closePopup;

    const addBtn = document.getElementById("btn-add-student");
    if (addBtn) addBtn.onclick = () => openPopup();
  }

  return { initStudentCrud, openPopup, deleteStudent, searchStudents };
})();
