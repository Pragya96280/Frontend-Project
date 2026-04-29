let editModeId = null;

const bookLibrary = [
  { name: "Clean Code", author: "Robert C. Martin" },
  { name: "Pragmatic Programmer", author: "Andrew Hunt" },
  { name: "Atomic Habits", author: "James Clear" },
  { name: "Deep Work", author: "Cal Newport" },
  { name: "Refactoring", author: "Martin Fowler" },
  { name: "Design Patterns", author: "Gang of Four" },
  { name: "The Mythical Man-Month", author: "Fred Brooks" },
  { name: "Zero to One", author: "Peter Thiel" },
  { name: "Soft Skills", author: "John Sonmez" },
];

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

  window.openModal = () => {
    document.getElementById("book-modal").style.display = "block";
  };

  window.closeModal = () => {
    document.getElementById("book-modal").style.display = "none";
    resetForm();
  };

  window.useSuggestion = function (name, author) {
    console.log("Suggestion clicked:", name, author);
    resetForm();
    document.getElementById("book-name").value = name;
    document.getElementById("book-author").value = author;
    document.getElementById("book-status").value = "wishlist";
    document.getElementById("form-title").innerText = "Add from Suggestions";
    document.getElementById("submit-btn").innerText = "Save to Vault";
    document.getElementById("book-modal").style.display = "block";
  };

  window.handleBookSubmit = function () {
    const name = document.getElementById("book-name").value.trim();
    const author = document.getElementById("book-author").value.trim();
    const notes = document.getElementById("book-notes").value.trim();
    const rating = document.getElementById("book-rating").value;
    const status = document.getElementById("book-status").value;

    if (!name) return alert("Title required");

    let books = JSON.parse(localStorage.getItem("anakin_books")) || [];
    const bookData = { name, author, notes, rating, status };

    if (editModeId) {
      books = books.map((b) =>
        b.id === editModeId ? { ...bookData, id: b.id } : b,
      );
    } else {
      books.push({ ...bookData, id: Date.now() });
    }

    localStorage.setItem("anakin_books", JSON.stringify(books));
    window.closeModal();
    window.renderBooks();
  };

  window.renderBooks = function () {
    const list = document.getElementById("book-list");
    const suggestBox = document.getElementById("book-suggestions");
    const books = JSON.parse(localStorage.getItem("anakin_books")) || [];

    if (books.length === 0) {
      list.innerHTML = `<p style="text-align:center; margin-top:30px; color:#94a3b8; font-size:14px;">Library is empty.</p>`;
    } else {
      list.innerHTML = books
        .map(
          (b) => `
                <div class="item-list-card" onclick="window.prepareEdit(${b.id})">
                    <div>
                        <span class="proj-name">${b.name}</span>
                        <div style="font-size: 12px; color: #64748b; margin-top: 2px;">${b.author} • ${"⭐".repeat(b.rating)}</div>
                    </div>
                    <span class="status-text-mini">
                        <span class="status-dot dot-${b.status}"></span>
                        ${b.status}
                    </span>
                </div>
            `,
        )
        .join("");
    }

    const currentTitles = books.map((b) => b.name.toLowerCase());
    suggestBox.innerHTML = bookLibrary
      .filter((lib) => !currentTitles.includes(lib.name.toLowerCase()))
      .map(
        (lib) => `
                <div class="skill-pill" onclick="window.useSuggestion('${lib.name.replace(/'/g, "\\'")}', '${lib.author.replace(/'/g, "\\'")}')">
                    + ${lib.name}
                </div>
            `,
      )
      .join("");
  };

  window.prepareEdit = function (id) {
    const books = JSON.parse(localStorage.getItem("anakin_books")) || [];
    const b = books.find((item) => item.id === id);
    if (b) {
      editModeId = id;
      document.getElementById("book-name").value = b.name;
      document.getElementById("book-author").value = b.author;
      document.getElementById("book-notes").value = b.notes;
      document.getElementById("book-rating").value = b.rating;
      document.getElementById("book-status").value = b.status;
      document.getElementById("form-title").innerText = "Edit Book";
      document.getElementById("submit-btn").innerText = "Update Book";
      window.openModal();
    }
  };

  window.deleteActiveBook = function () {
    if (!confirm("Remove this book?")) return;
    let books = JSON.parse(localStorage.getItem("anakin_books")) || [];
    localStorage.setItem(
      "anakin_books",
      JSON.stringify(books.filter((b) => b.id !== editModeId)),
    );
    window.closeModal();
    window.renderBooks();
  };

  function resetForm() {
    editModeId = null;
    document.getElementById("book-name").value = "";
    document.getElementById("book-author").value = "";
    document.getElementById("book-notes").value = "";
    document.getElementById("book-rating").value = "5";
    document.getElementById("book-status").value = "reading";
  }

  window.onload = window.renderBooks;
})();
