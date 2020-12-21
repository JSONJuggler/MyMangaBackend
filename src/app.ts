import express, { Application } from "express";

const app: Application = express();
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

app.use(express.json());

app.use("/api/manga", require("./routes/api/manga"));
app.use("/api/build", require("./routes/api/build"));
