const jwt = require("jsonwebtoken");

const JWT_KEY = process.env.JWT_KEY;

function issueToken(user) {
  const payload = { id: user.id, username: user.name, email: user.email };

  const token = jwt.sign(payload, JWT_KEY, { expiresIn: "24h" });

  return "Bearer " + token;
}

module.exports = issueToken;
