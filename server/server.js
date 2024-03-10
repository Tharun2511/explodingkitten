const express = require("express");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const miscellaneousRoutes = require("./routes/miscellaneousRoutes");
const gameRoutes = require("./routes/gameRoutes");
const dotenv = require("dotenv");
const app = express();
const cors = require('cors');

const corsOptions ={
    origin:'https://explodingkittengame.vercel.app', 
    
    optionSuccessStatus:200
}
app.use(cors(corsOptions));

dotenv.config();
connectDB();

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.use("/api", miscellaneousRoutes);
app.use("/api/user", userRoutes);
app.use("/api/game", gameRoutes);

app.listen(process.env.PORT, () => {
    console.log(`Server started on port ${process.env.PORT}`);
});
