const books = [];
const RENDER_EVENT = "render-book";

document.addEventListener("DOMContentLoaded", function () {
    const submitForm = document.getElementById("form");
    submitForm.addEventListener("submit", function (event) {
        event.preventDefault();
        addBook();
    });
});

document.addEventListener(RENDER_EVENT, function () {
    const unreadBookList = document.getElementById("unread-books");
    unreadBookList.innerHTML = "";

    const readBookList = document.getElementById("read-books");
    readBookList.innerHTML = "";

    for (book of books) {
        const bookElement = createBook(book);
        if (book.isCompleted) {
            readBookList.append(bookElement);
        } else {
            unreadBookList.append(bookElement);
        }
        console.log(bookElement);
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
    const title = document.getElementById("inputTitle").value;
    const author = document.getElementById("inputAuthor").value;
    const year = document.getElementById("inputYear").value;
    const checkIsRead = document.getElementById("checkboxIsRead");
    let isRead = false;
    if (checkIsRead.checked) {
        isRead = true;
    }

    const generateID = generateId();
    const bookObject = generateBookObject(generateID, title, author, year, isRead);
    books.push(bookObject);

    console.log(books);
    document.dispatchEvent(new Event(RENDER_EVENT));
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

        const buttonContainer = document.createElement("div");
        buttonContainer.classList.add("col-sm-2");
        buttonContainer.append(unreadButton, trashButton);

        rowContainer.append(buttonContainer);
    } else {
        const checkButton = document.createElement("button");
        checkButton.classList.add("check-button");
        checkButton.addEventListener("click", function () {
            updateToRead(bookObject.id);
        });

        const buttonContainer = document.createElement("div");
        buttonContainer.classList.add("col-sm-2");
        buttonContainer.append(checkButton);

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
}

function updateToUnread(bookID) {
    const bookTarget = findBook(bookID);
    if (bookTarget === null) return;

    bookTarget.isCompleted = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
}

function findBook(bookID) {
    for (book of books) {
        if (book.id === bookID) {
            return book;
        }
    }
}