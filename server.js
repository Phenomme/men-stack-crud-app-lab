
const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const methodOverride = require("method-override"); 
const morgan = require("morgan");

dotenv.config();
const app = express();
app.use(methodOverride("_method")); 
app.use(morgan("dev")); 
const path = require("path");

app.use(express.static(path.join(__dirname, "public")));

mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on("connected", () => {
    console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
  });


  const Movie = require("./models/movie.js");


  app.use(express.urlencoded({ extended: false }));
  app.use(morgan('dev'));


app.get("/", async (req, res) => {
    res.render("index.ejs");
  });


  app.get("/movies", async (req, res) => {
    const allMovies = await Movie.find();
    res.render("movies/index.ejs", { movies: allMovies });
  });


  app.get("/movies/new", (req, res) => {
    res.render("movies/new.ejs");
  });

  
  app.get("/movies/:movieId", async (req, res) => {
    const foundMovie = await Movie.findById(req.params.movieId);
    res.render("movies/show.ejs", { movie: foundMovie});
  });


  app.delete("/movies/:movieId", async (req, res) => {
    await Movie.findByIdAndDelete(req.params.movieId);
    res.redirect("/movies");
  });


  app.get("/movies/:movieId/edit", async (req, res) => {
    const foundMovie = await Movie.findById(req.params.movieId);
    res.render("movies/edit.ejs", {
      movie: foundMovie,
    });
  });

  app.put("/movies/:movieId", async (req, res) => {
    if (req.body.enjoyedWatching === "on") {
      req.body.enjoyedWatching = true;
    } else {
      req.body.enjoyedWatching = false;
    }
    
    await Movie.findByIdAndUpdate(req.params.movieId, req.body);
  
    res.redirect(`/movies/${req.params.movieId}`);
  });


  app.post("/movies", async (req, res) => {
    if (req.body.enjoyedWatching === "on") {
      req.body.enjoyedWatching = true;
    } else {
      req.body.enjoyedWatching = false;
    }
    console.log(req.body)
    await Movie.create(req.body);
    res.redirect("/movies");
  });

app.listen(3000, () => {
  console.log("Listening on port 3000");
});
