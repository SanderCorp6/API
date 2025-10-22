const express = require("express");
const cors = require('cors');
const app = express();
const authRouter = require("./routes/authRouter");
require("dotenv").config();

app.use(express.json());
app.use(cors());


app.use("/auth", authRouter);

app.get('/', (req, res) => {
    res.send('Welcome to RRHH API');
})

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running -> http://localhost:${PORT}`);
});