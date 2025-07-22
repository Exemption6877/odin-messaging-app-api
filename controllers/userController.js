const db = require("../prisma/queries");

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
    console.error("getUser ERROR:", err);
    res.status(500).json({ error: err });
    // res.status(500).json({ error: "Could not get user data" });
  }
}

module.exports = { getUser };

// const { prevPassword } = req.body; // must match existing for changes
