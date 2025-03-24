const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ 
  return users.some(user => user.username === username);
}

const authenticatedUser = (username, password) => { 
  if(isValid(username)){
    return users.find(user => user.username === username && user.password === password);
  } else {
    return null
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const {password, username} = req.body;
  const JWT_SECRET = "SecretKeyJosePablo";

  const user = authenticatedUser(username, password);

  if(!user){
    return res.status(400).json({ message: "Username and password are required" });
  }

  const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: "1h" });

  req.session.authorization = { token, username };

  return res.status(200).json({ message: "Login successful", token });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;
  const username = req.session.authorization?.username;

  if (!username) {
    return res.status(401).json({ message: "Unauthorized. Please log in." });
  }

  if (!review) {
    return res.status(400).json({ message: "Review is required" });
  }

  const book = books[isbn];

  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  book.reviews[username] = review;

  return res.status(200).json({
    message: "Review added/updated successfully",
    reviews: book.reviews
  });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization?.username;

  if (!username) {
    return res.status(401).json({ message: "User not logged in" });
  }

  const book = books[isbn];

  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }

  if (!book.reviews[username]) {
    return res.status(404).json({ message: "Review not found for this user" });
  }

  delete book.reviews[username];

  return res.status(200).json({ message: "Review deleted successfully" });
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
