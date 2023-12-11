const sharp = require("sharp");

// Middleware pour compresser les images
const compressImage = async (req, res, next) => {
  // On récupère le nom de l'image
  const name = req.file.originalname.split(" ").join("_").split(".")[0];
  console.log(name);
  // On ajoute un timestamp pour rendre le nom unique
  const timestamp = Date.now();
  //  On crée le nom du fichier
  const filename = `${name}_${timestamp}.webp`;
  // On crée le chemin du fichier
  const path = `images/${filename}`;

  // On compresse l'image
  await sharp(req.file.buffer)
    .toFormat("webp")
    .webp({ quality: 80 })
    .toFile(path);

  // On ajoute le nom du fichier à la requête
  req.file.filename = filename;
  next();
};

module.exports = { compressImage };
