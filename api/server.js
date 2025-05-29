const fetch = require("node-fetch");
const url = require("url");

module.exports = async (req, res) => {
    // добавляем CORS-заголовки для разрешения всего
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "*");
    res.setHeader("Access-Control-Allow-Headers", "*");

    // обрабатываем preflight-запросы (OPTIONS)
    if (req.method === 'OPTIONS') {
        return res.status(204).end(); // успешный ответ для preflight
    }

    if (req.method!== 'POST') {
        if (req.method!== 'GET') {
            return res.status(405).json({ error: "Method not allowed" });
        }
    }

    let { url: requestUrl, method = 'GET', headers, body, need = "json"} = req.body;

    if (req.method === 'GET') {
        const urlParts = url.parse(req.url, true);
        requestUrl = urlParts.href;
        method = 'GET';
        headers = {};
        body = {};
        for (const key in urlParts.query) {
            if (urlParts.query.hasOwnProperty(key)) {
                body[key] = urlParts.query[key];
            }
        }
    }

    try {
        const response = await fetch(requestUrl, { method, headers, body: JSON.stringify(body) });
        if (need == "text") {
            const data = await response.text();
            res.status(response.status).send(data);
        } else {
            const data = await response.json();
            res.status(response.status).json(data);
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
