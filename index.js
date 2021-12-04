const express = require("express");
const cors = require("cors");
const app = express();
const morgan = require("morgan");
const { connectSQLDB } = require("./config/connectDB");

connectSQLDB();

app.use(cors());
app.use(express.json({ extended: true }));

app.use(morgan("tiny"));

app.get("/", (req, res) => {
  return res.send("welcome to express");
});

app.use("/api", require("./routes/api/index"));

const PORT = 3017 || process.env.PORT;

app.listen(PORT, () => console.log(`server running on port ${PORT}`));
