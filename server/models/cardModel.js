const mongoose = require("mongoose");

const cardSchema = new mongoose.Schema({
    cardNumber: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        enum: ["Cat", "Defuse", "Shuffle", "ExplodingKitten"],
        required: true,
    },
    isOpened: {
        type: Boolean,
        default: false,
        required: true,
    },
});

const Card = mongoose.models.cards || mongoose.model("Card", cardSchema);
module.exports = Card;