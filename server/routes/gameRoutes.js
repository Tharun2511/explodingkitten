const express = require("express");
const {
    createNewGame,
    endPrevGame,
    resumeGame,
    generateNewSetCards,
    updateCards,
    handleWinGame,
    handleLoseGame,
} = require("../controllers/gameControllers");
const router = express.Router();

router.post("/new", createNewGame);
router.post("/resume", resumeGame);
router.put("/endprevgame", endPrevGame);
router.post("/shuffle", generateNewSetCards);
router.put("/updatecards", updateCards);
router.put("/win", handleWinGame);
router.put("/lose", handleLoseGame);

module.exports = router;
