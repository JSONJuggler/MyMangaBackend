import express, { Application } from 'express';
import fs from 'fs';
import path from 'path';
import remark from 'remark';
import html from 'remark-html';
import highlight from 'remark-highlight.js';
import report from 'vfile-reporter';
import lint from 'remark-preset-lint-recommended';
import gfm from 'remark-gfm';

const app: Application = express();
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

app.use(express.static(path.join(__dirname, '../public')));

app.use(express.json());

app.get('/', (req, res) => {
  let path = __dirname + '/../README.md';

  fs.readFile(path, 'utf8', async (err, data) => {
    if (err) {
      console.log(err);
    }
    remark()
      .use(lint)
      .use(highlight)
      .use(gfm, { tableCellPadding: true, tablePipeAlign: false })
      .use(html)
      .process(data, (err, file) => {
        console.error(report(err || file));
        res.send(
          '<link rel="stylesheet" type="text/css" href="/css/styles.css" />' +
            file.toString()
        );
      });
  });
});

app.use('/api/manga', require('./routes/api/manga'));
app.use('/api/crawl', require('./routes/api/crawl'));
