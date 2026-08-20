const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");

const regd_users = express.Router();

const JWT_TOKEN = "veryVerySecure";

let users = [];

const isValid = (username) => {
    return users.some(user => user.username === username);
};

const authenticatedUser = (username, password) => {
    return users.some(
        user =>
            user.username === username &&
            user.password === password
    );
};

// Only registered users can login
regd_users.post("/login", (req, res) => {

    const { username, password } = req.body;

    if (!isValid(username)) {
        return res.status(401).json({
            message: "User not registered"
        });
    }

    if (!authenticatedUser(username, password)) {
        return res.status(401).json({
            message: "Invalid username or password"
        });
    }

    const accessToken = jwt.sign(
        { username: username },
        JWT_TOKEN
    );

    req.session.authorization = accessToken;

    return res.status(200).json({
        message: "Login successful"
    });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {

    const isbn = req.params.isbn;
    const review = req.query.review;

    if (!review) {
        return res.status(400).json({
            message: "Review is required"
        });
    }

    if (!books[isbn]) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    const token = req.session.authorization;

    const decoded = jwt.verify(token, JWT_TOKEN);

    const username = decoded.username;

    if (!books[isbn].reviews) {
        books[isbn].reviews = {};
    }

    books[isbn].reviews[username] = review;

    return res.status(200).json({
        message: "Review added successfully"
    });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {

    const isbn = req.params.isbn;

    if (!books[isbn]) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    const token = req.session.authorization;
    const decoded = jwt.verify(token, JWT_TOKEN);

    const username = decoded.username;

    if (!books[isbn].reviews[username]) {
        return res.status(404).json({
            message: "Review not found"
        });
    }

    delete books[isbn].reviews[username];

    return res.status(200).json({
        message: "Review deleted successfully"
    });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;