const express = require('express');
const axios = require('axios');

let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();


// Register
public_users.post("/register", (req, res) => {

    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            message: "Username and password are required"
        });
    }

    if (isValid(username)) {
        return res.status(409).json({
            message: "Username already exists"
        });
    }

    users.push({
        username: username,
        password: password
    });

    return res.status(201).json({
        message: "User registered successfully"
    });
});


// --------------------------------------------------
// INTERNAL DATA ENDPOINTS
// --------------------------------------------------

public_users.get("/data/books", (req, res) => {
    return res.json(books);
});

public_users.get("/data/books/isbn/:isbn", (req, res) => {

    const isbn = req.params.isbn;

    if (!books[isbn]) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    return res.json(books[isbn]);
});

public_users.get("/data/books/author/:author", (req, res) => {

    const author = req.params.author;
    const booksByAuthor = [];

    const keys = Object.keys(books);

    keys.forEach((key) => {

        if (books[key].author === author) {
            booksByAuthor.push(books[key]);
        }

    });

    return res.json(booksByAuthor);
});

public_users.get("/data/books/title/:title", (req, res) => {

    const title = req.params.title;
    const booksByTitle = [];

    const keys = Object.keys(books);

    keys.forEach((key) => {

        if (books[key].title === title) {
            booksByTitle.push(books[key]);
        }

    });

    return res.json(booksByTitle);
});


// --------------------------------------------------
// TASK 10
// Get all books using Axios + Async/Await
// --------------------------------------------------

public_users.get('/', async function (req, res) {

    try {

        const response = await axios.get(
            'http://localhost:5000/data/books'
        );

        return res.json(response.data);

    } catch (error) {

        return res.status(500).json({
            message: "Error getting books"
        });

    }

});


// --------------------------------------------------
// TASK 11
// Get book by ISBN using Axios + Async/Await
// --------------------------------------------------

public_users.get('/isbn/:isbn', async function (req, res) {

    const isbn = req.params.isbn;

    try {

        const response = await axios.get(
            `http://localhost:5000/data/books/isbn/${isbn}`
        );

        return res.json(response.data);

    } catch (error) {

        return res.status(404).json({
            message: "Book not found"
        });

    }

});


// --------------------------------------------------
// TASK 12
// Get books by Author using Axios + Async/Await
// --------------------------------------------------

public_users.get('/author/:author', async function (req, res) {

    const author = req.params.author;

    try {

        const response = await axios.get(
            `http://localhost:5000/data/books/author/${encodeURIComponent(author)}`
        );

        return res.json(response.data);

    } catch (error) {

        return res.status(500).json({
            message: "Error getting books by author"
        });

    }

});


// --------------------------------------------------
// TASK 13
// Get books by Title using Axios + Async/Await
// --------------------------------------------------

public_users.get('/title/:title', async function (req, res) {

    const title = req.params.title;

    try {

        const response = await axios.get(
            `http://localhost:5000/data/books/title/${encodeURIComponent(title)}`
        );

        return res.json(response.data);

    } catch (error) {

        return res.status(500).json({
            message: "Error getting books by title"
        });

    }

});


// --------------------------------------------------
// Get book review
// --------------------------------------------------

public_users.get('/review/:isbn', function (req, res) {

    const isbn = req.params.isbn;

    const book = books[isbn];

    if (!book) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    return res.json(book.reviews);

});


module.exports.general = public_users;