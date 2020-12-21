import express, { Application } from "express";
import fs from "fs";
import remark from "remark";
import html from "remark-html";

const app: Application = express();
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

app.use(express.json());

app.get("/", (req, res) => {
  let path = __dirname + "/../README.md";

  fs.readFile(path, "utf8", async (err, data) => {
    if (err) {
      console.log(err);
    }
    const result = await remark().use(html).process(data);

    res.send(result.toString());
  });
});

app.use("/api/manga", require("./routes/api/manga"));
app.use("/api/build", require("./routes/api/build"));
