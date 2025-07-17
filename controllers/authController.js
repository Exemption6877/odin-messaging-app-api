const db = require("../prisma/queries");

async function signUp(req, res) {
  try {
    const { email, username, password } = req.body;

    // Add check for existing user!

    const userInput = {
      email,
      username,
      password,
    };

    const data = await db.user.signUp(userInput);
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

    const data = await db.user.findByEmail(userInput);

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
