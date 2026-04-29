const booksDB = [
  {
    title: "Clean Code",
    author: "Robert C. Martin",
    link: "https://drive.google.com/file/d/1RmzEtNHAbiOkSt0kKwENoiIILc2SRcPv/view?usp=drive_link",
    category: "Programming",
  },
  {
    title: "The Alchemist",
    author: "Paulo Coelho",
    link: "https://drive.google.com/file/d/1gndTBSwOUV7lv0tXEEUlLof0K54_h9L3/view?usp=drive_link",
    category: "Fiction",
  },
  {
    title: "Atomic Habits",
    author: "James Clear",
    link: "https://drive.google.com/file/d/14q99UlehKjjPoCouOrjekk1k93dwBvdg/view?usp=drive_link",
    category: "Self-Help",
  },
  {
    title: "Operating Systems",
    author: "Galvin",
    link: "https://drive.google.com/file/d/1129N6Ku54wwFwRWQuZ0SVmqIZXD628Cg/view?usp=drive_link",
    category: "Academic",
  },
  {
    title: "Eloquent Javascript",
    author: "Marijn Haverbeke",
    link: "https://drive.google.com/file/d/1xjU-vVP2yV5adubnMXN18bxAQyXQs3oA/view?usp=drive_link",
    category: "Academic",
  },
];

function renderBooks(filter = "") {
  const grid = document.getElementById("library-grid");
  grid.innerHTML = "";

  const filteredBooks = booksDB.filter(
    (book) =>
      book.title.toLowerCase().includes(filter.toLowerCase()) ||
      book.author.toLowerCase().includes(filter.toLowerCase()),
  );

  filteredBooks.forEach((book) => {
    const card = document.createElement("div");
    card.className = "book-card";
    card.innerHTML = `
            <div class="book-info">
                <div class="book-category-tag">${book.category}</div>
                <div class="book-title">${book.title}</div>
                <div class="book-author">by ${book.author}</div>
            </div>
            <a href="${book.link}" target="_blank" class="read-btn">Read Now</a>
        `;
    grid.appendChild(card);
  });
}

document.getElementById("book-search").addEventListener("input", (e) => {
  renderBooks(e.target.value);
});

document.addEventListener("DOMContentLoaded", () => {
  renderBooks();
});
