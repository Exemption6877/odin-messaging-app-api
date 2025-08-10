const { message } = require("../prisma/prisma");
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

async function updateProfile(req, res) {
  try {
    const { desc, status_msg, pfp } = req.body;
    const userId = Number(req.params.userId);

    const prev = await db.profile.findById(userId);

    const parseData = {
      desc: desc || prev.desc,
      status_msg: status_msg || prev.status_msg,
      pfp: pfp || prev.pfp,
      userId: userId,
    };

    const result = await db.profile.updateProfile(parseData);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: "Could not update profile" });
  }
}

async function partialFind(req, res) {
  try {
    const { username } = req.query;

    let result;
    if (!username) {
      result = await db.profile.getAll();
    } else {
      result = await db.profile.partialFind(username);
    }

    if (result.length === 0) {
      return res.status(404).json({ error: "No profiles found" });
    }

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: "Could not find profiles" });
  }
}

async function addFriend(req, res) {
  try {
    const userId = Number(req.user.id);
    const profileId = Number(req.params.profileId);

    if (userId === profileId) {
      return res
        .status(400)
        .json({ error: "You cannot add yourself as a friend" });
    }

    const chosenProfile = await db.profile.findById(profileId);

    // if (!chosenProfile) {
    //   return res.status(404).json({ error: "Profile not found" });
    // }

    await db.profile.addFriend(userId, profileId);

    return res.status(201).json({ message: "User has been added to friends" });
  } catch (err) {
    res.status(500).json({ error: "Could not add friend" });
  }
}

async function getFriends(req, res) {
  try {
    const userId = Number(req.user.id);

    const result = await db.profile.allFriends(userId);

    return res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: "Could not find friends" });
  }
}

module.exports = {
  getProfile,
  postProfile,
  updateProfile,
  partialFind,
  addFriend,
  getFriends,
};
