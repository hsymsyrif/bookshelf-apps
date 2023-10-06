(() => {
    let books = [];

    function addBook(event) {
        event.preventDefault();
        const titleInput = document.querySelector("#inputBookTitle");
        const authorInput = document.querySelector("#inputBookAuthor");
        const yearInput = document.querySelector("#inputBookYear");
        const isCompleteInput = document.querySelector("#inputBookIsComplete");

        const newBook = {
            id: +new Date(),
            title: titleInput.value,
            author: authorInput.value,
            year: parseInt(yearInput.value),
            isComplete: isCompleteInput.checked
        };

        books.push(newBook);
        updateBooks();
        document.dispatchEvent(new Event("bookChanged"));
    }

    function searchBooks(event) {
        event.preventDefault();
        const searchInput = document.querySelector("#searchBookTitle");
        const query = searchInput.value.toLowerCase();

        const filteredBooks = books.filter((book) => {
            return book.title.toLowerCase().includes(query);
        });

        updateBooks(filteredBooks);
    }

    function toggleComplete(event) {
        const bookId = Number(event.target.getAttribute("data-id"));
        const bookIndex = books.findIndex((book) => book.id === bookId);

        if (bookIndex !== -1) {
            books[bookIndex].isComplete = !books[bookIndex].isComplete;
            updateBooks();
            document.dispatchEvent(new Event("bookChanged"));
        }
    }

    function deleteBook(event) {
        const bookId = Number(event.target.getAttribute("data-id"));
        const bookIndex = books.findIndex((book) => book.id === bookId);

        if (bookIndex !== -1) {
            books.splice(bookIndex, 1);
            updateBooks();
            document.dispatchEvent(new Event("bookChanged"));
        }
    }

    function updateBooks(filteredBooks = books) {
        const incompleteBookshelf = document.querySelector("#incompleteBookshelfList");
        const completeBookshelf = document.querySelector("#completeBookshelfList");

        incompleteBookshelf.innerHTML = "";
        completeBookshelf.innerHTML = "";

        filteredBooks.forEach((book) => {
            const bookElement = document.createElement("article");
            bookElement.classList.add("book_item");

            const titleElement = document.createElement("h2");
            titleElement.innerText = book.title;

            const authorElement = document.createElement("p");
            authorElement.innerText = "Penulis: " + book.author;

            const yearElement = document.createElement("p");
            yearElement.innerText = "Tahun: " + book.year;

            bookElement.appendChild(titleElement);
            bookElement.appendChild(authorElement);
            bookElement.appendChild(yearElement);

            const actionElement = document.createElement("div");
            actionElement.classList.add("action");

            const toggleButton = document.createElement("button");
            toggleButton.setAttribute("data-id", book.id);
            toggleButton.innerText = book.isComplete ? "Belum Selesai dibaca" : "Selesai dibaca";
            toggleButton.classList.add("green");
            toggleButton.addEventListener("click", toggleComplete);

            const deleteButton = document.createElement("button");
            deleteButton.setAttribute("data-id", book.id);
            deleteButton.innerText = "Hapus buku";
            deleteButton.classList.add("red");
            deleteButton.addEventListener("click", deleteBook);

            actionElement.appendChild(toggleButton);
            actionElement.appendChild(deleteButton);
            bookElement.appendChild(actionElement);

            if (book.isComplete) {
                completeBookshelf.appendChild(bookElement);
            } else {
                incompleteBookshelf.appendChild(bookElement);
            }
        });
    }

    function saveBooksToLocalStorage() {
        localStorage.setItem("books", JSON.stringify(books));
    }

    window.addEventListener("load", () => {
        books = JSON.parse(localStorage.getItem("books")) || [];
        updateBooks(books);

        const addBookForm = document.querySelector("#inputBook");
        const searchBookForm = document.querySelector("#searchBook");

        addBookForm.addEventListener("submit", addBook);
        searchBookForm.addEventListener("submit", searchBooks);

        document.addEventListener("bookChanged", saveBooksToLocalStorage);
    });
})();
