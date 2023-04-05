// Load environment variables from .env file
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const app = express();
const { MongoClient } = require("mongodb");
const todoRoutes = require('./routes/todoRoutes');

app.use(express.json()); // To parse JSON request bodies

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connected'))
  .catch((error) => console.log('Failed to connect to MongoDB', error));

// Use the Todo routes
app.use('/api/todos', todoRoutes);

const apiPort = process.env.PORT || 3001;

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function main() {
  try {
    await client.connect();
    console.log("Connected to MongoDB Atlas");
    // operations with your database
  } catch (err) {
    console.error("Failed to connect to MongoDB Atlas", err);
  } finally {
    await client.close();
  }
}

main();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(
  session({
    secret: 'some-random-secret',
    resave: false,
    saveUninitialized: true,
  })
);

const todos = [];

app.get('/', (req, res) => {
  res.render('index', { todos });
});

app.post('/add-todo', (req, res) => {
  const newTodo = req.body.newTodo;
  todos.push(newTodo);
  res.redirect('/');
});

app.post('/delete-todo', (req, res) => {
  const index = req.body.index;
  todos.splice(index, 1);
  res.redirect('/');
});

app.get('/edit-todo/:index', (req, res) => {
  const index = req.params.index;
  const todo = todos[index];
  res.render('edit', { index, todo });
});

app.post('/edit-todo', (req, res) => {
  const index = req.body.index;
  const updatedTodo = req.body.updatedTodo;
  todos[index] = updatedTodo;
  res.redirect('/');
});

app.listen(apiPort, () => {
  console.log(`Server running on port ${apiPort}`);
});
