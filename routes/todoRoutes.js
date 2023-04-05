// routes/todoRoutes.js
const express = require('express');
const todoController = require('../controllers/todoController');
const router = express.Router();
const Todo = require('../models/todoModel');

// Get all todos
router.get('/', async (req, res) => {
    try {
      const todos = await Todo.find();
      res.status(200).json(todos);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching todos' });
    }
  });
  
  // Create a new todo
  router.post('/', async (req, res) => {
    const newTodo = new Todo({
      text: req.body.text,
    });
  
    try {
      const savedTodo = await newTodo.save();
      res.status(201).json(savedTodo);
    } catch (error) {
      res.status(500).json({ message: 'Error creating todo' });
    }
  });
  
  // Delete a todo
  router.delete('/:id', async (req, res) => {
    try {
      const todo = await Todo.findById(req.params.id);
  
      if (!todo) {
        return res.status(404).json({ message: 'Todo not found' });
      }
  
      await todo.remove();
      res.status(200).json({ message: 'Todo deleted' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting todo' });
    }
  });
  

module.exports = router;
