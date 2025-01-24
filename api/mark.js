const express = require('express');
const bodyParser = require('body-parser');
const { marked } = require('marked');

const app = express();
app.use(bodyParser.json()); // используем json для парсинга тела запросов

app.post('/api/mark.js', (req, res) => {
    let markdownText = req.body.marktext;

    // если marktext не передан
    if (!markdownText) {
        console.log('error: no marktext found, received body:', req.body); // логируем тело запроса
        return res.status(400).json({ 
            error: "No marktext field found in request body", 
            received: req.body, // возвращаем тело запроса
            status: 400 
        });
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
        console.error('error processing markdown:', err); // логируем ошибку
        res.status(500).json({
            error: "Error processing markdown",
            message: err.message,
            stack: err.stack, // возвращаем стек ошибки для отладки
            received: req.body, // возвращаем тело запроса
            status: 500
        });
    }
});

const port = 3000;
app.listen(port, () => {
    console.log(`server running on port ${port}`);
});
