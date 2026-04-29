if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((reg) => console.log("Aru: Service Worker registered!"))
      .catch((err) => console.log("Aru: registration failed", err));
  });
}

const syllabusDB = [
  {
    id: "web-dev",
    title: "🎨 Responsive Web Design",
    modules: [
      {
        name: "Module I: HTML Intro",
        topics: [
          "HTML Definition & Purpose",
          "Role in Web Dev",
          "Basic Syntax",
          "VS Code & Browser Setup",
          "First HTML Page",
          "Doctype & Structure",
          "Head: Meta & Title tags",
          "Body: H1-H6, P, B, I",
          "Lists: OL, UL, LI",
          "Hyperlinks & Images",
          "Forms & Input Elements",
          "Tables: TR, TH, TD",
          "Audio & Video Elements",
          "Iframes & Embeds",
        ],
      },
      {
        name: "Module II: HTML5 Advanced",
        topics: [
          "HTML5 Overview & Benefits",
          "Semantic Tags (Header, Nav, etc)",
          "Fallback Audio/Video methods",
          "HTML5 Input types (Date, Email)",
          "Local & Session Storage",
          "HTML5 Canvas & Animation",
        ],
      },
      {
        name: "Module III: CSS3 Mastering",
        topics: [
          "CSS Role & Purpose",
          "Syntax: Selectors, Properties",
          "Inline/Internal/External CSS",
          "Selectors (ID, Class, Attribute)",
          "Box Model: Padding, Margin, Border",
          "Layout: Float, Position (Static/Abs/Rel)",
          "CSS3 Transitions & Hover",
          "Keyframe Animations",
          "2D/3D Transforms",
        ],
      },
      {
        name: "Module IV: Responsive Design",
        topics: [
          "Viewport Meta Tag",
          "Media Queries Syntax",
          "Fluid Layouts & Flexbox",
          "CSS Grid Containers/Items",
          "Custom Properties (Variables)",
          "Shadows & Glow Effects",
          "Linear & Radial Gradients",
          "Form Validation Styling",
        ],
      },
      {
        name: "Module V: JavaScript",
        topics: [
          "JS Syntax: Let, Const, Var",
          "Conditional: If/Else, Switch",
          "Loops: For, While, For-of",
          "Functions & Arrow Functions",
          "Arrays & Methods (Map, Filter)",
          "Objects & Iteration",
          "DOM Access & Event Handling",
          "ES6+ Features",
          "Async/Await & Promises",
          "Error Handling (Try/Catch)",
          "Browser Debugging Tools",
        ],
      },
      {
        name: "Module VI: Bootstrap & Projects",
        topics: [
          "Bootstrap CDN Setup",
          "12-Column Grid System",
          "Typography & Spacing",
          "Buttons & Card Components",
          "Navbars & Modals",
          "Carousel & Mobile-First Design",
          "Node.js & Express Intro",
          "Project: Landing Page",
          "Project: Blog Layout",
          "Project: Dashboard UI",
        ],
      },
    ],
  },
  {
    id: "oop-cpp",
    title: "⚙️ OOP Concepts (C++)",
    modules: [
      {
        name: "Unit I: Basics",
        topics: [
          "OOP Concepts & Advantages",
          "Objects & Classes",
          "Encapsulation & Abstraction",
          "Inheritance & Polymorphism",
          "C++ Keywords & Data Types",
          "Control Structures & Loops",
        ],
      },
      {
        name: "Unit II: Functions",
        topics: [
          "Function Prototyping",
          "Call/Return by Reference",
          "Inline Functions",
          "Function Overloading",
          "Friend & Virtual Functions",
        ],
      },
      {
        name: "Unit III: Advanced Objects",
        topics: [
          "Arrays as Class Members",
          "Arrays of Objects",
          "Constructors & Destructors",
          "Operator Overloading (Unary/Binary)",
        ],
      },
      {
        name: "Unit IV: Inheritance & Files",
        topics: [
          "Derived Classes",
          "Single/Multi-level Inheritance",
          "Virtual Base Class",
          "File Streams (Open/Close)",
          "Command-line Arguments",
        ],
      },
      {
        name: "Unit V: Modeling",
        topics: [
          "Links & Association",
          "Generalization & Aggregation",
          "State Diagrams",
          "Nested State/Concurrency",
        ],
      },
      {
        name: "Unit VI: Functional Modeling",
        topics: [
          "Data Flow Diagrams (DFD)",
          "Specifying Operations",
          "OMT Methodology",
          "SA/SD & JSD Case Studies",
        ],
      },
    ],
  },
  {
    id: "adv-os",
    title: "💻 Advanced OS",
    modules: [
      {
        name: "Unit I: Intro",
        topics: [
          "System Architecture",
          "Clustered Systems",
          "Distributed Systems",
          "System Calls & Services",
        ],
      },
      {
        name: "Unit II: Process Mgmt",
        topics: [
          "Process Scheduling",
          "Threads & IPC",
          "CPU Scheduling Algorithms",
          "Context Switching",
        ],
      },
      {
        name: "Unit III: Sync & Deadlocks",
        topics: [
          "Critical Section Problem",
          "Peterson’s Solution",
          "Semaphores",
          "Deadlock Characterization",
          "Prevention & Recovery",
        ],
      },
      {
        name: "Unit IV: Storage",
        topics: [
          "Paging & Segmentation",
          "Virtual Memory",
          "Demand Paging",
          "Page Replacement Algos",
          "Thrashing & Working Set",
        ],
      },
      {
        name: "Unit V: Files & Disk",
        topics: [
          "Directory Implementation",
          "Disk Scheduling (SSTF, SCAN)",
          "Disk Management",
          "DMA & Interrupts",
        ],
      },
      {
        name: "Unit VI: Security",
        topics: [
          "Domain of Protection",
          "Access Matrix",
          "Authentication & Passwords",
          "Encryption & Threats",
        ],
      },
    ],
  },
];

