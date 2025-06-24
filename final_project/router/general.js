const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    
    console.log("Users array before registration:", users);

    if (!username || !password) {
      return res.status(400).json({message: "Username and password are required"});
    }
    
    if (isValid(username)) {
      return res.status(400).json({message: "Username already exists"});
    }
    
    users.push({username: username, password: password});
    console.log("User registered:", {username, password});
    console.log("Current users after registration:", users);
    return res.status(201).json({message: "User registered successfully"});
  });
  

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.status(200).json(JSON.stringify(books, null, 2));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  
  if (books[isbn]) {
    return res.status(200).json(books[isbn]);
  } else {
    return res.status(404).json({message: "Book not found"});
  }
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  const bookKeys = Object.keys(books);

  let foundBooks = [];
  bookKeys.forEach(key => {
    if (books[key].author.toLowerCase() === author.toLowerCase()) {
      foundBooks.push(books[key]);
    }
  });
  
  if (foundBooks.length > 0) {
    return res.status(200).json(foundBooks);
  } else {
    return res.status(404).json({message: "No books found by this author"});
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    const bookKeys = Object.keys(books);
    let foundBooks = [];
    
    bookKeys.forEach(key => {
      if (books[key].title.toLowerCase() === title.toLowerCase()) {
        foundBooks.push(books[key]);
      }
    });
    
    if (foundBooks.length > 0) {
      return res.status(200).json(foundBooks);
    } else {
      return res.status(404).json({message: "No books found with this title"});
    }
  });

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;

    if (books[isbn]) {
      return res.status(200).json(books[isbn].reviews);
    } else {
      return res.status(404).json({message: "Book not found"});
    }
  });

module.exports.general = public_users;
