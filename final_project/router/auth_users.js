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
    isbn = req.params.isbn;

    book = books[isbn];

    
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;