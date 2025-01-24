const express = require('express');
const bodyParser = require('body-parser');
const { marked } = require('marked');

const app = express();
app.use(bodyParser.text());

app.post('/convert', (req, res) => {
    let markdownText = req.body.marktext;

    try {
        // замена !community@instance на ссылки
        markdownText = markdownText.replace(/!([\w\d_]+)@([\w\d\.-]+)/g, (match, community, instance) => {
            const url = `https://oldemmi.vercel.app/community?server=${instance}&community=${community}`;
            return `<a href="${url}" rel="noopener noreferrer">${community}@${instance}</a>`;
        });
        // обработка ::: spoiler
        markdownText = markdownText.replace(/::: spoiler (.+?)\n([\s\S]+?)\n:::/g, 
            '<details><summary>$1</summary><div>$2</div></details>');
      
        // конвертация markdown в html
        const html = marked(markdownText);
        res.send(html);
    } catch (err) {
        res.status(500).send('error processing markdown');
    }
});

const port = 3000;
app.listen(port, () => {
    console.log(`server running on port ${port}`);
});
