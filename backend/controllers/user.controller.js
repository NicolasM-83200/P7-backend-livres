const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

exports.signup = async (req, res, next) => {
  try {
    // On crypte le mot de passe
    const hash = await bcrypt.hash(req.body.password, 10);
    // On crée un nouvel utilisateur avec l'email et le mot de passe crypté
    const user = new User({
      email: req.body.email,
      password: hash,
    });
    // On enregistre l'utilisateur dans la base de données
    await user.save();
    res.status(201).json({ message: "Utilisateur créé !" });
  } catch (error) {
    console.log("Error :", error);
    res.status(400).json({ error });
  }
};

exports.login = async (req, res, next) => {
  try {
    // On cherche l'utilisateur dans la base de données
    const userFound = await User.findOne({ email: req.body.email });
    if (!userFound) {
      return res
        .status(401)
        .json({ error: "Identifiant ou Mot de passe incorrect !" });
    }
    // On compare le mot de passe entré avec le mot de passe enregistré dans la base de données
    const valid = await bcrypt.compare(req.body.password, userFound.password);
    if (!valid) {
      return res
        .status(401)
        .json({ error: "Identifiant ou Mot de passe incorrect !" });
    }
    // On renvoie l'ID utilisateur et un token
    res.status(200).json({
      userId: userFound._id,
      token: jwt.sign({ userId: userFound._id }, process.env.TOKEN_SECRET, {
        expiresIn: "24h",
      }),
    });
  } catch (error) {
    console.log("Error :", error);
    res.status(500).json({ error });
  }
};
