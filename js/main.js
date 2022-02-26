const books = [];

document.addEventListener("DOMContentLoaded", function () {
    const submitForm = document.getElementById("form");
    submitForm.addEventListener("submit", function (event) {
        event.preventDefault();
        addBook();
    });
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
    if (checkIsRead.checked) {
        isRead = true;
    }

    const generateID = generateId();
    const bookObject = generateBookObject(generateID, title, author, year, isRead);
    books.push(bookObject);

    console.log(books);
}