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

    const { url, method = 'POST', headers, body } = req.body;
    
    // если тело запроса содержит FormData, передаем его как есть
    try {
        const response = await fetch(url, { method, headers, body });
        const contentType = response.headers.get('content-type');
        
        if (contentType && contentType.includes('application/json')) {
            const data = await response.json();
            res.status(response.status).json(data);
        } else {
            const text = await response.text();
            res.status(response.status).send(text); // возвращаем текстовый ответ (например, для изображения)
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
