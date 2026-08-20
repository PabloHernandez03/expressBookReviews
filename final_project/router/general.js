const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


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
// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.send(JSON.stringify(books));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    isbn = req.params.isbn;

    return res.send(books[isbn])
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    author = req.params.author;
    booksByAuthor = [];
    
    const keys = Object.keys(books);

    keys.forEach((key) => {

        if (books[key].author === author) {
            booksByAuthor.push(books[key]);
        }

    });


    return res.send(JSON.stringify(booksByAuthor))
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    title = req.params.title;
    booksByTitle = [];
    
    const keys = Object.keys(books);

    keys.forEach((key) => {

        if (books[key].title === title) {
            booksByTitle.push(books[key]);
        }

    });


    return res.send(JSON.stringify(booksByTitle))
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    isbn = req.params.isbn;
    reviewsByISBN = [];
    
    const book = books[isbn];


    return res.send(book.reviews)
});

module.exports.general = public_users;
