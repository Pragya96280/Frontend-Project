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
    document.getElementById("intern-modal").style.display = "block";
    if (!id) resetForm();
  };

  window.closeModal = () => {
    document.getElementById("intern-modal").style.display = "none";
    resetForm();
  };

  window.handleInternSubmit = function () {
    const company = document.getElementById("int-company").value.trim();
    const role = document.getElementById("int-role").value.trim();
    const notes = document.getElementById("int-notes").value.trim();
    const date = document.getElementById("int-date").value;
    const status = document.getElementById("int-status").value;

    if (!company || !role) return alert("Company and Role are required");

    let interns = JSON.parse(localStorage.getItem("anakin_internships")) || [];
    const internData = { company, role, notes, date, status };

    if (editModeId) {
      interns = interns.map((i) =>
        i.id === editModeId ? { ...internData, id: i.id } : i,
      );
    } else {
      interns.push({ ...internData, id: Date.now() });
    }

    localStorage.setItem("anakin_internships", JSON.stringify(interns));
    window.closeModal();
    window.renderInternships();
  };

  window.renderInternships = function () {
    const list = document.getElementById("intern-list");
    const interns =
      JSON.parse(localStorage.getItem("anakin_internships")) || [];

    if (interns.length === 0) {
      list.innerHTML = `<p style="text-align:center; margin-top:50px; color:#94a3b8; font-size:14px;">No applications tracked yet.</p>`;
      return;
    }

    list.innerHTML = interns
      .map(
        (i) => `
            <div class="item-list-card" onclick="window.prepareEdit(${i.id})">
                <div>
                    <span class="proj-name">${i.company}</span>
                    <div style="font-size: 12px; color: #64748b; margin-top: 2px;">${i.role}</div>
                </div>
                <span class="status-text-mini">
                    <span class="status-dot dot-${i.status}"></span>
                    ${i.status}
                </span>
            </div>
        `,
      )
      .join("");
  };

  window.prepareEdit = function (id) {
    const interns =
      JSON.parse(localStorage.getItem("anakin_internships")) || [];
    const i = interns.find((item) => item.id === id);
    if (i) {
      editModeId = id;
      document.getElementById("int-company").value = i.company;
      document.getElementById("int-role").value = i.role;
      document.getElementById("int-notes").value = i.notes;
      document.getElementById("int-date").value = i.date;
      document.getElementById("int-status").value = i.status;
      document.getElementById("submit-btn").innerText = "Update";
      document.getElementById("form-title").innerText = "Edit Entry";
      window.openModal(id);
    }
  };

  window.deleteActiveIntern = function () {
    if (!editModeId) return;
    if (!confirm("Remove this entry?")) return;
    let interns = JSON.parse(localStorage.getItem("anakin_internships")) || [];
    interns = interns.filter((i) => i.id !== editModeId);
    localStorage.setItem("anakin_internships", JSON.stringify(interns));
    window.closeModal();
    window.renderInternships();
  };

  function resetForm() {
    editModeId = null;
    ["int-company", "int-role", "int-notes", "int-date"].forEach((id) => {
      document.getElementById(id).value = "";
    });
    document.getElementById("int-status").value = "applied";
    document.getElementById("submit-btn").innerText = "Add Entry";
    document.getElementById("form-title").innerText = "New Internship";
  }

  window.onload = window.renderInternships;
})();
