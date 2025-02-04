const fetch = require("node-fetch");
const FormData = require("form-data");
const multer = require("multer");
const upload = multer();

module.exports = async (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "*");
    res.setHeader("Access-Control-Allow-Headers", "*");

    if (req.method === 'OPTIONS') return res.status(204).end();
    if (req.method !== 'POST') return res.status(405).json({ error: "Method not allowed" });

    // обрабатываем form-data
    upload.none()(req, res, async (err) => {
        if (err) return res.status(400).json({ error: "form-data parse error" });

        try {
            const { server, lemmyToken } = req.body;
            const image = req.file; // multer автоматически парсит файлы

            if (!image || !server || !lemmyToken) {
                return res.status(400).json({ error: "no needed params provided :(" });
            }

            // создаём form-data
            const form = new FormData();
            form.append("image", image.buffer, image.originalname);

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
    });
};
