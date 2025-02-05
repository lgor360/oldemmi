const fetch = require("node-fetch");
import { LemmyHttp } from "lemmy-js-client";

module.exports = async (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "*");
    res.setHeader("Access-Control-Allow-Headers", "*");

    if (req.method === 'OPTIONS') return res.status(204).end();
    if (req.method !== 'POST') return res.status(405).json({ error: "Method not allowed" });

    try {
        if (!req.body || typeof req.body !== "object") {
            return res.status(400).json({ error: "invalid json input" });
        }

        const { server, lemmyToken, image } = req.body;
        if (!server || !lemmyToken || !image) {
            return res.status(400).json({ error: "no needed params provided :(" });
        }

        const lemmy = new LemmyHttp(`https://${server}`);
        
        // загружаем изображение
        const responseData = await lemmy.uploadImage({ image: image });

        res.status(200).json(responseData.json());
    } catch (error) {
        console.error("upload error:", error);
        res.status(500).json({ error: error.message });
    }
};
