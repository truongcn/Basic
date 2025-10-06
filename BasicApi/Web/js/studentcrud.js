const StudentCrudModule = (() => {
  const apiBase = "http://localhost:5283/api";
  const token = localStorage.getItem("token");

  let students = [];
  let currentPage = 1;
  const pageSize = 10;

  // Tạo row
  function createRow(s) {
    const row = document.createElement("tr");
    const teacherNames = s.studentTeachers
      ?.map(st => st.teacher?.name)
      .filter(n => n) // loại bỏ null
      .join(", ") || "";
    row.innerHTML = `
      <td>${s.id}</td>
      <td>${s.name}</td>
      <td>${s.phone}</td>
      <td>${s.classes}</td>
      <td>${s.description || ""}</td>
      <td>${teacherNames}</td>
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
  if (!pagination || totalPages === 0) return;
  pagination.innerHTML = "";

  // === Tạo helper ===
  const createBtn = (text, disabled, onClick, isActive = false) => {
    const btn = document.createElement("button");
    btn.textContent = text;
    btn.disabled = disabled;
    if (isActive) btn.classList.add("active");
    if (onClick) btn.addEventListener("click", onClick);
    return btn;
  };

  // === Nút First / Prev ===
  pagination.appendChild(
    createBtn(" « ", currentPage === 1, () => {
      currentPage = 1;
      renderTable();
    })
  );
  pagination.appendChild(
    createBtn(" ‹ ", currentPage === 1, () => {
      currentPage--;
      renderTable();
    })
  );

  // === Tính phạm vi hiển thị số trang ===
  const maxVisible = 3;
  let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  let end = Math.min(totalPages, start + maxVisible - 1);
  if (end - start < maxVisible - 1) start = Math.max(1, end - maxVisible + 1);

  // === Dấu "..." bên trái ===
  if (start > 1) {
    pagination.appendChild(createBtn("1", false, () => {
      currentPage = 1;
      renderTable();
    }));
    if (start > 2) {
      const dots = document.createElement("span");
      dots.textContent = "...";
      pagination.appendChild(dots);
    }
  }

  // === Các nút số trang ===
  for (let i = start; i <= end; i++) {
    pagination.appendChild(
      createBtn(i, false, () => {
        currentPage = i;
        renderTable();
      }, i === currentPage)
    );
  }

  // === Dấu "..." bên phải ===
  if (end < totalPages) {
    if (end < totalPages - 1) {
      const dots = document.createElement("span");
      dots.textContent = "...";
      pagination.appendChild(dots);
    }
    pagination.appendChild(createBtn(totalPages, false, () => {
      currentPage = totalPages;
      renderTable();
    }));
  }

  // === Nút Next / Last ===
  pagination.appendChild(
    createBtn(" › ", currentPage === totalPages, () => {
      currentPage++;
      renderTable();
    })
  );
  pagination.appendChild(
    createBtn(" » ", currentPage === totalPages, () => {
      currentPage = totalPages;
      renderTable();
    })
  );
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
      document.getElementById("classes").value = "";
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
    const classes = document.getElementById("classes").value;
    const description = document.getElementById("description").value;

    const url = id ? `${apiBase}/Students/${id}` : `${apiBase}/Students`;
    const method = id ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ name, phone, classes, description })
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
      s.name.toLowerCase().includes(keyword.toLowerCase()) || s.classes.toLowerCase().includes(keyword.toLowerCase()) ||
      s.phone.toString().includes(keyword) ||
      (s.description && s.description.toLowerCase().includes(keyword.toLowerCase())) ||
      s.studentTeachers?.some(t => t.teacherId.toString().includes(keyword))
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
