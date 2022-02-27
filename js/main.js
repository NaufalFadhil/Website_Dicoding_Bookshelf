const books = [];
const RENDER_EVENT = "render-book";
const SAVED_EVENT = "saved-book";
const STORAGE_KEY = "BOOKSHELF_APPS";
let searchResult = [];

document.addEventListener("DOMContentLoaded", function () {
    const submitForm = document.getElementById("form");
    submitForm.addEventListener("submit", function (event) {
        event.preventDefault();
        addBook();
    });

    const searchForm = document.getElementById("form-search");
    searchForm.addEventListener("submit", function (event) {
        event.preventDefault();
        searchBook();
    });

    const resetButton = document.getElementById("reset-button");
    resetButton.addEventListener("click", function (event) {
        event.preventDefault();
        resetInput();
    });

    if (isStorageExist()) {
        loadDataFromStorage();
    }
});

document.addEventListener(RENDER_EVENT, function () {
    const unreadBookList = document.getElementById("unread-books");
    unreadBookList.innerHTML = "";

    const readBookList = document.getElementById("read-books");
    readBookList.innerHTML = "";

    if (searchResult.length === 0) {
        for (book of books) {
            const bookElement = createBook(book);
            if (book.isCompleted) {
                readBookList.append(bookElement);
            } else {
                unreadBookList.append(bookElement);
            }
        }
    } else {
        for (book of searchResult) {
            const bookElement = createBook(book);
            if (book.isCompleted) {
                readBookList.append(bookElement);
            } else {
                unreadBookList.append(bookElement);
            }
        }
    }
});

function generateId() {
    return +new Date();
}

function generateBookObject(id, title, author, year, isCompleted) {
    return {
        id,
        title,
        author,
        year,
        isCompleted,
    }
}

function addBook() {
    let id = parseInt(document.getElementById("inputID").value);
    const title = document.getElementById("inputTitle").value;
    const author = document.getElementById("inputAuthor").value;
    const year = parseInt(document.getElementById("inputYear").value);
    const checkIsRead = document.getElementById("checkboxIsRead");
    let isRead = false;
    if (checkIsRead.checked) {
        isRead = true;
    }

    if (isNaN(id)) {
        id = generateId();
        const bookObject = generateBookObject(id, title, author, year, isRead);
        books.push(bookObject);
    } else {
        editBook(id, title, author, year, isRead);
    }

    resetInput();
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function createBook(bookObject) {
    const textTitle = document.createElement("h5");
    textTitle.classList.add("card-title", "text-start");
    textTitle.innerText = bookObject.title;

    const textBook = document.createElement("p");
    textBook.classList.add("card-title", "text-start");
    textBook.innerText = bookObject.author + "\n Tahun : " + bookObject.year;

    const textContainer = document.createElement("div");
    textContainer.classList.add("col-sm-10");
    textContainer.append(textTitle, textBook);

    const rowContainer = document.createElement("div");
    rowContainer.classList.add("row");
    rowContainer.append(textContainer);


    if (bookObject.isCompleted) {
        const unreadButton = document.createElement("button");
        unreadButton.classList.add("uncheck-button");
        unreadButton.addEventListener("click", function () {
            updateToUnread(bookObject.id);
        });

        const trashButton = document.createElement("button");
        trashButton.classList.add("trash-button");
        trashButton.addEventListener("click", function () {
            removeBook(bookObject.id);
        });

        const editButton = document.createElement("button");
        editButton.classList.add("edit-button");
        editButton.addEventListener("click", function () {
            viewBook(bookObject.id);
        });

        const buttonContainer = document.createElement("div");
        buttonContainer.classList.add("col-sm-2");
        buttonContainer.append(unreadButton, trashButton, editButton);

        rowContainer.append(buttonContainer);
    } else {
        const checkButton = document.createElement("button");
        checkButton.classList.add("check-button");
        checkButton.addEventListener("click", function () {
            updateToRead(bookObject.id);
        });

        const trashButton = document.createElement("button");
        trashButton.classList.add("trash-button");
        trashButton.addEventListener("click", function () {
            removeBook(bookObject.id);
        });

        const editButton = document.createElement("button");
        editButton.classList.add("edit-button");
        editButton.addEventListener("click", function () {
            viewBook(bookObject.id);
        });

        const buttonContainer = document.createElement("div");
        buttonContainer.classList.add("col-sm-2");
        buttonContainer.append(checkButton, trashButton, editButton);

        rowContainer.append(buttonContainer);
    }

    const cardContainer = document.createElement("div");
    cardContainer.classList.add("card", "p-3");
    cardContainer.append(rowContainer);

    const container = document.createElement("div");
    container.classList.add("card-body")
    container.append(cardContainer);
    container.setAttribute("id", `book-${bookObject.id}`);

    return container;
}

function updateToRead(bookID) {
    const bookTarget = findBook(bookID);
    if (bookTarget === null) return;

    bookTarget.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData()
}

function updateToUnread(bookID) {
    const bookTarget = findBook(bookID);
    if (bookTarget === null) return;

    bookTarget.isCompleted = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData()
}


function viewBook(bookID) {
    const bookTarget = findBook(bookID);
    if (bookTarget === null) return;
    document.getElementById("inputID").value = bookTarget.id;
    document.getElementById("inputTitle").value = bookTarget.title;
    document.getElementById("inputAuthor").value = bookTarget.author;
    document.getElementById("inputYear").value = bookTarget.year;
    document.getElementById("checkboxIsRead").checked = bookTarget.isCompleted;

    document.getElementById("submit-button").value = "Edit this book";
    document.getElementById("title-heading").textContent = "EDIT BOOK";
}

function editBook(id, title, author, year, isCompleted) {
    const bookTarget = findBookIndex(id);
    if (bookTarget === -1) return;

    console.log(bookTarget);

    books[bookTarget].id = id;
    books[bookTarget].title = title;
    books[bookTarget].author = author;
    books[bookTarget].year = year;
    books[bookTarget].isCompleted = isCompleted;

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function removeBook(bookID) {
    if (confirm("are you sure will delete this book?")) {
        const bookTarget = findBookIndex(bookID);
        if (bookTarget === -1) return;
        books.splice(bookTarget, 1);
    }

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData()
}

function findBook(bookID) {
    for (book of books) {
        if (book.id === bookID) {
            return book;
        }
    }
}

function findBookIndex(bookID) {
    for (index in books) {
        if (books[index].id === bookID) {
            return index;
        }
    }
    return -1
}

function saveData() {
    if (isStorageExist()) {
        const parsed = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
}

function isStorageExist() {
    if (typeof (Storage) === undefined) {
        alert("Browser tidak mendukung local storage");
        return false;
    }
    return true;
}

function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);

    if (data !== null) {
        for (book of data) {
            books.push(book);
        }
    }
    document.dispatchEvent(new Event(RENDER_EVENT));
}

function searchBook() {
    const keyword = document.getElementById("inputSearch").value;
    searchResult = books.filter((book) => book.title === keyword);

    document.dispatchEvent(new Event(RENDER_EVENT));
}

function resetInput() {
    document.getElementById("inputID").value = null;
    document.getElementById("inputTitle").value = "";
    document.getElementById("inputAuthor").value = "";
    document.getElementById("inputYear").value = null;
    document.getElementById("checkboxIsRead").checked = false;
}