const Game = require("../models/gameModel");
const User = require("../models/userModel");

const createNewGame = async (req, res) => {
    const { userId } = req.body;
    try {
        const userExists = await User.findOne({ _id: userId });
        if (!userExists) {
            return res.status(404).json({
                message: "User not found and cannot create a new game",
            });
        }
        const cards = generateCards();
        console.log(cards);
        const game = await Game.create({
            user: userExists._id,
            cards,
            status: "inProgress",
        });
        console.log(game);

        res.status(201).json(game);
    } catch (error) {
        res.status(500).json(error);
    }
};

const generateNewSetCards = async (req, res) => {
    const { gameId } = req.body;
    try {
        const game = await Game.findOne({ _id: gameId });
        if (!game) {
            return res.status(404).json({ message: "Game not found" });
        }
        const cards = generateCards();
        game.cards = cards;
        await game.save();
        res.status(200).json(cards);
    } catch (error) {
        res.status(500).json(error);
    }
};

const resumeGame = async (req, res) => {
    const { gameId } = req.body;
    try {
        const game = await Game.findOne({ _id: gameId });
        console.log(game);
        if (!game) {
            return res.status(404).json({ message: "Game not found" });
        } else {
            res.status(200).json(game);
        }
    } catch (error) {
        res.status(500).json(error);
    }
};

const endPrevGame = async (req, res) => {
    const { gameId } = req.body;
    try {
        const game = await Game.findOne({ _id: gameId });
        if (game) {
            game.status = "lost";
            await game.save();
            const user = await User.findOne({ _id: game.user });
            if (user) {
                user.prevGameCompleted = true;
                await user.save();
            }
        }
        res.status(200).json(game);
    } catch (error) {
        res.status(404).json({ message: "Game not found" });
    }
};

const updateCards = async (req, res) => {
    const { gameId, cards } = req.body;
    try {
        const game = await Game.findOneAndUpdate(
            { _id: gameId },
            {
                cards,
            },
            {
                new: true,
            }
        );
        res.status(200).json(game);
    } catch (error) {
        res.status(500).json(error);
    }
};

const handleWinGame = async (req, res) => {
    const { userId } = req.body;
    try {
        const user = await User.findOneAndUpdate(
            { _id: userId },
            {
                prevGameCompleted: true,
                $inc: {
                    numberOfGames: 1,
                    numberOfWins: 1,
                },
            },
            {
                new: true,
            }
        );
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json(error);
    }
};

const handleLoseGame = async (req, res) => {
    const { userId } = req.body;
    console.log("Handle Lose Called");
    try {
        const user = await User.findOneAndUpdate(
            { _id: userId },
            {
                prevGameCompleted: true,
                $inc: {
                    numberOfGames: 1,
                },
            },
            {
                new: true,
            }
        );
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json(error);
    }
};

const generateCards = () => {
    let cards = [];
    const cardNames = ["Cat", "Defuse", "Shuffle", "ExplodingKitten"];
    for (let i = 0; i < 5; i++) {
        cards.push({
            name: cardNames[Math.floor(Math.random() * 4)],
            isOpened: false,
            cardNumber: i + 1,
        });
    }
    return cards;
};

module.exports = {
    createNewGame,
    resumeGame,
    generateNewSetCards,
    endPrevGame,
    updateCards,
    handleWinGame,
    handleLoseGame,
};
