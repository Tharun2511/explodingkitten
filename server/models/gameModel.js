const mongoose = require("mongoose");

const gameSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        cards: {
            type:Array,
            required: true,
        },
        status: {
            type: String,
            enum: ["inProgress", "won", "lost"],
            default: "inProgress",
        },
    },
    {
        timestamps: true,
    }
);

const Game = mongoose.models.games || mongoose.model("Game", gameSchema);
module.exports = Game;