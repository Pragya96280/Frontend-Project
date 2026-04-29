let editModeId = null;
let displayDate = new Date();

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

  window.changeMonth = (delta) => {
    displayDate.setMonth(displayDate.getMonth() + delta);
    window.renderHabits();
  };

  window.openModal = (id = null) => {
    document.getElementById("habit-modal").style.display = "block";
    if (!id) resetForm();
  };

  window.closeModal = () => {
    document.getElementById("habit-modal").style.display = "none";
    resetForm();
  };

  window.handleHabitSubmit = function () {
    const name = document.getElementById("habit-name").value.trim();
    if (!name) return alert("Enter habit name");

    let habits =
      JSON.parse(localStorage.getItem("anakin_monthly_habits")) || [];

    if (editModeId) {
      habits = habits.map((h) => (h.id === editModeId ? { ...h, name } : h));
    } else {
      habits.push({ id: Date.now(), name, history: [] });
    }

    localStorage.setItem("anakin_monthly_habits", JSON.stringify(habits));
    window.closeModal();
    window.renderHabits();
  };

  window.toggleDate = function (habitId, day) {
    let habits =
      JSON.parse(localStorage.getItem("anakin_monthly_habits")) || [];
    const habit = habits.find((h) => h.id === habitId);
    // Use Year-Month-Day to ensure unique keys per month
    const dateKey = `${displayDate.getFullYear()}-${displayDate.getMonth()}-${day}`;

    if (habit.history.includes(dateKey)) {
      habit.history = habit.history.filter((d) => d !== dateKey);
    } else {
      habit.history.push(dateKey);
    }

    localStorage.setItem("anakin_monthly_habits", JSON.stringify(habits));
    window.renderHabits();
  };

  window.renderHabits = function () {
    const container = document.getElementById("habit-container");
    const habits =
      JSON.parse(localStorage.getItem("anakin_monthly_habits")) || [];

    const year = displayDate.getFullYear();
    const month = displayDate.getMonth();
    const today = new Date();

    const firstDay = new Date(year, month, 1).getDay();
    // Adjust offset for Monday start
    const offset = firstDay === 0 ? 6 : firstDay - 1;
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const monthName = displayDate.toLocaleString("default", { month: "long" });
    document.getElementById("month-label").innerText =
      `${monthName.toUpperCase()} ${year}`;

    if (habits.length === 0) {
      container.innerHTML = `<p style="text-align:center; margin-top:50px; color:#94a3b8;">No habits. Tap + to start!</p>`;
      return;
    }

    container.innerHTML = habits
      .map((h) => {
        let dayHtml = "";
        let completedCount = 0;

        for (let x = 0; x < offset; x++) {
          dayHtml += `<div class="cal-day" style="background:transparent; border:none; cursor:default;"></div>`;
        }

        for (let i = 1; i <= daysInMonth; i++) {
          const dateKey = `${year}-${month}-${i}`;
          const isDone = h.history.includes(dateKey);
          if (isDone) completedCount++;

          const isToday =
            i === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear();

          dayHtml += `
            <div class="cal-day ${isDone ? "completed" : ""} ${isToday ? "is-today" : ""}" 
                 onclick="window.toggleDate(${h.id}, ${i})">
                ${i}
            </div>`;
        }

        const successPercent = Math.round((completedCount / daysInMonth) * 100);

        return `
          <div class="habit-block">
            <div class="habit-header">
              <div>
                <span class="proj-name">${h.name}</span>
                <span class="success-rate">${successPercent}%</span>
              </div>
              <button onclick="window.prepareEdit(${h.id})" style="background:none; border:none; cursor:pointer;">⚙️</button>
            </div>
            <div class="calendar-grid">
              <div class="day-name-header">M</div><div class="day-name-header">T</div>
              <div class="day-name-header">W</div><div class="day-name-header">T</div>
              <div class="day-name-header">F</div><div class="day-name-header">S</div>
              <div class="day-name-header">S</div>
              ${dayHtml}
            </div>
          </div>`;
      })
      .join("");
  };

  window.prepareEdit = function (id) {
    const habits =
      JSON.parse(localStorage.getItem("anakin_monthly_habits")) || [];
    const h = habits.find((item) => item.id === id);
    if (h) {
      editModeId = id;
      document.getElementById("habit-name").value = h.name;
      window.openModal(id);
    }
  };

  window.deleteActiveHabit = function () {
    if (!confirm("Delete habit?")) return;
    let habits =
      JSON.parse(localStorage.getItem("anakin_monthly_habits")) || [];
    localStorage.setItem(
      "anakin_monthly_habits",
      JSON.stringify(habits.filter((h) => h.id !== editModeId)),
    );
    window.closeModal();
    window.renderHabits();
  };

  function resetForm() {
    editModeId = null;
    document.getElementById("habit-name").value = "";
  }

  window.onload = window.renderHabits;
})();
