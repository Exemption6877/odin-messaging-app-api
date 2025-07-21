const db = require("../prisma/queries");

async function getProfile(req, res) {
  try {
    const profileId = Number(req.params.profileId);

    const data = await db.profile.findById(profileId);

    if (!data) {
      return res.status(404).json({ error: "Profile not found" });
    }

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: "Could not fetch profile" });
  }
}

module.exports = { getProfile };
