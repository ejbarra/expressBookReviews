const express = require('express');
const axios = require('axios');
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

// TASK 10: Get all books using async/await with Axios
public_users.get('/books/async', async function (req, res) {
    try {
      const response = await axios.get('http://localhost:5000/');
      const booksData = JSON.parse(response.data);
      
      return res.status(200).json({
        message: "Books retrieved successfully using async/await with Axios",
        method: "async/await",
        data: booksData
      });
    } catch (error) {
      return res.status(500).json({
        message: "Error retrieving books with async/await",
        error: error.message
      });
    }
  });
  
  // TASK 10: Get all books using Promise
  public_users.get('/books/promise', function (req, res) {
    
    axios.get('http://localhost:5000/')
      .then(response => {
        const booksData = JSON.parse(response.data);
        return res.status(200).json({
          message: "Books retrieved successfully using Promise callbacks with Axios",
          method: "Promise callbacks",
          data: booksData
        });
      })
      .catch(error => {
        console.error("Error in promise books route:", error.message);
        return res.status(500).json({
          message: "Error retrieving books with Promise callbacks",
          error: error.message
        });
      });
  });

// TASK 11: Get book by ISBN using async/await with Axios
public_users.get('/books/async/isbn/:isbn', async function (req, res) {
    try {
      const isbn = req.params.isbn;
      const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
      return res.status(200).json({
        message: `Book with ISBN ${isbn} retrieved successfully using async/await with Axios`,
        method: "async/await",
        isbn: isbn,
        data: response.data
      });
    } catch (error) {
      if (error.response && error.response.status === 404) {
        return res.status(404).json({
          message: "Book not found using async/await with Axios",
          method: "async/await",
          isbn: req.params.isbn
        });
      }
      return res.status(500).json({
        message: "Error retrieving book with async/await",
        error: error.message
      });
    }
  });
  
  // TASK 11: Get book by ISBN using Promise callbacks with Axios
  public_users.get('/books/promise/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    axios.get(`http://localhost:5000/isbn/${isbn}`)
      .then(response => {
        return res.status(200).json({
          message: `Book with ISBN ${isbn} retrieved successfully using Promise callbacks with Axios`,
          method: "Promise callbacks",
          isbn: isbn,
          data: response.data
        });
      })
      .catch(error => {
  
        if (error.response && error.response.status === 404) {
          return res.status(404).json({
            message: "Book not found using Promise callbacks with Axios",
            method: "Promise callbacks",
            isbn: isbn
          });
        }
        
        return res.status(500).json({
          message: "Error retrieving book with Promise callbacks",
          error: error.message
        });
      });
  });
  
// TASK 12: Get books by Author using async/await with Axios
public_users.get('/books/async/author/:author', async function (req, res) {
    try {
      const author = req.params.author;
      const response = await axios.get(`http://localhost:5000/author/${encodeURIComponent(author)}`);
      return res.status(200).json({
        message: `Books by author "${author}" retrieved successfully using async/await with Axios`,
        method: "async/await",
        author: author,
        data: response.data
      });
    } catch (error) {
      if (error.response && error.response.status === 404) {
        return res.status(404).json({
          message: "No books found by this author using async/await with Axios",
          method: "async/await",
          author: req.params.author
        });
      }
      return res.status(500).json({
        message: "Error retrieving books by author with async/await",
        error: error.message
      });
    }
  });
  
  // TASK 12: Get books by Author using Promise callbacks with Axios
  public_users.get('/books/promise/author/:author', function (req, res) {
    const author = req.params.author;
    
    axios.get(`http://localhost:5000/author/${encodeURIComponent(author)}`)
      .then(response => {
        return res.status(200).json({
          message: `Books by author "${author}" retrieved successfully using Promise callbacks with Axios`,
          method: "Promise callbacks",
          author: author,
          data: response.data
        });
      })
      .catch(error => {
        
        if (error.response && error.response.status === 404) {
          return res.status(404).json({
            message: "No books found by this author using Promise callbacks with Axios",
            method: "Promise callbacks",
            author: author
          });
        }
        
        return res.status(500).json({
          message: "Error retrieving books by author with Promise callbacks",
          error: error.message
        });
      });
  });
// TASK 13: Get books by Title using async/await with Axios
public_users.get('/books/async/title/:title', async function (req, res) {
    try {
      const title = req.params.title;
      const response = await axios.get(`http://localhost:5000/title/${encodeURIComponent(title)}`);
      return res.status(200).json({
        message: `Books with title "${title}" retrieved successfully using async/await with Axios`,
        method: "async/await",
        title: title,
        data: response.data
      });
    } catch (error) {
      if (error.response && error.response.status === 404) {
        return res.status(404).json({
          message: "No books found with this title using async/await with Axios",
          method: "async/await",
          title: req.params.title
        });
      }
      return res.status(500).json({
        message: "Error retrieving books by title with async/await",
        error: error.message
      });
    }
  });
  
  // TASK 13: Get books by Title using Promise
  public_users.get('/books/promise/title/:title', function (req, res) {
    const title = req.params.title;
    axios.get(`http://localhost:5000/title/${encodeURIComponent(title)}`)
      .then(response => {
        return res.status(200).json({
          message: `Books with title "${title}" retrieved successfully using Promise callbacks with Axios`,
          method: "Promise callbacks",
          title: title,
          data: response.data
        });
      })
      .catch(error => {

        if (error.response && error.response.status === 404) {
          return res.status(404).json({
            message: "No books found with this title using Promise callbacks with Axios",
            method: "Promise callbacks",
            title: title
          });
        }
        
        return res.status(500).json({
          message: "Error retrieving books by title with Promise callbacks",
          error: error.message
        });
      });
  });

module.exports.general = public_users;
