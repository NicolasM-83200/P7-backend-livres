const multer = require("multer");

// const MIME_TYPES = {
//   "image/jpg": "jpg",
//   "image/jpeg": "jpg",
//   "image/png": "png",
// };

// const storage = multer.diskStorage({
//   destination: (req, file, callback) => {
//     callback(null, "images");
//   },
//   filename: (req, file, callback) => {
//     const name = file.originalname.split(" ").join("_");
//     const extension = MIME_TYPES[file.mimetype];
//     // const extension = "webp";
//     callback(null, name + Date.now() + "." + extension);
//   },
// });

const storage = multer.memoryStorage();
// fait appel à la fonction memoryStorage() de multer qui permet de stocker les fichiers dans la mémoire
module.exports = multer({ storage: storage }).single("image");
