const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true,

    },
    lastname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    gender: {
        type: String,
        enum: ["male", "female"],
        required: true,
    },
    dob: {
        type: Date,
        required: true,
    },
    prevGame: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "game",
        default: null,
    },
    prevGameCompleted: {
        type: Boolean,
        default: true,
    },
    numberOfWins: {
        type: Number,
        default: 0,
    },
    numberOfGames: {
        type: Number,
        default: 0,
    }
});

const User = mongoose.models.users || mongoose.model("User", userSchema);
module.exports = User;