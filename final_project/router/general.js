const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const { username, password } = req.body;

  // Validación de campos
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  // Verificar si el usuario ya existe
  const userExists = users.some((user) => user.username === username);

  if (userExists) {
    return res.status(409).json({ message: "Username already exists" });
  }

  // Agregar nuevo usuario
  users.push({ username, password });

  return res.status(201).json({ message: "User registered successfully" });
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
  let isbnBook = books[req.params.isbn];
  return res.status(300).json(JSON.stringify(isbnBook));
});

module.exports.general = public_users;
