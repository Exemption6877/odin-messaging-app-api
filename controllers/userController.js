const db = require("../prisma/queries");
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const saltRounds = 10;

async function getUser(req, res) {
  try {
    const paramsId = Number(req.params.userId);
    const sessionId = Number(req.user.id);

    if (paramsId !== sessionId) {
      return res.status(403).json("Insufficient priveleges");
    }

    const user = await db.user.findById(paramsId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: "Could not get user data" });
  }
}

async function updateUser(req, res) {
  try {
    const paramsId = Number(req.params.userId);
    const sessionId = Number(req.user.id);
    const { username, email, password, confirmPassword } = req.body;

    if (paramsId !== sessionId) {
      return res.status(403).json("Insufficient privileges");
    }

    const result = validationResult(req);

    if (!result.isEmpty()) {
      return res.status(400).json({ errors: result.array() });
    }

    const user = await db.user.findById(paramsId);

    const isMatch = await bcrypt.compare(confirmPassword, user.password);

    if (!isMatch) {
      return res.status(401).json({ error: "Incorrect password" });
    }

    let updatedPassword = user.password;

    if (password) {
      updatedPassword = await bcrypt.hash(password, saltRounds);
    }

    const updateData = {
      id: paramsId,
      username: username || user.username,
      email: email || user.email,
      password: updatedPassword,
    };

    const returnedData = await db.user.updateUser(updateData);

    res.status(201).json(returnedData);
  } catch (err) {
    res.status(500).json({ error: "Could not update user data" });
  }
}


module.exports = { getUser, updateUser };

// const { prevPassword } = req.body; // must match existing for changes
