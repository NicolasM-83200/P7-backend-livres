const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    // on récupère le token dans le header de la requête
    const token = req.headers.authorization.split(" ")[1];
    // on décode le token avec la clé secrète
    const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET);
    // on extrait l'ID utilisateur du token
    const userId = decodedToken.userId;
    // si la demande contient un ID utilisateur, on le compare à celui extrait du token
    req.auth = {
      userId: userId,
    };
    next();
  } catch {
    res.status(401).json({
      error: new Error("Requête non authentifiée !"),
    });
  }
};
