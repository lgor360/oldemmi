const fetch = require("node-fetch");
const FormData = require("form-data");

module.exports = async (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "*");
    res.setHeader("Access-Control-Allow-Headers", "*");

    if (req.method === 'OPTIONS') return res.status(204).end();
    if (req.method !== 'POST') return res.status(405).json({ error: "Method not allowed" });

    try {
        const { server, lemmyToken, image } = req.body;

        if (!server || !lemmyToken || !image) {
            return res.status(400).json({ error: "no needed params provided :(" });
        }

        // конвертируем base64 в буфер
        const imageBuffer = Buffer.from(image, "base64");

        // создаём form-data
        const form = new FormData();
        form.append("images[]", imageBuffer, { filename: "upload.png" });

        const response = await fetch(`https://${server}/api/v3/pictrs/image`, {
            method: "POST",
            headers: {
                "authorization": `Bearer ${lemmyToken}`
            },
            body: form
        });

        // проверяем, что ответ не пустой
        const textResponse = await response.text();
        if (!textResponse) {
            throw new Error("empty response from server");
        }

        const data = JSON.parse(textResponse);
        res.status(response.status).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
