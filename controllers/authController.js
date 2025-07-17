const db = require("../prisma/queries");
const { validationResult } = require("express-validator");

async function signUp(req, res) {
  try {
    const { email, username, password } = req.body;

    const inputData = {
      email,
      username,
      password,
    };

    const result = validationResult(req);

    if (!result.isEmpty()) {
      return res.status(400).json({ errors: result.array() });
    }

    const emailCheck = await db.user.findByEmail(email);
    if (emailCheck) {
      return res.status(403).json({ error: "Email has been already taken" });
    }

    const usernameCheck = await db.user.findByUsername(username);
    if (usernameCheck) {
      return res.status(403).json({ error: "Username has been already taken" });
    }

    const data = await db.user.signUp(inputData);
    delete data.password;

    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ error: "Could not create user" });
  }
}

async function logIn(req, res) {
  try {
    const { email, password } = req.body;
    const userInput = { email, password };

    const data = await db.user.findByEmail(email);

    if (!data) {
      return res.status(404).json({ error: "User not found" });
    }

    if (data.password !== userInput.password) {
      return res.status(403).json({ error: "Incorrect password" });
    }

    res.status(200).json({ message: "Login successful" });
  } catch (err) {
    res.status(500).json({ error: "Could not login user" });
  }
}

module.exports = { signUp, logIn };
