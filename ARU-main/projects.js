let editModeId = null;

(function () {
  window.toggleSidebar = () =>
    document.getElementById("sidebar").classList.toggle("open");

  // CLICK OUTSIDE TO CLOSE SIDEBAR
  document.addEventListener("click", function (event) {
    const sidebar = document.getElementById("sidebar");
    const menuTrigger = document.querySelector(".menu-trigger");
    if (
      sidebar.classList.contains("open") &&
      !sidebar.contains(event.target) &&
      !menuTrigger.contains(event.target)
    ) {
      window.toggleSidebar();
    }
  });

  window.openModal = (id = null) => {
    document.getElementById("project-modal").style.display = "block";
    document.getElementById("delete-btn-modal").style.display = id
      ? "block"
      : "none";
    if (!id) resetForm();
  };

  window.closeModal = () => {
    document.getElementById("project-modal").style.display = "none";
    resetForm();
  };

  window.handleProjectSubmit = function () {
    const title = document.getElementById("proj-title").value.trim();
    const tech = document.getElementById("proj-tech").value.trim();
    const todos = document.getElementById("proj-todos").value.trim();
    const start = document.getElementById("proj-start").value;
    const end = document.getElementById("proj-end").value;
    const status = document.getElementById("proj-status").value;

    if (!title) return alert("Title required");

    let projects = JSON.parse(localStorage.getItem("anakin_projects")) || [];
    const projectData = {
      title,
      tech,
      todos,
      start,
      end: end || "Present",
      status,
    };

    if (editModeId) {
      projects = projects.map((p) =>
        p.id === editModeId ? { ...projectData, id: p.id } : p,
      );
    } else {
      projects.push({ ...projectData, id: Date.now() });
    }

    localStorage.setItem("anakin_projects", JSON.stringify(projects));
    window.closeModal();
    window.renderProjects();
  };

  window.renderProjects = function () {
    const list = document.getElementById("project-list");
    const projects = JSON.parse(localStorage.getItem("anakin_projects")) || [];

    if (projects.length === 0) {
      list.innerHTML = `<p style="text-align:center; margin-top:50px; color:#94a3b8; font-size:14px;">No projects yet.</p>`;
      return;
    }

    list.innerHTML = projects
      .map(
        (p) => `
            <div class="item-list-card" onclick="window.prepareEdit(${p.id})">
                <span class="proj-name">${p.title}</span>
                <span class="status-text-mini">
                    <span class="status-dot dot-${p.status}"></span>
                    ${p.status.replace("-", " ")}
                </span>
            </div>
        `,
      )
      .join("");
  };

  window.prepareEdit = function (id) {
    const projects = JSON.parse(localStorage.getItem("anakin_projects")) || [];
    const p = projects.find((proj) => proj.id === id);
    if (p) {
      editModeId = id;
      document.getElementById("proj-title").value = p.title;
      document.getElementById("proj-tech").value = p.tech;
      document.getElementById("proj-todos").value = p.todos;
      document.getElementById("proj-start").value = p.start;
      document.getElementById("proj-end").value =
        p.end === "Present" ? "" : p.end;
      document.getElementById("proj-status").value = p.status;
      document.getElementById("submit-btn").innerText = "Update";
      document.getElementById("form-title").innerText = "Project Details";
      window.openModal(id);
    }
  };

  window.deleteActiveProject = function () {
    if (!editModeId) return;
    if (!confirm("Delete this project?")) return;
    let projects = JSON.parse(localStorage.getItem("anakin_projects")) || [];
    projects = projects.filter((p) => p.id !== editModeId);
    localStorage.setItem("anakin_projects", JSON.stringify(projects));
    window.closeModal();
    window.renderProjects();
  };

  function resetForm() {
    editModeId = null;
    ["proj-title", "proj-tech", "proj-todos", "proj-start", "proj-end"].forEach(
      (id) => {
        document.getElementById(id).value = "";
      },
    );
    document.getElementById("proj-status").value = "not-started";
    document.getElementById("submit-btn").innerText = "Create Project";
    document.getElementById("form-title").innerText = "New Project";
  }

  window.onload = window.renderProjects;
})();