// INITIALIZATION
document.addEventListener("DOMContentLoaded", () => {
  renderSyllabus();
  renderDailyTasks();
  updateGlobalProgress();

  document.getElementById("add-btn").onclick = addDailyTask;
  document.getElementById("todo-input").onkeypress = (e) => {
    if (e.key === "Enter") addDailyTask();
  };
});

// SIDEBAR TOGGLE
window.toggleSidebar = () => {
  document.getElementById("sidebar").classList.toggle("open");
};

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

// SYLLABUS LOGIC
function renderSyllabus() {
  const container = document.getElementById("data-container");
  const saved = JSON.parse(localStorage.getItem("anakin_mastery")) || {};
  container.innerHTML = "";

  syllabusDB.forEach((subject) => {
    const div = document.createElement("div");
    let html = `<h2>${subject.title}</h2>`;
    subject.modules.forEach((mod) => {
      html += `<h3>${mod.name}</h3>`;
      mod.topics.forEach((topic) => {
        const id = `${subject.id}-${topic.replace(/\s+/g, "-").toLowerCase()}`;
        const status = saved[id] || 0;
        const classes = ["not-started", "learning", "completed"];
        html += `
                    <div class="topic-row ${classes[status]}" onclick="cycleStatus('${id}')" id="${id}">
                        <div class="status-dot"></div>
                        <span>${topic}</span>
                    </div>`;
      });
    });
    div.innerHTML = html;
    container.appendChild(div);
  });
}

window.cycleStatus = (id) => {
  const saved = JSON.parse(localStorage.getItem("anakin_mastery")) || {};
  let next = ((saved[id] || 0) + 1) % 3;
  saved[id] = next;
  localStorage.setItem("anakin_mastery", JSON.stringify(saved));
  renderSyllabus();
  updateGlobalProgress();
};

function updateGlobalProgress() {
  const saved = JSON.parse(localStorage.getItem("anakin_mastery")) || {};
  const total = document.querySelectorAll(".topic-row").length;
  let done = 0;

  Object.values(saved).forEach((v) => {
    if (v === 2) done++;
  });

  const percent = Math.round((done / total) * 100) || 0;

  const fillElement = document.getElementById("progress-fill");
  if (fillElement) {
    fillElement.style.width = percent + "%";
  }

  const percentText = document.getElementById("progress-percent");
  if (percentText) {
    percentText.innerText = percent + "%";
  }
}

// DAILY TASK LOGIC
function addDailyTask() {
  const input = document.getElementById("todo-input");
  if (!input.value.trim()) return;
  const tasks = JSON.parse(localStorage.getItem("anakin_daily")) || [];
  tasks.push({ id: "t" + Date.now(), text: input.value, done: false });
  localStorage.setItem("anakin_daily", JSON.stringify(tasks));
  input.value = "";
  renderDailyTasks();
}

function renderDailyTasks() {
  const list = document.getElementById("daily-list");
  const tasks = JSON.parse(localStorage.getItem("anakin_daily")) || [];
  list.innerHTML = tasks
    .map(
      (t) => `
        <div class="daily-item ${t.done ? "done" : ""}">
            <div class="task-text" onclick="toggleDaily('${t.id}')">${t.text}</div>
            <button class="delete-btn" onclick="deleteDaily('${t.id}')">×</button>
        </div>`,
    )
    .join("");
}

window.toggleDaily = (id) => {
  let tasks = JSON.parse(localStorage.getItem("anakin_daily"));
  tasks = tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t));
  localStorage.setItem("anakin_daily", JSON.stringify(tasks));
  renderDailyTasks();
};

window.deleteDaily = (id) => {
  let tasks = JSON.parse(localStorage.getItem("anakin_daily"));
  localStorage.setItem(
    "anakin_daily",
    JSON.stringify(tasks.filter((t) => t.id !== id)),
  );
  renderDailyTasks();
};
