// usercrud.js
const CrudModule = (() => {
  const apiBase = "http://localhost:5283/api";
  const token = localStorage.getItem("token");

  let users = [];
  let currentPage = 1;
  const pageSize = 5;

  // Tạo row
  function createRow(u) {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${u.username}</td>
      <td>${u.email}</td>
      <td>${u.passwordhash}</td>
      <td>${u.role}</td>
      <td>${u.emailconfirm}</td>
      <td>
        <button onclick='CrudModule.openPopup(${JSON.stringify(u)})' class="btn-edit">Edit</button>
        <button onclick="CrudModule.deleteUser('${u.id}')" class="btn-delete">Delete</button>
      </td>
    `;
    return row;
  }

  // Render bảng
  function renderTable() {
    const tbody = document.querySelector("#userTable tbody");
    tbody.innerHTML = "";

    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    const pageData = users.slice(start, end);

    pageData.forEach(u => tbody.appendChild(createRow(u)));
    renderPagination();
  }

  // Render phân trang
  function renderPagination() {
    const totalPages = Math.ceil(users.length / pageSize);
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
  async function loadUsers() {
    const res = await fetch(`${apiBase}/Users`, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    if (!res.ok) { alert("Failed to load"); return; }
    users = await res.json();
    renderTable();
  }

  // Mở popup add/edit
  function openPopup(user = null) {
    const popup = document.getElementById("popupForm");
    const popupTitle = document.getElementById("popupTitle");
    const hiddenId = document.getElementById("userId");
    const form = document.getElementById("userForm");

    if (user) {
      popupTitle.textContent = "Edit User";
      hiddenId.value = user.id;
      document.getElementById("username").value = user.username;
      document.getElementById("email").value = user.email;
      document.getElementById("passwordhash").value = user.passwordhash || "";
      document.getElementById("role").value = user.role;
      document.getElementById("emailconfirm").value = user.emailconfirm || "";
    } else {
      popupTitle.textContent = "Add User";
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
  async function saveUser(e) {
    e.preventDefault();
    const hiddenId = document.getElementById("userId");
    const id = hiddenId.value;

    const userData = {
      username: document.getElementById("username").value,
      email: document.getElementById("email").value,
      passwordhash: document.getElementById("passwordhash").value,
      role: document.getElementById("role").value,
      emailconfirm: document.getElementById("emailconfirm").value,
    };

    const url = id ? `${apiBase}/Users/${id}` : `${apiBase}/Users`;
    const method = id ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(userData)
    });

    if (res.ok) {
      closePopup();
      alert("Success!");
      loadUsers();
    } else {
      const err = await res.json();
      alert(err.message || "Error saving user");
    }
  }

  // Xóa
  async function deleteUser(id) {
    const ok = confirm("Do you want to delete?");
    if (!ok) return;

    const res = await fetch(`${apiBase}/Users/${id}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` }
    });

    if (res.ok) {
      alert("Success!");
      loadUsers();
    } else {
      const error = await res.json();
      alert("Delete failed: " + (error.message || "Unknown error"));
    }
  }

  // Tìm kiếm
  function searchUsers(keyword) {
    const tbody = document.querySelector("#userTable tbody");
    tbody.innerHTML = "";

    if (!keyword || keyword.trim() === "") {
      renderTable();
      return;
    }

    const filtered = users.filter(u =>
      u.username.toLowerCase().includes(keyword.toLowerCase()) ||
      u.email.toLowerCase().includes(keyword.toLowerCase()) ||
      u.role.toLowerCase().includes(keyword.toLowerCase())
    );

    if (filtered.length === 0) {
      const row = document.createElement("tr");
      row.innerHTML = `<td colspan="5">No users found</td>`;
      tbody.appendChild(row);
    } else {
      filtered.forEach(u => tbody.appendChild(createRow(u)));
    }
  }

  // Khởi tạo
  function initCrud() {
    loadUsers();

    const form = document.getElementById("userForm");
    form.removeEventListener("submit", saveUser);
    form.addEventListener("submit", saveUser);

    const closeBtn = document.getElementById("closePopup");
    if (closeBtn) closeBtn.onclick = closePopup;

    const addBtn = document.getElementById("btn-add-user");
    if (addBtn) addBtn.onclick = () => openPopup();
  }

  return { initCrud, openPopup, deleteUser, searchUsers };
})();
