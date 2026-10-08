// ====== STORAGE ======
// We use localStorage so data stays saved on your phone
const STORAGE_KEY = "eag_students";

let students = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
let editingId = null;

// ====== ELEMENTS ======
const form = document.getElementById("student-form");
const formTitle = document.getElementById("form-title");
const saveBtn = document.getElementById("save-btn");
const cancelBtn = document.getElementById("cancel-btn");
const studentList = document.getElementById("student-list");
const searchInput = document.getElementById("search");
const countEl = document.getElementById("count");

// ====== SAVE TO STORAGE ======
function saveToStorage() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
}

// ====== RENDER LIST ======
function renderStudents(filter = "") {
  const q = filter.toLowerCase().trim();
  const filtered = students.filter(s =>
    s.name.toLowerCase().includes(q) ||
    s.school.toLowerCase().includes(q)
  );

  countEl.textContent = `Total students: ${students.length}`;

  if (filtered.length === 0) {
    studentList.innerHTML = `<p class="empty">No students found.</p>`;
    return;
  }

  studentList.innerHTML = filtered.map(s => `
    <div class="student-card">
      <h3>${escapeHtml(s.name)} <span class="badge">${escapeHtml(s.level || "N/A")}</span></h3>
      <p>🏫 ${escapeHtml(s.school)}</p>
      ${s.program ? `<p>📚 ${escapeHtml(s.program)}</p>` : ""}
      ${s.year ? `<p>📅 ${escapeHtml(s.year)}</p>` : ""}
      ${s.gender ? `<p>👤 ${escapeHtml(s.gender)}</p>` : ""}
      ${s.phone ? `<p>📞 ${escapeHtml(s.phone)}</p>` : ""}
      ${s.address ? `<p>📍 ${escapeHtml(s.address)}</p>` : ""}
      <div class="card-actions">
        <button class="edit-btn" onclick="editStudent('${s.id}')">Edit</button>
        <button class="delete-btn" onclick="deleteStudent('${s.id}')">Delete</button>
      </div>
    </div>
  `).join("");
}

// Prevent HTML injection
function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, m => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[m]));
}

// ====== ADD / UPDATE ======
form.addEventListener("submit", e => {
  e.preventDefault();

  const data = {
    name: document.getElementById("name").value.trim(),
    phone: document.getElementById("phone").value.trim(),
    gender: document.getElementById("gender").value,
    level: document.getElementById("level").value,
    school: document.getElementById("school").value.trim(),
    program: document.getElementById("program").value.trim(),
    year: document.getElementById("year").value.trim(),
    address: document.getElementById("address").value.trim(),
  };

  if (editingId) {
    // Update
    students = students.map(s => s.id === editingId ? { ...s, ...data } : s);
    editingId = null;
    formTitle.textContent = "Add New Student";
    saveBtn.textContent = "Save Student";
    cancelBtn.style.display = "none";
  } else {
    // Add
    data.id = Date.now().toString();
    students.push(data);
  }

  saveToStorage();
  form.reset();
  renderStudents(searchInput.value);
});

// ====== EDIT ======
function editStudent(id) {
  const s = students.find(x => x.id === id);
  if (!s) return;

  document.getElementById("name").value = s.name;
  document.getElementById("phone").value = s.phone;
  document.getElementById("gender").value = s.gender;
  document.getElementById("level").value = s.level;
  document.getElementById("school").value = s.school;
  document.getElementById("program").value = s.program;
  document.getElementById("year").value = s.year;
  document.getElementById("address").value = s.address;

  editingId = id;
  formTitle.textContent = "Edit Student";
  saveBtn.textContent = "Update Student";
  cancelBtn.style.display = "block";

  window.scrollTo({ top: 0, behavior: "smooth" });
}

// ====== DELETE ======
function deleteStudent(id) {
  if (!confirm("Are you sure you want to delete this student?")) return;
  students = students.filter(s => s.id !== id);
  saveToStorage();
  renderStudents(searchInput.value);
}

// ====== CANCEL EDIT ======
cancelBtn.addEventListener("click", () => {
  form.reset();
  editingId = null;
  formTitle.textContent = "Add New Student";
  saveBtn.textContent = "Save Student";
  cancelBtn.style.display = "none";
});

// ====== SEARCH ======
searchInput.addEventListener("input", e => renderStudents(e.target.value));

// ====== INITIAL RENDER ======
renderStudents();
