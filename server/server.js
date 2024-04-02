const express = require("express");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const miscellaneousRoutes = require("./routes/miscellaneousRoutes");
const gameRoutes = require("./routes/gameRoutes");
const dotenv = require("dotenv");
const app = express();
const cors = require("cors");
const { protect } = require("./middleware/authMiddleware");

dotenv.config();
const corsOptions = {
    origin: ["http://localhost:3000", "https://explodingkittengame.vercel.app"],
    optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

connectDB();

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.use("/api/user", userRoutes);
app.use("/api", protect, miscellaneousRoutes);
app.use("/api/game", protect, gameRoutes);

app.listen(process.env.PORT || 5000, () => {
    console.log(`Server started on port ${process.env.PORT}`);
});
