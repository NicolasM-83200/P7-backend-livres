const express = require("express");
const auth = require("../middleware/auth");
const bookCtrl = require("../controllers/book.controller");
const sharp = require("../middleware/sharp-config");

// Création du routeur Express
const router = express.Router();

router.get("/", bookCtrl.getAllBooks);
router.get("/bestrating", bookCtrl.getBestRating);
router.get("/:id", bookCtrl.getOneBook);
router.post("/", auth, sharp.upload, sharp.compressImage, bookCtrl.createBook);
router.post("/:id/rating", auth, bookCtrl.rateBook);
router.put(
  "/:id",
  auth,
  sharp.upload,
  sharp.compressImage,
  bookCtrl.modifyBook
);
router.delete("/:id", auth, bookCtrl.deleteBook);

module.exports = router;
