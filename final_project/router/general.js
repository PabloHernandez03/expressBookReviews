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


// Task 10 - Get all books
public_users.get('/', async function (req, res) {

    try {

        const response = await axios.get(
            'http://localhost:5000/api/books'
        );

        return res.json(response.data);

    } catch (error) {

        return res.status(500).json({
            message: "Error getting books"
        });

    }

});


// Task 11 - Get book by ISBN
public_users.get('/isbn/:isbn', async function (req, res) {

    const isbn = req.params.isbn;

    try {

        const response = await axios.get(
            `http://localhost:5000/api/books/${isbn}`
        );

        return res.json(response.data);

    } catch (error) {

        return res.status(500).json({
            message: "Error getting book"
        });

    }

});


// Task 12 - Get books by author
public_users.get('/author/:author', async function (req, res) {

    const author = req.params.author;

    try {

        const response = await axios.get(
            `http://localhost:5000/api/books/author/${encodeURIComponent(author)}`
        );

        return res.json(response.data);

    } catch (error) {

        return res.status(500).json({
            message: "Error getting books by author"
        });

    }

});


// Task 13 - Get books by title
public_users.get('/title/:title', async function (req, res) {

    const title = req.params.title;

    try {

        const response = await axios.get(
            `http://localhost:5000/api/books/title/${encodeURIComponent(title)}`
        );

        return res.json(response.data);

    } catch (error) {

        return res.status(500).json({
            message: "Error getting books by title"
        });

    }

});


// Get book review
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