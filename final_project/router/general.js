const express = require('express');
const axios = require('axios');
const { PORT } = require('../config.js');
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
let books = require("./booksdb.js");
const public_users = express.Router();

const BASE = `http://127.0.0.1:${PORT}`;
const getBooks = async () => (await axios.get(`${BASE}/booksdata`, {
  timeout: 5000,
  proxy: false
})).data;

// Internal data source
public_users.get('/booksdata', (req, res) => res.status(200).json(books));

// Register
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json({ message: "Username and password required" });
  if (isValid(username))
    return res.status(409).json({ message: "User already exists" });
  users.push({ username, password });
  return res.status(200).json({ message: "User successfully registered. Now you can login" });
});

// All books
public_users.get('/', async (req, res) => {
  try {
    return res.status(200).send(JSON.stringify(await getBooks(), null, 4));
  } catch (e) {
    console.error("Error retrieving books:", e.message);
    return res.status(500).json({ message: "Error retrieving books" });
  }
});

// By ISBN
public_users.get('/isbn/:isbn', async (req, res) => {
  try {
    const all = await getBooks();
    const book = all[req.params.isbn];
    return book ? res.status(200).json(book)
                : res.status(404).json({ message: "Book not found" });
  } catch (e) {
    console.error("Error retrieving book:", e.message);
    return res.status(500).json({ message: "Error retrieving book" });
  }
});

// By author
public_users.get('/author/:author', async (req, res) => {
  try {
    const all = await getBooks();
    const result = Object.entries(all)
      .filter(([_, b]) => b.author.toLowerCase() === req.params.author.toLowerCase())
      .map(([isbn, b]) => ({ isbn, ...b }));
    return result.length ? res.status(200).json({ booksbyauthor: result })
                         : res.status(404).json({ message: "No books found for author" });
  } catch (e) {
    console.error("Error retrieving books:", e.message);
    return res.status(500).json({ message: "Error retrieving books" });
  }
});

// By title
public_users.get('/title/:title', async (req, res) => {
  try {
    const all = await getBooks();
    const result = Object.entries(all)
      .filter(([_, b]) => b.title.toLowerCase() === req.params.title.toLowerCase())
      .map(([isbn, b]) => ({ isbn, ...b }));
    return result.length ? res.status(200).json({ booksbytitle: result })
                         : res.status(404).json({ message: "No books found with title" });
  } catch (e) {
    console.error("Error retrieving books:", e.message);
    return res.status(500).json({ message: "Error retrieving books" });
  }
});

// Reviews
public_users.get('/review/:isbn', (req, res) => {
  const book = books[req.params.isbn];
  return book ? res.status(200).json(book.reviews)
              : res.status(404).json({ message: "Book not found" });
});

module.exports.general = public_users;
