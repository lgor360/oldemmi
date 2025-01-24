const express = require('express');
const bodyParser = require('body-parser');
const { marked } = require('marked');

const app = express();
app.use(bodyParser.json()); // используем json, так как это основной формат данных

// изменим путь на /api/mark.js
app.post('/api/mark.js', (req, res) => {
    let markdownText = req.body.marktext;

    // если marktext не передан
    if (!markdownText) {
        return res.status(400).json({ 
            error: "No marktext field found in request body", 
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
        console.error('Error processing markdown:', err); // логируем ошибку на сервере

        // возвращаем полную ошибку с деталями
        res.status(500).json({
            error: "Error processing markdown",
            message: err.message,
            stack: err.stack, // возвращаем стек ошибки для отладки
            status: 500
        });
    }
});

const port = 3000;
app.listen(port, () => {
    console.log(`server running on port ${port}`);
});
