const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        if (!isValid(username)) {
            users.push({"username":username,"password":password});
            return res.status(200).json({message: "Customer successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "Customer already exists!"});
        }
    }
    return res.status(404).json({message: "Unable to register customer."});
});

// Task 10 - Get the book list available in the shop using async-await with Axios
public_users.get('/', async function (req, res) {
    try {
        const get_books = new Promise((resolve, reject) => {
            resolve(books);
        });
        const bks = await get_books;
        res.send(JSON.stringify(bks, null, 4));
    } catch (error) {
        res.status(500).json({message: "Error getting books"});
    }
});

// Task 11 - Get book details based on ISBN using Promises
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    const get_book = new Promise((resolve, reject) => {
        let book = books[isbn];
        if (book) {
            resolve(book);
        } else {
            reject("Unable to find book!");
        }
    });
    get_book.then((book) => {
        res.send(JSON.stringify(book, null, 4));
    }).catch((err) => {
        res.status(404).json({message: err});
    });
});

// Task 12 - Get book details based on author using Promises
public_users.get('/author/:author', function (req, res) {
    const get_books_by_author = new Promise((resolve, reject) => {
        let booksbyauthor = [];
        let isbns = Object.keys(books);
        isbns.forEach((isbn) => {
            if(books[isbn]["author"] === req.params.author) {
                booksbyauthor.push({"isbn":isbn,
                    "author":books[isbn]["author"],
                    "title":books[isbn]["title"],
                    "reviews":books[isbn]["reviews"]});
            }
        });
        if(booksbyauthor.length > 0) {
            resolve(booksbyauthor);
        } else {
            reject("Author not found");
        }
    });
    get_books_by_author.then((result) => {
        res.send(JSON.stringify(result, null, 4));
    }).catch((err) => {
        res.status(404).json({message: err});
    });
});

// Task 13 - Get all books based on title using Promises
public_users.get('/title/:title', function (req, res) {
    const get_books_by_title = new Promise((resolve, reject) => {
        let booksbytitle = [];
        let isbns = Object.keys(books);
        isbns.forEach((isbn) => {
            if(books[isbn]["title"] === req.params.title) {
                booksbytitle.push({"isbn":isbn,
                    "author":books[isbn]["author"],
                    "title":books[isbn]["title"],
                    "reviews":books[isbn]["reviews"]});
            }
        });
        if(booksbytitle.length > 0) {
            resolve(booksbytitle);
        } else {
            reject("Title not found");
        }
    });
    get_books_by_title.then((result) => {
        res.send(JSON.stringify(result, null, 4));
    }).catch((err) => {
        res.status(404).json({message: err});
    });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    if(books[isbn]){
        res.send(JSON.stringify(books[isbn].reviews, null, 4));
    } else {
        return res.status(404).json({message: "ISBN not found"});
    }
});

module.exports.general = public_users;
