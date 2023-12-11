// Importation des modules
const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config({ path: "./config/.env" });
const path = require("path");

// Importation des routes
const bookRoutes = require("./routes/book.routes");
const userRoutes = require("./routes/user.routes");

// Connexion à la base de données MongoDB
mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER_PASS}@monvieuxgrimoire.ewzryox.mongodb.net/?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() =>
    console.log("Connexion à MongoDB échouée !", process.env.DB_USER_PASS)
  );

// Création de l'application Express
const app = express();

// Middleware qui permet de parser les requêtes envoyées par le client
app.use(express.json());

// Middleware qui autorise les requêtes cross-origin (CORS)
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); // Allow all origins
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  ); // Allow all headers
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  ); // Allow all methods
  next();
});

// Middleware qui permet de servir les fichiers statiques du dossier images
app.use("/images", express.static(path.join(__dirname, "images")));

// Middleware qui permet de servir les routes dédiées aux livres et aux utilisateurs
app.use("/api/books", bookRoutes);
app.use("/api/auth", userRoutes);

module.exports = app;
