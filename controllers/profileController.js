const db = require("../prisma/queries");

async function getProfile(req, res) {
  try {
    const userId = Number(req.params.userId);

    const data = await db.profile.findById(userId);

    if (!data) {
      return res.status(404).json({ error: "Profile not found" });
    }

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: "Could not fetch profile" });
  }
}

async function postProfile(req, res) {
  try {
    const { desc, status_msg, pfp } = req.body;
    const userId = Number(req.params.userId);

    const parseData = {
      desc,
      status_msg,
      pfp,
      userId,
    };

    const result = await db.profile.createProfile(parseData);

    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: "Could not create profile" });
  }
}

module.exports = { getProfile, postProfile };
