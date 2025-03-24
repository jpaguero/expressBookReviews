const express = require('express');
const axios = require('axios');
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
    return res.status(200).json(JSON.stringify(books));
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
  return res.status(200).json(JSON.stringify(filteredBooks));
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  let autor = req.params.author;
  filteredBooks = Object.values(books).filter(book => book.author === autor);
  return res.status(200).json(JSON.stringify(filteredBooks));
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  let title = req.params.title;
  filteredBooks = Object.values(books).filter(book => book.title === title);
  return res.status(200).json(JSON.stringify(filteredBooks));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  let isbnBook = books[req.params.isbn];
  return res.status(200).json(JSON.stringify(isbnBook));
});

const getAllBooks = async () => {
  try {
    const res = await axios.get('http://localhost:5000/');
    const books = JSON.parse(res.data);
    console.log('Todos los libros (async/await):');
    console.log(books);
  } catch (err) {
    console.error('Error al obtener todos los libros:', err.message);
  }
};

const getBookByISBN = (isbn) => {
  axios.get(`http://localhost:5000/isbn/${isbn}`)
    .then(res => {
      const book = JSON.parse(res.data);
      console.log(`Libro con ISBN ${isbn}:`);
      console.log(book);
    })
    .catch(err => {
      console.error(`Error al obtener libro por ISBN ${isbn}:`, err.message);
    });
};

const getBooksByAuthor = async (author) => {
  try {
    const res = await axios.get(`http://localhost:5000/author/${author}`);
    const books = JSON.parse(res.data);
    console.log(`Libros del autor ${author}:`);
    console.log(books);
  } catch (err) {
    console.error(`Error al obtener libros por autor ${author}:`, err.message);
  }
};

const getBooksByTitle = (title) => {
  axios.get(`http://localhost:5000/title/${title}`)
    .then(res => {
      const books = JSON.parse(res.data);
      console.log(`Libros con título "${title}":`);
      console.log(books);
    })
    .catch(err => {
      console.error(`Error al obtener libros por título "${title}":`, err.message);
    });
};

const getBookReviews = async (isbn) => {
  try {
    const res = await axios.get(`http://localhost:5000/review/${isbn}`);
    const book = JSON.parse(res.data);
    console.log(`Reseñas del libro con ISBN ${isbn}:`);
    console.log(book.reviews);
  } catch (err) {
    console.error(`Error al obtener reseñas del libro ${isbn}:`, err.message);
  }
};

getAllBooks();
getBookByISBN("1");
getBooksByAuthor("Unknown");
getBooksByTitle("Fairy tales");
getBookReviews("1");

module.exports.general = public_users;
