const express = require("express");
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");
const bookCtrl = require("../controllers/book.controller");
const sharp = require("../middleware/sharp-config");

// Création du routeur Express
const router = express.Router();

router.get("/", bookCtrl.getAllBooks);
router.get("/:id", bookCtrl.getOneBook);
// route GET /api/books/bestrating
router.post("/", auth, multer, sharp.compressImage, bookCtrl.createBook);
router.put("/:id", auth, multer, sharp.compressImage, bookCtrl.modifyBook);
router.delete("/:id", auth, bookCtrl.deleteBook);
// route POST /api/books/:id/rating

module.exports = router;
