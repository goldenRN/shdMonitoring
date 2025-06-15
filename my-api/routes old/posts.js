const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET all posts
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM userinfo');
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// POST create a new post
router.post('/', async (req, res) => {
  try {
    const { title, content } = req.body;
    const result = await pool.query(
      'INSERT INTO posts (title, content) VALUES ($1, $2) RETURNING *',
      [title, content]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;