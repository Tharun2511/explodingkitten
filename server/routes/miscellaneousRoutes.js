const express = require("express");
const { fetchLeaderBoard } = require("../controllers/miscellaneousControllers");
const router = express.Router();

router.get("/leaderboard", fetchLeaderBoard);

module.exports = router;