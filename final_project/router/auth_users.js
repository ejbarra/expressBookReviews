const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{     // Verificar si el username existe en el array de usuarios
    console.log("Checking if valid username:", username);
    console.log("Current users:", users);
    return users.some(user => user.username === username);
}

const authenticatedUser = (username,password)=>{
    return users.some(user => user.username === username && user.password === password);
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(400).json({message: "Username and password are required"});
    }
    
    if (authenticatedUser(username, password)) {
        let accessToken = jwt.sign({
            data: username
        }, 'access', { expiresIn: 60 * 60 });
        
        req.session.authorization = {
            accessToken, username
        }
        
        return res.status(200).json({message: "User successfully logged in"});
    } else {
        return res.status(208).json({message: "Invalid Login. Check username and password"});
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.query.review;
    const username = req.session.authorization.username;
    
    if (!review) {
        return res.status(400).json({message: "Review is required as query parameter"});
    }
    
    if (!books[isbn]) {
        return res.status(404).json({message: "Book not found"});
    }

    books[isbn].reviews[username] = review;
    
    return res.status(200).json({
        message: "Review successfully added/updated",
        reviews: books[isbn].reviews
    });

});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const username = req.session.authorization.username;
    
    if (!books[isbn]) {
        return res.status(404).json({message: "Book not found"});
    }
    
    if (!books[isbn].reviews[username]) {
        return res.status(404).json({message: "Review not found for this user"});
    }
    
    delete books[isbn].reviews[username];
    
    return res.status(200).json({
        message: "Review successfully deleted",
        reviews: books[isbn].reviews
    });
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
