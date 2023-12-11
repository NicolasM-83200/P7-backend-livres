const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

exports.signup = (req, res, next) => {
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      const user = new User({
        email: req.body.email,
        password: hash,
      });
      user
        .save()
        .then(() => res.status(201).json({ message: "Utilisateur créé !" }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => {
      console.log("Error :", error);
      res.status(500).json({ error });
    });
};

exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then((userFound) => {
      if (!userFound) {
        return res
          .status(401)
          .json({ error: "Identifiant ou Mot de passe incorrect !" });
      }
      bcrypt
        .compare(req.body.password, userFound.password)
        .then((valid) => {
          if (!valid) {
            return res
              .status(401)
              .json({ error: "Identifiant ou Mot de passe incorrect !" });
          }
          res.status(200).json({
            userId: userFound._id,
            token: jwt.sign(
              { userId: userFound._id },
              process.env.TOKEN_SECRET,
              {
                expiresIn: "24h",
              }
            ),
          });
        })
        .catch((error) => {
          console.log("Error :", error);
          res.status(500).json({ error });
        });
    })
    .catch((error) => {
      console.log("Error :", error);
      res.status(500).json({ error });
    });
};
