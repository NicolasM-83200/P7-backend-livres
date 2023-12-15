const Book = require("../models/Book");
const fs = require("fs");

exports.createBook = async (req, res, next) => {
  try {
    // On récupère les données du livre
    const bookObject = JSON.parse(req.body.book);
    // On supprime l'ID et l'ID utilisateur
    delete bookObject._id;
    delete bookObject.userId;
    // On crée un nouveau livre avec les données du livre, l'ID utilisateur et l'URL de l'image
    const book = new Book({
      ...bookObject,
      userId: req.auth.userId,
      imageUrl: `${req.protocol}://${req.get("host")}/images/${
        req.file.filename
      }`,
    });
    // On enregistre le livre dans la base de données
    await book.save();
    res.status(201).json({ message: "Objet enregistré !", book });
  } catch (error) {
    res.status(400).json({ error });
  }
};

exports.getOneBook = async (req, res, next) => {
  try {
    // On récupère le livre grâce à son ID
    const book = await Book.findOne({ _id: req.params.id });
    res.status(200).json(book);
  } catch (error) {
    res.status(404).json({ error });
  }
};

exports.modifyBook = async (req, res, next) => {
  // On récupère les données du livre et on vérifie si l'image est modifiée sinon on récupère les données du livre
  const bookObject = req.file
    ? {
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };
  delete bookObject._userId;
  try {
    const book = await Book.findOne({ _id: req.params.id });
    if (book.userId !== req.auth.userId) {
      return res.status(403).json({ error: "Non autorisé !" });
    }
    // On met à jour le livre avec les nouvelles données en vérifiant l'id du livre
    await Book.updateOne(
      { _id: req.params.id },
      { ...bookObject, _id: req.params.id }
    );
    res.status(200).json({ message: "Objet modifié !" });
  } catch (error) {
    res.status(400).json({ error });
  }
};

exports.deleteBook = async (req, res, next) => {
  try {
    // On récupère le livre grâce à son ID
    const book = await Book.findOne({ _id: req.params.id });
    // On vérifie si l'ID utilisateur correspond à celui du livre
    if (book.userId !== req.auth.userId) {
      res.status(403).json({ message: "Non autorisé !" });
    }

    // On supprime le fichier image
    const filename = book.imageUrl.split("/images/")[1];
    fs.promises.unlink(`images/${filename}`);
    // On supprime le livre
    await Book.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: "Objet supprimé !" });
  } catch (error) {
    res.status(400).json({ error });
  }
};

exports.getAllBooks = async (req, res, next) => {
  try {
    // On récupère tous les livres
    const books = await Book.find();
    res.status(200).json(books);
  } catch (error) {
    res.status(404).json({ error });
  }
};

exports.getBestRating = async (req, res, next) => {
  try {
    // On récupère les 3 livres les mieux notés
    const books = await Book.find().sort({ averageRating: -1 }).limit(3);
    res.status(200).json(books);
  } catch (error) {
    res.status(404).json({ error });
  }
};

exports.rateBook = async (req, res, next) => {
  // On recupère l'ID du livre et l'ID de l'utilisateur ainsi que la note
  const bookId = req.params.id;
  const userId = req.auth.userId;
  const rating = req.body.rating;
  try {
    // On récupère le livre grâce à son ID
    const book = await Book.findOne({ _id: bookId });
    // On vérifie si l'utilisateur a déjà noté le livre
    const ratingIndex = book.ratings.findIndex(
      (rating) => rating.userId === userId
    );
    // Si l'utilisateur n'a pas encore noté le livre, on ajoute sa note
    if (ratingIndex === -1) {
      book.ratings.push({ userId, grade: rating });
    } else {
      // Si l'utilisateur a déjà noté le livre, on met à jour sa note
      book.ratings[ratingIndex].grade = rating;
    }
    // On calcule la moyenne des notes
    const averageRating =
      book.ratings.reduce((sum, rating) => sum + rating.grade, 0) /
      book.ratings.length;
    book.averageRating = averageRating;
    // On met à jour le livre
    await Book.updateOne({ _id: bookId }, book);
    res.status(200).json({ book });
  } catch (error) {
    res.status(400).json({ error });
  }
};
