const fetch = require("node-fetch");
const FormData = require("form-data");

module.exports = async (req, res) => {
    // добавляем CORS-заголовки для разрешения всего
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "*");
    res.setHeader("Access-Control-Allow-Headers", "*");

    // обрабатываем preflight-запросы (OPTIONS)
    if (req.method === 'OPTIONS') {
        return res.status(204).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        // проверяем, содержит ли запрос файл
        if (!req.files || !req.files.image) {
            return res.status(400).json({ error: "No image file provided" });
        }

        const { server, lemmyToken } = req.body;
        const imageFile = req.files.image;

        // создаём форму для отправки
        const form = new FormData();
        form.append("image", imageFile.data);

        const response = await fetch(`https://${server}/api/v3/pictrs/image`, {
            method: "POST",
            headers: {
                "authorization": `Bearer ${lemmyToken}`
            },
            body: form
        });

        const data = await response.json();
        res.status(response.status).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
