const User = require("../models/userModel");
const generateToken = require("../config/generateToken");

const registerUser = async (req, res) => {
    const { firstname, lastname, email, password, gender, dob } = req.body;
    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        const newUser = new User({
            firstname,
            lastname,
            email,
            password,
            gender,
            dob,
        });

        const savedUser = await newUser.save();
        res.status(201).json({
            ...savedUser._doc,
            token: generateToken(savedUser._id),
            prevGameCompleted: true,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.password !== password) {
            return res.status(401).json({ message: "Invalid password" });
        }

        res.status(200).json({
            ...user._doc,
            token: generateToken(user._id),
        });
    } catch (error) {
        res.status(500).json(error);
    }
};

module.exports = { registerUser, loginUser };
