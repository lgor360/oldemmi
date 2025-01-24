const express = require('express');
const bodyParser = require('body-parser');
const { marked } = require('marked');

const app = express();
app.use(bodyParser.json()); // изменено на json, так как мы передаем JSON

app.post('/convert', (req, res) => {
    let markdownText = req.body.marktext;

    // если marktext не переданo
    if (!markdownText) {
        return res.status(400).send('No marktext field found in request body');
    }

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
        console.error('Error processing markdown:', err); // логирование ошибки
        res.status(500).send('Error processing markdown');
    }
});

const port = 3000;
app.listen(port, () => {
    console.log(`server running on port ${port}`);
});
