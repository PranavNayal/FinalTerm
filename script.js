const API_URL = "https://www.googleapis.com/books/v1/volumes?q=";

function searchBooks() {
    const query = document.getElementById("search").value;
    fetch(API_URL + query)
        .then(response => response.json())
        .then(data => {
            displayBooks(data.items);
        })
        .catch(error => console.error("Error fetching books:", error));
}

function displayBooks(books) {
    const container = document.getElementById("books-container");
    container.innerHTML = "";
    
    books.forEach(book => {
        const info = book.volumeInfo;
        const bookElement = document.createElement("div");
        bookElement.classList.add("book");
        bookElement.innerHTML = `
            <img src="${info.imageLinks?.thumbnail || 'https://via.placeholder.com/150'}" alt="${info.title}">
            <h4>${info.title}</h4>
            <p>${info.authors?.join(", ") || "Unknown Author"}</p>
            <button class="add" onclick="addToLibrary('${info.title}', '${info.imageLinks?.thumbnail}', '${info.authors?.join(", ") || 'Unknown'}')">Add</button>
        `;
        container.appendChild(bookElement);
    });
}

function addToLibrary(title, img, author) {
    const category = prompt("Add to: Reading, Completed, or Wishlist?").toLowerCase();
    if (!["reading", "completed", "wishlist"].includes(category)) return alert("Invalid category!");

    const bookData = { title, img, author, category };
    let library = JSON.parse(localStorage.getItem("library")) || [];
    library.push(bookData);
    localStorage.setItem("library", JSON.stringify(library));
    renderLibrary();
}

function renderLibrary() {
    const library = JSON.parse(localStorage.getItem("library")) || [];
    document.querySelectorAll(".shelf .books").forEach(shelf => shelf.innerHTML = "");

    library.forEach(book => {
        const bookElement = document.createElement("div");
        bookElement.classList.add("book");
        bookElement.innerHTML = `
            <img src="${book.img}" alt="${book.title}">
            <h4>${book.title}</h4>
            <p>${book.author}</p>
            <button class="remove" onclick="removeBook('${book.title}')">Remove</button>
        `;
        document.querySelector(`#${book.category} .books`).appendChild(bookElement);
    });
}

function removeBook(title) {
    let library = JSON.parse(localStorage.getItem("library")) || [];
    library = library.filter(book => book.title !== title);
    localStorage.setItem("library", JSON.stringify(library));
    renderLibrary();
}

// Load library on page load
window.onload = renderLibrary;