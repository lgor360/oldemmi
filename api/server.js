const fetch = require("node-fetch");

module.exports = async (req, res) => {
    // добавляем CORS-заголовки для разрешения всего
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "*");
    res.setHeader("Access-Control-Allow-Headers", "*");

    // обрабатываем preflight-запросы (OPTIONS)
    if (req.method === 'OPTIONS') {
        return res.status(204).end(); // успешный ответ для preflight
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { url, method = 'GET', headers, body } = req.body;
    try {
        const response = await fetch(url, { method, headers, body: JSON.stringify(body) });
        const data = await response.json();
        res.status(response.status).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
