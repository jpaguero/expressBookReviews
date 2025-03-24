const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    return res.status(300).json(JSON.stringify(books));
})

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  let isbn = req.params.isbn;
  let filteredBooks = {}
  Object.keys(books).map(book => {
    if(book === isbn) {
      filteredBooks[isbn] = books[isbn]
    }
  });
  return res.status(300).json(JSON.stringify(filteredBooks));
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  let autor = req.params.author;
  filteredBooks = Object.values(books).filter(book => book.author === autor);
  return res.status(300).json(JSON.stringify(filteredBooks));
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  let title = req.params.title;
  filteredBooks = Object.values(books).filter(book => book.title === title);
  return res.status(300).json(JSON.stringify(filteredBooks));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
