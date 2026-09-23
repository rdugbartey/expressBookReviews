const express = require('express');
const axios = require("axios");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
  const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(400).json({
            message: "Username and password are required"
        });
    }

    if (isValid(username)) {
        return res.status(400).json({
            message: "Username already exists"
        });
    }

    users.push({
        username: username,
        password: password
    });

    return res.status(201).json({
        message: "User successfully registered"
    });
});

// Internal endpoint that returns all books
public_users.get('/books', function (req, res) {
    res.json(books);
});

// Get the book list available in the shop using Axios and async/await
public_users.get('/', async function (req, res) {

    try {

        const response = await axios.get(
            "http://localhost:5001/books"
        );

        res.send(JSON.stringify(response.data, null, 4));

    } catch (error) {

        res.status(500).json({
            message: "Error retrieving books",
            error: error.message
        });

    }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
   const isbn = req.params.isbn;
   if (books[isbn]) {
       return res.json(books[isbn]);
   }
  return res.status(404).json({message: "Book not found"});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
   const author = req.params.author;
   const result = Object.values(books).filter(
        book => book.author.toLowerCase() === author.toLowerCase()
    );

    if (result.length > 0) {
        return res.json(result);
    }

  return res.status(404).json({message: "Book not found"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  const result = Object.values(books).filter(
        book => book.title.toLowerCase() === title.toLowerCase()
    );

    if (result.length > 0) {
        return res.json(result);
    }
  return res.status(404).json({
        message: "Book not found"
    });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
      return res.json(books[isbn].reviews);
  }

  return res.status(404).json({
        message: "Book not found"
    });
});

module.exports.general = public_users;
