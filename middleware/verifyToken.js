const jwt = require("jsonwebtoken");
const JWT_KEY = process.env.JWT_KEY;

function verifyToken(req, res, next) {
  const rawToken = req.header("Authorization");

  if (!rawToken) return res.status(401).json({ error: "Access denied" });

  try {
    const token = rawToken.split(" ")[1];

    const payload = jwt.verify(token, JWT_KEY);
    req.user = payload;
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
}

module.exports = verifyToken;
