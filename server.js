require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Database connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});

//Test database connection
app.get('/test-db', (req, res) => {
  pool.query('SELECT 1', (error, results) => {
    if (error) {
      console.error('Database connection test failed:', error);
      return res.status(500).send('Database connection test failed');
    } else {
      return res.status(200).send('Database connection test succeeded');
    }
  });
});

// Route to get all movies
app.get('/movies', (req, res) => {
  pool.query('SELECT * FROM movies', (error, results) => {
    if (error) {
      console.error(error.message);
      res.status(500).send('Server error');
    } else {
      res.json(results);
    }
  });
});

// Get a movie by ID
app.get('/movies/:id', (req, res) => {
  const { id } = req.params;
  console.log(`Received request to get movie with ID: ${id}`);

  pool.query('SELECT * FROM movies WHERE id = ?', [id], (error, results) => {
    if (error) {
      console.error('Error fetching movie:', error);
      res.status(500).send('Database error');
    } else if (results.length === 0) {
      console.log(`Movie with ID: ${id} not found`);
      res.status(404).send('Movie not found');
    } else {
      console.log(`Movie with ID: ${id} fetched successfully`);
      res.status(200).json(results[0]);
    }
  });
});

// Route to post a new movie
app.post('/movies', async (req, res) => {
  const { title, year, imdbRating, poster, genre } = req.body;

  try {
    // Validate inputs if necessary
    // Insert movie into the database
    pool.query(
      'INSERT INTO movies (title, year, imdbRating, poster, genre) VALUES (?, ?, ?, ?, ?)',
      [title, year, imdbRating, poster, genre],
      (error, results) => {
        if (error) {
          console.error('Error inserting movie:', error);
          res.status(500).send('Database error');
        } else {
          console.log('Movie added successfully:', results);
          res.status(200).send('Movie saved successfully');
        }
      }
    );
  } catch (error) {
    console.error('Error adding movie:', error);
    res.status(500).send('Error adding movie');
  }
});

// Route to delete a movie
app.delete('/movies/:id', (req, res) => {
  const { id } = req.params;
  console.log(`Deleting movie with ID: ${id}`);

  pool.query('DELETE FROM movies WHERE id = ?', [id], (error, results) => {
    if (error) {
      console.error('Error deleting movie:', error);
      res.status(500).send('Database error');
    } else if (results.affectedRows === 0) {
      res.status(404).send('Movie not found');
    } else {
      res.status(200).send('Movie deleted successfully');
    }
  });
});

// Serve the index.html file for the root URL
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
});
