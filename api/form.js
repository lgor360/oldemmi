const fetch = require("node-fetch");
const FormData = require("form-data");
const fileUpload = require("express-fileupload"); // нужно установить

module.exports = async (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "*");
    res.setHeader("Access-Control-Allow-Headers", "*");

    if (req.method === 'OPTIONS') return res.status(204).end();
    if (req.method !== 'POST') return res.status(405).json({ error: "Method not allowed" });

    try {
        if (!req.body || !req.body.image || !req.body.server || !req.body.lemmyToken) {
            return res.status(400).json({ error: "no needed params provided :(" });
        }

        const { server, lemmyToken, image } = req.body;

        // создаём form-data
        const form = new FormData();
        form.append("image", image.data);

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
