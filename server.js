require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const axios = require('axios');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
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

// Route to post a new movie
app.post('/movies', async (req, res) => {
  const { searchTitle } = req.body;

  try {
    const response = await axios.get(`http://www.omdbapi.com/?apikey=6698f446&t=${searchText}`);
    if (response.data.Response === "True") {
      const movie = response.data;
      pool.query(
        'INSERT INTO movies (title, year, imdbRating, poster, genre) VALUES (?, ?, ?, ?, ?)',
        [movie.Title, movie.Year, movie.imdbRating, movie.Poster, movie.Genre],
        (error, results) => {
          if (error) {
            console.error(error);
            res.status(500).send('Database error');
          } else {
            res.status(200).send('Movie saved successfully');
          }
        }
      );
    } else {
      res.status(404).send('Movie not found');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching movie details');
  }
});

// Serve the index.html file for the root URL
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
});
