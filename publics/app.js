const API = "/api/projects";
const projectGrid = document.querySelector("#projectGrid");
const emptyState = document.querySelector("#emptyState");
const dialog = document.querySelector("#projectDialog");
const form = document.querySelector("#projectForm");
const message = document.querySelector("#message");
const dbStatus = document.querySelector("#dbStatus");

const field = {
  id: document.querySelector("#projectId"),
  name: document.querySelector("#projectName"),
  description: document.querySelector("#projectDescription"),
  category: document.querySelector("#projectCategory"),
  status: document.querySelector("#projectStatus"),
  date: document.querySelector("#projectDate"),
  error: document.querySelector("#formError")
};

const statusLabels = { idea: "ไอเดีย", working: "กำลังทำ", done: "เสร็จแล้ว" };
const categoryLabels = { illustration: "ภาพวาด", comic: "การ์ตูน", design: "ออกแบบ", other: "อื่น ๆ" };
let projects = [];

function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, c => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  })[c]);
}

async function apiRequest(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: { "Content-Type": "application/json", ...(options.headers || {}) }
  });
  const data = await response.json().catch(() => null);
  if (!response.ok) throw new Error(data?.message || `HTTP ${response.status}`);
  return data;
}

function showMessage(text, isError = false) {
  message.textContent = text;
  message.classList.toggle("error", isError);
  if (text) {
    clearTimeout(showMessage.timer);
    showMessage.timer = setTimeout(() => { message.textContent = ""; }, 4000);
  }
}

async function updateDbStatus() {
  try {
    const result = await apiRequest("/api/health");
    if (result.database === "connected") {
      dbStatus.textContent = "● MongoDB เชื่อมต่อแล้ว";
      dbStatus.className = "db-status online";
    } else {
      dbStatus.textContent = "● ฐานข้อมูลไม่พร้อม";
      dbStatus.className = "db-status offline";
    }
  } catch {
    dbStatus.textContent = "● เซิร์ฟเวอร์ไม่ตอบสนอง";
    dbStatus.className = "db-status offline";
  }
}

function dateLabel(value) {
  if (!value) return "ยังไม่ได้กำหนดวันเป้าหมาย";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "วันที่ไม่ถูกต้อง";
  return "เป้าหมาย " + date.toLocaleDateString("th-TH", {
    day: "numeric", month: "short", year: "numeric"
  });
}

function render() {
  const status = document.querySelector("#statusFilter").value;
  const category = document.querySelector("#categoryFilter").value;
  const visible = projects.filter(project =>
    (status === "all" || project.status === status) &&
    (category === "all" || project.category === category)
  );

  document.querySelector("#allCount").textContent = projects.length;
  document.querySelector("#workingCount").textContent = projects.filter(p => p.status === "working").length;
  document.querySelector("#doneCount").textContent = projects.filter(p => p.status === "done").length;
  document.querySelector("#resultText").textContent = `แสดง ${visible.length} จาก ${projects.length} โปรเจกต์`;
  emptyState.hidden = visible.length !== 0;
  projectGrid.hidden = visible.length === 0;

  projectGrid.innerHTML = visible.map(project => `
    <article class="project-card">
      <div class="project-top">
        <h3 class="project-title">${escapeHtml(project.name)}</h3>
        <span class="tag status-${escapeHtml(project.status)}">${escapeHtml(statusLabels[project.status] || project.status)}</span>
      </div>
      <div class="project-tags"><span class="tag category-tag">${escapeHtml(categoryLabels[project.category] || project.category)}</span></div>
      <p class="project-description">${project.description ? escapeHtml(project.description) : "ยังไม่มีรายละเอียดสำหรับโปรเจกต์นี้"}</p>
      <div class="project-date">${escapeHtml(dateLabel(project.targetDate))}</div>
      <div class="project-actions">
        <button class="small-button" data-action="edit" data-id="${escapeHtml(project._id)}">แก้ไข</button>
        <button class="small-button delete" data-action="delete" data-id="${escapeHtml(project._id)}">ลบ</button>
      </div>
    </article>
  `).join("");
}

async function loadProjects() {
  try {
    projects = await apiRequest(API);
    render();
  } catch (error) {
    showMessage(`โหลดโปรเจกต์ไม่สำเร็จ: ${error.message} — ตรวจสอบว่าเซิร์ฟเวอร์และ MongoDB ทำงานอยู่`, true);
    projects = [];
    render();
  }
  await updateDbStatus();
}

function openCreateDialog() {
  form.reset();
  field.id.value = "";
  field.error.textContent = "";
  document.querySelector("#dialogHeading").textContent = "เพิ่มโปรเจกต์";
  dialog.showModal();
  field.name.focus();
}

function openEditDialog(project) {
  form.reset();
  field.id.value = project._id;
  field.name.value = project.name || "";
  field.description.value = project.description || "";
  field.category.value = project.category || "illustration";
  field.status.value = project.status || "idea";
  field.date.value = project.targetDate ? new Date(project.targetDate).toISOString().slice(0, 10) : "";
  field.error.textContent = "";
  document.querySelector("#dialogHeading").textContent = "แก้ไขโปรเจกต์";
  dialog.showModal();
  field.name.focus();
}

document.querySelector("#newProjectBtn").addEventListener("click", openCreateDialog);
document.querySelector("#emptyNewBtn").addEventListener("click", openCreateDialog);
document.querySelector("#closeDialog").addEventListener("click", () => dialog.close());
document.querySelector("#cancelDialog").addEventListener("click", () => dialog.close());
document.querySelector("#statusFilter").addEventListener("change", render);
document.querySelector("#categoryFilter").addEventListener("change", render);

form.addEventListener("submit", async event => {
  event.preventDefault();
  field.error.textContent = "";
  const id = field.id.value;
  const payload = {
    name: field.name.value.trim(),
    description: field.description.value.trim(),
    category: field.category.value,
    status: field.status.value,
    targetDate: field.date.value || null
  };

  if (!payload.name) {
    field.error.textContent = "กรุณากรอกชื่อโปรเจกต์";
    field.name.focus();
    return;
  }

  try {
    if (id) {
      await apiRequest(`${API}/${encodeURIComponent(id)}`, {
        method: "PATCH", body: JSON.stringify(payload)
      });
      showMessage("อัปเดตโปรเจกต์เรียบร้อยแล้ว");
    } else {
      await apiRequest(API, { method: "POST", body: JSON.stringify(payload) });
      showMessage("เพิ่มโปรเจกต์เรียบร้อยแล้ว");
    }
    dialog.close();
    await loadProjects();
  } catch (error) {
    field.error.textContent = error.message;
  }
});

projectGrid.addEventListener("click", async event => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;
  const project = projects.find(item => item._id === button.dataset.id);
  if (!project) return;

  if (button.dataset.action === "edit") {
    openEditDialog(project);
    return;
  }

  if (button.dataset.action === "delete") {
    if (!confirm(`ต้องการลบโปรเจกต์ “${project.name}” หรือไม่?`)) return;
    try {
      await apiRequest(`${API}/${encodeURIComponent(project._id)}`, { method: "DELETE" });
      showMessage("ลบโปรเจกต์เรียบร้อยแล้ว");
      await loadProjects();
    } catch (error) {
      showMessage(`ลบไม่สำเร็จ: ${error.message}`, true);
    }
  }
});

loadProjects();
