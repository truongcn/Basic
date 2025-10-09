const TeacherCrudModule = (() => {
  const apiBase = "http://localhost:5283/api";
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  let teachers = [];
  let currentPage = 1;
  const pageSize = 10;

  // ======= Tạo row =======
  function createRow(t) {
    const row = document.createElement("tr");

    // Lấy danh sách student từ teacher.studentTeachers
    const studentNames = t.studentTeachers
      ?.map(st => st.student?.name)   // lấy tên student
      .filter(n => n)                 // bỏ null/undefined
      .join(", ") || "";

    row.innerHTML = `
    <td>${t.id}</td>
    <td>${t.name}</td>
    <td>${t.phone}</td>
    <td>${studentNames}</td>
    <td>
      <button onclick='TeacherCrudModule.openPopup(${JSON.stringify(t)})' class="btn-edit">Edit</button>
      <button onclick="TeacherCrudModule.deleteTeacher('${t.id}')" class="btn-delete">Delete</button>
    </td>
  `;
    return row;
  }


  // Render bảng
  function renderTable() {
    const tbody = document.querySelector("#teacherTable tbody");
    tbody.innerHTML = "";

    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    const pageData = teachers.slice(start, end);

    pageData.forEach(s => tbody.appendChild(createRow(s)));
    renderPagination();
  }

  // Render phân trang
  function renderPagination() {
  const totalPages = Math.ceil(teachers.length / pageSize);
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

  // ======= Load danh sách =======
  async function loadTeachers() {
    const res = await fetch(`${apiBase}/Teachers`, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    if (!res.ok) { alert("Failed to load"); return; }
    teachers = await res.json();
    renderTable();
  }

  // ======= Mở popup add/edit =======
  function openPopup(teacher = null) {
    const popup = document.getElementById("popupForm");
    const popupTitle = document.getElementById("popupTitle");
    const hiddenId = document.getElementById("teacherId");
    const form = document.getElementById("teacherForm");

    if (teacher) {
      popupTitle.textContent = "Edit Teacher";
      hiddenId.value = teacher.id;
      document.getElementById("name").value = teacher.name;
      document.getElementById("phone").value = teacher.phone;
      document.getElementById("studentIds").value =
        teacher.studentTeachers?.map(st => st.studentId).join(",") || "";
    } else {
      popupTitle.textContent = "Add Teacher";
      hiddenId.value = "";
      form.reset();
    }
    popup.style.display = "block";
  }

  // ======= Đóng popup =======
  function closePopup() {
    document.getElementById("popupForm").style.display = "none";
  }

  // ======= Submit form =======
  async function saveTeacher(e) {
    e.preventDefault();
    const hiddenId = document.getElementById("teacherId");
    const id = hiddenId.value;
    const name = document.getElementById("name").value;
    const phone = document.getElementById("phone").value;
    const studentIds = document.getElementById("studentIds").value
      .split(",")
      .map(s => s.trim())
      .filter(s => s)
      .map(Number);

    const dto = { name, phone, studentIds };

if (id) {   // update
  dto.id = parseInt(id);
}



    const url = id ? `${apiBase}/Teachers/${id}` : `${apiBase}/Teachers`;
    const method = id ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dto)
    });

    if (res.ok) {
      closePopup();
      alert("Success!");
      loadTeachers();
    } else {
      const err = await res.json();
      alert(err.message || "Error saving teacher");
    }
  }

  // ======= Xóa =======
  async function deleteTeacher(id) {
    const ok = confirm("Do you want to delete?");
    if (!ok) return;

    const res = await fetch(`${apiBase}/Teachers/${id}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` }
    });

    if (res.ok) {
      alert("Success!");
      loadTeachers();
    } else {
      const error = await res.json();
      alert("Delete failed: " + (error.message || "Unknown error"));
    }
  }

  // ======= Tìm kiếm =======
  function searchTeachers(keyword) {
    const tbody = document.querySelector("#teacherTable tbody");
    tbody.innerHTML = "";

    if (!keyword || keyword.trim() === "") {
      renderTable();
      return;
    }

    const filtered = teachers.filter(t =>
      t.name.toLowerCase().includes(keyword.toLowerCase()) || t.phone.toLowerCase().includes(keyword.toLowerCase()) ||
      t.studentTeachers?.some(st => st.studentId.toString().includes(keyword))
    );

    if (filtered.length === 0) {
      const row = document.createElement("tr");
      row.innerHTML = `<td colspan="5">No teachers found</td>`;
      tbody.appendChild(row);
    } else {
      filtered.forEach(t => tbody.appendChild(createRow(t)));
    }
  }

  // ======= Khởi tạo =======
  function initTeacherCrud() {
    loadTeachers();

    const form = document.getElementById("teacherForm");
    form.removeEventListener("submit", saveTeacher);
    form.addEventListener("submit", saveTeacher);

    const closeBtn = document.getElementById("closePopup");
    if (closeBtn) closeBtn.onclick = closePopup;

    const addBtn = document.getElementById("btn-add-teacher");
    if (addBtn) addBtn.onclick = () => openPopup();

      // 🔹 Ẩn các nút nếu không phải Admin
    if (role !== "Admin") {
      if (addBtn) addBtn.style.display = "none";

      // Ẩn tất cả nút Edit/Delete trong bảng
      const style = document.createElement("style");
      style.textContent = `
        .btn-edit, .btn-delete { display: none !important; }
      `;
      document.head.appendChild(style);
    }
  }

  return { initTeacherCrud, openPopup, deleteTeacher, searchTeachers };
})();
