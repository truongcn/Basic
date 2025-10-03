const UserCrudModule = (() => {
  const apiBase = "http://localhost:5283/api";
  const token = localStorage.getItem("token");

  let users = [];
  let currentPage = 1;
  const pageSize = 5;

  // Tạo row
  function createRow(u) {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${u.id}</td>
      <td>${u.username}</td>
      <td>${u.email}</td>
      <td>${u.role}</td>
      <td>${u.emailconfirmed ? "Confirmed" : "No"}</td>
      <td>
        <button onclick='UserCrudModule.openPopup(${JSON.stringify(u)})' class="btn-edit">Edit</button>
        <button onclick="UserCrudModule.deleteUser('${u.id}')" class="btn-delete">Delete</button>
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
  const emailConfirmRow = document.getElementById("emailConfirmRow");
  const roleRow = document.getElementById("roleRow");

  if (user) {
  popupTitle.textContent = "Edit User";
  hiddenId.value = user.id;
  document.getElementById("username").value = user.username;
  document.getElementById("email").value = user.email;
  document.getElementById("password").value = "";
  document.getElementById("role").value = user.role || "User";
  document.getElementById("emailconfirm").value = user.emailconfirm || false;

  // Hiện row
  if (emailConfirmRow) emailConfirmRow.style.display = "block";
  document.getElementById("emailconfirm").setAttribute("required", "true");

  if (roleRow) roleRow.style.display = "block";
  document.getElementById("role").setAttribute("required", "true");

} else {
  popupTitle.textContent = "Add User";
  hiddenId.value = "";
  form.reset();

  // Ẩn row
  if (emailConfirmRow) emailConfirmRow.style.display = "none";
  document.getElementById("emailconfirm").removeAttribute("required");

  if (roleRow) roleRow.style.display = "none";
  document.getElementById("role").removeAttribute("required");
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
  const username = document.getElementById("username").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value; 
  const role = document.getElementById("role").value;
  const emailConfirmed = document.getElementById("emailconfirm").checked;

const dto = { 
    id: id ? parseInt(id) : 0,
    username, 
    email, 
    password,  // gửi plain password
    role, 
    emailConfirmed 
  };

  const url = id ? `${apiBase}/Users/${id}` : `${apiBase}/Users`;
  const method = id ? "PUT" : "POST";

  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dto)
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
  function initUserCrud() {
    loadUsers();

    const form = document.getElementById("userForm");
    form.removeEventListener("submit", saveUser);
    form.addEventListener("submit", saveUser);

    const closeBtn = document.getElementById("closePopup");
    if (closeBtn) closeBtn.onclick = closePopup;

    const addBtn = document.getElementById("btn-add-user");
    if (addBtn) addBtn.onclick = () => openPopup();
  }

  return { initUserCrud, openPopup, deleteUser, searchUsers };
})();
