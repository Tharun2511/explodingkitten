const User = require("../models/userModel");

const fetchLeaderBoard = async (req, res) => {
    let users = await User.find({});
    users.sort((a, b) => b.numberOfWins - a.numberOfWins);
    users = users.slice(0, 100);
    res.status(200).json(users);
}

module.exports = { fetchLeaderBoard };