let editModeId = null;

const skillLibrary = [
  { name: "React", cat: "frontend" },
  { name: "TypeScript", cat: "frontend" },
  { name: "Tailwind CSS", cat: "frontend" },
  { name: "Node.js", cat: "backend" },
  { name: "Python", cat: "backend" },
  { name: "PostgreSQL", cat: "backend" },
  { name: "Java", cat: "backend" },
  { name: "Docker", cat: "devops" },
  { name: "AWS", cat: "devops" },
  { name: "Git", cat: "devops" },
  { name: "Figma", cat: "frontend" },
  { name: "Communication", cat: "soft" },
  { name: "Prompt Engineering", cat: "soft" },
  { name: "PyTorch / TensorFlow", cat: "backend" },
  { name: "LLM Integration", cat: "backend" },
  { name: "React Native", cat: "frontend" },
  { name: "Flutter", cat: "frontend" },
  { name: "Next.js", cat: "frontend" },
  { name: "Three.js (3D)", cat: "frontend" },
  { name: "Go (Golang)", cat: "backend" },
  { name: "Rust", cat: "backend" },
  { name: "Redis", cat: "backend" },
  { name: "GraphQL", cat: "backend" },
  { name: "Terraform (IaC)", cat: "devops" },
  { name: "CI/CD Pipelines", cat: "devops" },
  { name: "Cybersecurity Basics", cat: "devops" },
  { name: "Serverless (Lambda)", cat: "devops" },
  { name: "Agile / Scrum", cat: "soft" },
  { name: "Technical Writing", cat: "soft" },
  { name: "System Design", cat: "backend" },
];

(function () {
  window.toggleSidebar = () =>
    document.getElementById("sidebar").classList.toggle("open");

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

  window.openModal = () => {
    document.getElementById("skills-modal").style.display = "block";
  };

  window.closeModal = () => {
    document.getElementById("skills-modal").style.display = "none";
    resetForm();
  };

  window.useSuggestion = function (name, cat) {
    resetForm();
    document.getElementById("skill-name").value = name;
    document.getElementById("skill-cat").value = cat;
    document.getElementById("submit-btn").innerText = "Add Skill";
    document.getElementById("form-title").innerText = "New Skill";
    document.getElementById("skills-modal").style.display = "block";
  };

  window.handleSkillSubmit = function () {
    const name = document.getElementById("skill-name").value.trim();
    const level = document.getElementById("skill-level").value || 0;
    const cat = document.getElementById("skill-cat").value;

    if (!name) return alert("Skill name required");

    let skills = JSON.parse(localStorage.getItem("anakin_skills")) || [];
    const skillData = { name, level: Math.min(100, Math.max(0, level)), cat };

    if (editModeId) {
      skills = skills.map((s) =>
        s.id === editModeId ? { ...skillData, id: s.id } : s,
      );
    } else {
      skills.push({ ...skillData, id: Date.now() });
    }

    localStorage.setItem("anakin_skills", JSON.stringify(skills));
    window.closeModal();
    window.renderSkills();
  };

  window.renderSkills = function () {
    const container = document.getElementById("skills-container");
    const suggestBox = document.getElementById("skill-suggestions");
    const searchInput = document.getElementById("suggestion-search");
    const searchQuery = searchInput ? searchInput.value.toLowerCase() : "";
    const skills = JSON.parse(localStorage.getItem("anakin_skills")) || [];

    if (skills.length === 0) {
      container.innerHTML = `<p style="text-align:center; margin-top:30px; color:#94a3b8; font-size:14px;">No skills added yet.</p>`;
    } else {
      container.innerHTML = skills
        .map(
          (s) => `
                <div class="skill-card" onclick="window.prepareEdit(${s.id})">
                    <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
                        <span style="font-weight:700; font-size:13px;">${s.name}</span>
                        <span style="font-size:11px; font-weight:700; color:var(--text-muted);">${s.level}%</span>
                    </div>
                    <div class="progress-bg"><div class="progress-fill" style="width:${s.level}%"></div></div>
                </div>`,
        )
        .join("");
    }

    const currentNames = skills.map((s) => s.name.toLowerCase());
    suggestBox.innerHTML = skillLibrary
      .filter(
        (lib) =>
          !currentNames.includes(lib.name.toLowerCase()) &&
          lib.name.toLowerCase().includes(searchQuery),
      )
      .map(
        (lib) =>
          `<div class="skill-pill" onclick="window.useSuggestion('${lib.name}', '${lib.cat}')">+ ${lib.name}</div>`,
      )
      .join("");
  };

  window.prepareEdit = function (id) {
    const skills = JSON.parse(localStorage.getItem("anakin_skills")) || [];
    const s = skills.find((item) => item.id === id);
    if (s) {
      editModeId = id;
      document.getElementById("skill-name").value = s.name;
      document.getElementById("skill-level").value = s.level;
      document.getElementById("skill-cat").value = s.cat;
      document.getElementById("form-title").innerText = "Edit Skill";
      document.getElementById("submit-btn").innerText = "Update Skill";
      window.openModal();
    }
  };

  window.deleteActiveSkill = function () {
    if (!editModeId) return;
    if (!confirm("Remove this skill?")) return;
    let skills = JSON.parse(localStorage.getItem("anakin_skills")) || [];
    localStorage.setItem(
      "anakin_skills",
      JSON.stringify(skills.filter((s) => s.id !== editModeId)),
    );
    window.closeModal();
    window.renderSkills();
  };

  function resetForm() {
    editModeId = null;
    document.getElementById("skill-name").value = "";
    document.getElementById("skill-level").value = "";
    document.getElementById("skill-cat").value = "frontend";
  }

  window.onload = window.renderSkills;
})();
